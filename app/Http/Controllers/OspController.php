<?php

namespace App\Http\Controllers;

use App\Models\CollectionCenter;
use App\Models\Counter;
use App\Models\Customer;
use App\Models\OspConfig;
use App\Models\OspImport;
use App\Models\Osp;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Spatie\QueryBuilder\QueryBuilder;

class OspController extends Controller
{
    public function viewConfiguration(Request $request, $type = 'config')
    {
        auth()->user()->hasPermission('manage osp') ?: abort(403);

        if ($request->has('type')) {
            $type = $request->type;
        }

        switch ($type) {
            case 'config':
                $data = OspConfig::with('latestChange.causer', 'firstChange.causer')->paginate(10);
                break;

            case 'import':
                $data = NULL;
                break;

            case 'failed_osp_import':
                $data = OspImport::with('latestChange.causer', 'firstChange.causer')
                    ->where('status', 'failed')
                    ->orderBy('created_at', 'desc') // sort by latest created
                    ->paginate(10);
                break;

            case 'osp':
                $data = QueryBuilder::for(OSP::class)
                    ->with('latestChange.causer', 'firstChange.causer')
                    ->where('is_uploaded', 0)
                    ->orderBy('created_at', 'desc') 
                    ->paginate(10);

                $customer_not_exist = false;

                $data->getCollection()->transform(function ($osp) use (&$customer_not_exist) {
    
                    $customer = Customer::where('account_number', $osp->account_number)->first();

                    $osp->customer_exists = $customer ? true : false;

                    if (!$customer) {
                        $customer_not_exist = true;
                    }

                    return $osp;
                });

                $total_amount = $data->sum('amount');

                break;

            case 'plmis':
                $data = QueryBuilder::for(OSP::class)
                    ->with('latestChange.causer', 'firstChange.causer')
                    ->where('is_uploaded', 0)
                    ->orderBy('created_at', 'desc') 
                    ->paginate(10);

                $customer_not_exist = false;

                $data->getCollection()->transform(function ($osp) use (&$customer_not_exist) {
    
                    $customer = Customer::where('account_number', $osp->account_number)->first();

                    $osp->customer_exists = $customer ? true : false;

                    if (!$customer) {
                        $customer_not_exist = true;
                    }

                    return $osp;
                });

                $total_amount = $data->sum('amount');
                
                break;

            case 'saga':
                $data = NULL;
                break;

            default:
                return response()->json(['error' => 'Invalid type provided'], 400);
        }

        return Inertia::render('ReceiveProcess/Osp', [
            'currentRoute' => Route::currentRouteName(),
            'osp_data' => $data,
            'collection_centers' => CollectionCenter::with('counters')->get(),
            'counters' => Counter::all(),
            'cashiers' => User::all(),
            'total_amount' => $total_amount ?? 0,
            'import_type' => OspConfig::pluck('import_type')->unique(),
            'customer_not_exist' => $customer_not_exist ?? false
        ]);
    }

    public function config(Request $request)
    {
        auth()->user()->hasPermission('manage osp') ?: abort(403);
      
        $validate = request()->validate([
            'import_type' => 'string',
            'description' => 'string',
            'header' => 'nullable|string',
            'footer' => 'nullable|string',
            'collection_date_starting' => 'nullable|integer',
            'collection_date_length' => 'nullable|integer',
            'income_code_starting' => 'nullable|integer',
            'income_code_length' => 'nullable|integer',
            'account_number_starting' => 'nullable|integer',
            'account_number_length' => 'nullable|integer',
            'account_holder_name_starting' => 'nullable|integer',
            'account_holder_name_length' => 'nullable|integer',
            'amount_starting' => 'nullable|integer',
            'amount_length' => 'nullable|integer',
            'osp_receipt_starting' => 'nullable|integer',
            'osp_receipt_length' => 'nullable|integer',
            'identity_number_starting' => 'nullable|integer',
            'identity_number_length' => 'nullable|integer',
        ]);

        DB::beginTransaction();

        try {

            $ops_configuration = OspConfig::updateOrCreate(
                ['import_type' => $validate['import_type']], // unique condition
                $validate
            );

            DB::commit();

            activity()->performedOn($ops_configuration)->causedBy(auth()->user())->log("OSP telah dikemaskini");

            return redirect()->back()->with('success', 'Proses berjaya!');
        } catch (\Exception $e) {

            DB::rollBack();
            dd($e);
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function destroyConfig(OspConfig $ospConfig)
    {
        auth()->user()->hasPermission('manage osp') ?: abort(403);

        try {
            $ospConfig->delete();
            return redirect()->back()->with('success', 'Proses berjaya!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function import(Request $request)
    {
        auth()->user()->hasPermission('manage osp') ?: abort(403);

        $validate = request()->validate([
            // 'collection_center_id' => 'required|exists:collection_centers,id',
            // 'counter_id' => 'required|exists:counters,id',
            'import_type' => 'string',
            'file' => 'required|file|mimes:txt',
        ], [
            'file.required' => 'Fail diperlukan',
            'file.mimes' => 'Fail mestilah dalam format .txt',
        ]);
     
        DB::beginTransaction();

        try {

            $osp_import = OspImport::create([
                'collection_center_id' => CollectionCenter::where('name', 'OSP')->first()->id ?? 1, //$validate['collection_center_id'],
                'counter_id' => Counter::where('name', '99')->first()->id ?? 1, //$validate['counter_id'],
                'collection_date' => Carbon::now(),
                'import_type' => $validate['import_type'],
            ]);

            $osp_import->addMediaFromRequest('file')->toMediaCollection('osp_files');

            $file = $osp_import->getMedia('osp_files')->first();

            if (!$file) {
                DB::rollBack();
                return redirect()->back()->with('error', 'Fail belum diupload!')->withInput();
            }

            $import_type = OspConfig::where('import_type', $osp_import->import_type)->first();

            $filePath = $file->getPath();
            
            $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
     
            foreach ($lines as $line) {
       
                $collectionDate = $this->extractField($line, $import_type->collection_date_starting, $import_type->collection_date_length);
                $incomeCode     = $this->extractField($line, $import_type->income_code_starting, $import_type->income_code_length);
                $accountNumber  = $this->extractField($line, $import_type->account_number_starting, $import_type->account_number_length);
 
                $accountName    = $this->extractField($line, $import_type->account_holder_name_starting, $import_type->account_holder_name_length);
                $amount         = $this->extractField($line, $import_type->amount_starting, $import_type->collection_date_amount_lengthlength);
              
                $ospReceipt     = $this->extractField($line, $import_type->osp_receipt_starting, $import_type->osp_receipt_length);

                $identityNumber = $this->extractField($line, $import_type->identity_number_starting, $import_type->identity_number_length);


                $amount = floatval(str_replace(',', '', $amount));

                $osp = Osp::create([
                    'collection_center_id' => 3, // OSP Value
                    'counter_id' => Counter::where('name', '99')->first()->id, // OSP Valu
                    'collection_date' => Carbon::createFromFormat('dmY', $collectionDate)->format('Y-m-d H:i:s'),
                    'account_number' => $accountNumber,
                    'account_holder_name' => $accountName,
                    'osp_receipt_number' => $ospReceipt,
                    'amount' => $amount,
                    'identity_number' => $identityNumber,
                    'import_type' => $osp_import->import_type,
                    'income_code' => $incomeCode,
                ]);

            }

            DB::commit();

            activity()->performedOn($osp_import)->causedBy(auth()->user())->log("OSP telah dikemaskini");

            return to_route('osp.index')->with('success', 'Proses berjaya!')->with('error', null);;
        } catch (\Exception $e) {

            DB::rollBack();
            dd($e);
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function deleteImport(OspImport $osp_import)
    {
        auth()->user()->hasPermission('manage osp') ?: abort(403);
  
        DB::beginTransaction();

        try {
            $osp_import->delete();

            DB::commit();

            activity()->performedOn($osp_import)->causedBy(auth()->user())->log("OSP telah dipadam");

            return redirect()->back()->with('success', 'Proses berjaya!');
        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function deleteOsp(Osp $osp)
    {
        auth()->user()->hasPermission('manage osp') ?: abort(403);

        DB::beginTransaction();

        try {
            $osp->delete();

            DB::commit();

            activity()->performedOn($osp)->causedBy(auth()->user())->log("OSP telah dipadam");

            return redirect()->back()->with('success', 'Proses berjaya!');
        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }

    }

    public function updateOsp(Osp $osp)
    {
        auth()->user()->hasPermission('manage osp') ?: abort(403);

        $validate = request()->validate([
            'account_number' => 'nullable',
            'account_holder_name' => 'nullable',
            'amount' => 'nullable',

        ]);

        DB::beginTransaction();

        try {
            $osp->update($validate);

            DB::commit();

            activity()->performedOn($osp)->causedBy(auth()->user())->log("OSP telah dipadam");

            return redirect()->back()->with('success', 'Proses berjaya!');
        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function printOsp()
    {
        auth()->user()->hasPermission('manage osp') ?: abort(403);

        $osp = Osp::where('is_uploaded', 0)
                    ->orderBy('created_at', 'desc') 
                    ->limit(50)
                    ->get();
                    
        $pdf = Pdf::loadView('pdf.osp', compact('osp'));

        return $pdf->stream();
    }

    public function readyToBeUpload()
    {
        auth()->user()->hasPermission('manage osp') ?: abort(403);

        # Checking if all account number is not red ( account exist )
        // $osp = Osp::where('is_uploaded', 0)->get();

        // foreach ($osp as $item) {
        //     $customer = Customer::where('account_number', $item->account_number)->first();

        //     if(!$customer) {
        //         return redirect()->back()->with('erorr', "Sila kemaskini nombor akuan yang berwarna merah.");
        //     }
        // }

        $updatedCount = OSP::where('is_ready_to_be_upload', false)
            ->update(['is_ready_to_be_upload' => true]);

        return redirect()->back()->with('success', "Proses berjaya! {$updatedCount} rekod telah dikemaskini.");
    }

    public function endOspProcess()
    {
        auth()->user()->hasPermission('manage osp') ?: abort(403);

        $validate = request()->validate([
            'collection_center_id' => 'required|exists:collection_centers,id',
            'counter_id' => 'required|exists:counters,id',
            'cashier_id' => 'required|exists:users,id',
            'date' => 'required|date',
        ]);
  
        DB::beginTransaction();
        
        try {
            DB::commit();

            $osp_list = Osp::where('is_ready_to_be_upload', true)->where('is_uploaded', false)->get();

            foreach ($osp_list as $osp) {
                
                $dataA = [
                    'CENTER_CODE' => $osp->collection_center_id ?? '',
                    'SYSTEM_ID' => Customer::where('account_number', $osp->account_number)->first()->system ?? '',
                    'TX_DATE' => $osp->collection_date ?? '',
                    'RCPT_NO' => substr($osp->osp_receipt_number ?? '', -8),
                    'PERSON_ID' => substr($osp->identity_number ?? '', -12),   
                    'ACCT_NO' => $osp->account_number ?? '',                 
                    'OS_AMT' => $osp->amount ?? '',  
                    'PAID_AMT' => $osp->amount ?? '',         
                    'STATUS' => '',                 
                    'DISC_AMT' => NULL,
                    'OVERPYMT_AMT' => NULL,     
                    'TOPAID_AMT' => NULL,     
                    'RECORD_ID' => NULL,                 
                    'RD_AMT' => NULL,
                    'REMIT_AMT' => NULL,     
                ];

                $dataD = [
                    'RCPT_NO' => substr($osp->osp_receipt_number ?? '', -8),
                    'ACCT_NO' => $osp->account_number ?? '',     
                    'TX_TYPE' => '',
                    'TX_NO' => '',
                    'PAY_AMOUNT' => $osp->amount ?? '',     
                    'INSTALMENT' => '',
                    'INSTAL_REF' => '',                 
                    'ID_STAMP' => $validate['cashier_id'] ?? '',
                    'TIME_STAMP' => '',     
                    'SYSTEM_ID' => Customer::where('account_number', $osp->account_number)->first()->system ?? '',              
                    'TARGET_ID' => '',
                    'CENTER_CODE' => $osp->collection_center_id ?? '',     
                    'TX_DATE' => $osp->collection_date ?? '', 
                    'BILL_DATE' => $osp->collection_date ?? '',              
                    'DISC_AMT' => NULL,
                    'OVERPYMT_AMT' => NULL,                        
                ];

                $dataM = [
                    'CENTER_CODE' => $osp->collection_center_id ?? '',     
                    'COUNTER_NO' => $osp->counter_id ?? '',     
                    'RCPT_FROM' => '',
                    'TX_DATE' => $osp->collection_date ?? '', 
                    'RCPT_NO' => substr($osp->osp_receipt_number ?? '', -8),
                    'PAYMENT_TYPE' => '',                 
                    'PAYMENT_REF' => '',
                    'TOTAL_AMOUNT' => $osp->amount ?? '',   
                    'REMARKS' => '',                 
                    'RCPT_REF' => '',
                    'ID_STAMP' => $validate['cashier_id'] ?? '',    
                    'TIME_STAMP' => '',     
                    'OVERPYMT' => NULL,                 
                    'SYSTEM_ID' => Customer::where('account_number', $osp->account_number)->first()->system ?? '',         
                    'TARGET_ID' => '',                       
                    'LIC_TYPE' => '',     
                    'LICENSE' => '',     
                    'FILE_NO' => '',                 
                    'LICENSE_NO' => '',
                    'PERSON_ID' => substr($osp->identity_number ?? '', -12),   
                    'ACCT_NO' => $osp->account_number ?? '',               
                    'BANK_CODE' => '',
                    'CHQ_TYPE' => '', 
                    'REV_VOTE_HEAD' => '',         
                    'BANK_VOTE_HEAD' => '',                 
                    'VOID_IND' => '',
                    'VOID_ID' => '', 
                    'VOID_TIME' => '',                 
                    'CARD_NO' => '',
                    'OTOTAL_AMOUNT' => NULL, 
                    'RTOTAL_AMOUNT' => NULL, 
                    'PARTICULAR' => '',                 
                    'UPLOAD' => '',
                    'EXT_RCPT_NO' => '', 
                    'CPD_ID' => '', 
                    'DISCOUNT' => '',
                    'CPD_REFERENCE' => '', 
                    'RECORD_ID' => NULL, 
                ];

                    // Insert to local
                    // DB::table('paytran_a')->insert($dataA);
                    // DB::table('paytran_d')->insert($dataD);
                    // DB::table('paytran_m')->insert($dataM);

                    // Insert to PLMIS system
                    // DB::connection('plmis_mysql')->table('paytran_a')->insert($dataA);
                    // DB::connection('plmis_mysql')->table('paytran_d')->insert($dataD);
                    // DB::connection('plmis_mysql')->table('paytran_m')->insert($dataM);

                    // Insert to somewhere system
                    // DB::connection('')->table('paytran_a')->insert($dataA);
                    // DB::connection('')->table('paytran_d')->insert($dataD);
                    // DB::connection('')->table('paytran_m')->insert($dataM);

                    $osp->update([
                        'is_uploaded' => true
                    ]);
            }

            if($osp_list->count() > 0) {
                activity()->performedOn($osp)->causedBy(auth()->user())->log("OSP telah dimasukkan dalam PLMIS");
            }
            
            return redirect()->back()->with('success', "Proses berjaya!");
        } catch (\Exception $e) {

            DB::rollBack();
            dd($e);
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function updateOspReceipt()
    {
        auth()->user()->hasPermission('manage osp') ?: abort(403);

        $validate = request()->validate([
            'date' => 'required|date',
        ], [
            'date.required' => 'Tarikh perlu diisi',
            'date.date' => 'Tarikh tidak sah',
        ]);

        DB::beginTransaction();

        try {
            $count = 0;

            $osp_list = Osp::where('is_ready_to_be_upload', true)->get();

            foreach ($osp_list as $osp) {

                # Submit to PLMIS
                $this->uploadToPLMIS($osp);

                $osp->update([
                    'is_uploaded' => true
                ]);

                $count++;
            }

            DB::commit();

            activity()->performedOn($osp)->causedBy(auth()->user())->log("OSP telah dikemaskini");

            return redirect()->back()->with('success', "Proses berjaya! {$count} rekod telah dikemaskini.");
        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }

    }

    public function plmis()
    {
        auth()->user()->hasPermission('manage osp') ?: abort(403);

        $validate = request()->validate([
            'collection_center_id' => 'required|exists:collection_centers,id',
            'counter_id' => 'required|exists:counters,id',
            'user_id' => 'required|exists:users,id',
            'collection_date' => 'required|date',
            'cashier_balance' => 'required',
        ]);

        DB::beginTransaction();

        try {

            DB::commit();

            activity()->performedOn()->causedBy(auth()->user())->log("OSP telah dikemaskini");

            return redirect()->back()->with('success', 'Proses berjaya!');
        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function saga()
    {
        auth()->user()->hasPermission('manage osp') ?: abort(403);

        $validate = request()->validate([]);

        DB::beginTransaction();

        try {

            DB::commit();

            activity()->performedOn()->causedBy(auth()->user())->log("OSP telah dikemaskini");

            return redirect()->back()->with('success', 'Proses berjaya!');
        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    protected function uploadOSP(OspImport $osp_import)
    {
        $file = $osp_import->getMedia('osp_files')->first();

        if (!$file) {
            //throw new \Exception('No uploaded file found');
            return redirect()->back()->with('error', 'Fail belum diupload!')->withInput();
        }

        $import_type = OspConfig::where('import_type', $osp_import->import_type)->first();

        if (!$import_type) {
            //throw new \Exception('No config found');
            return redirect()->back()->with('error', 'Jenis import tidak ditemukan!')->withInput();
        }

        DB::beginTransaction();

        try {

            $filePath = $file->getPath(); // or $file->getPathRelativeToRoot() if needed
            $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

            foreach ($lines as $line) {
                // Use config to dynamically extract fields
                $collectionDate = trim(substr($line, $import_type->collection_date_starting, $import_type->collection_date_length));
                $incomeCode     = trim(substr($line, $import_type->income_code_starting, $import_type->income_code_length));
                $accountNumber  = trim(substr($line, $import_type->account_number_starting, $import_type->account_number_length));
                $accountName    = trim(substr($line, $import_type->account_holder_name_starting, $import_type->account_holder_name_length));
                $amount         = trim(substr($line, $import_type->amount_starting, $import_type->amount_length));
                $ospReceipt     = trim(substr($line, $import_type->osp_receipt_starting, $import_type->osp_receipt_length));
                $identityNumber = trim(substr($line, $import_type->identity_number_starting, $import_type->identity_number_length));

                // Optional: convert amount to float
                $amount = floatval(str_replace(',', '', $amount));

                // Create OSP record
                $osp = Osp::create([
                    'collection_center_id' => $osp_import->collection_center_id,
                    'counter_id' => $osp_import->counter_id,
                    'collection_date' => Carbon::createFromFormat('d/m/Y', $collectionDate)->format('Y-m-d H:i:s'),
                    'account_number' => $accountNumber,
                    'account_holder_name' => $accountName,
                    'osp_receipt_number' => $ospReceipt,
                    'amount' => $amount,
                    'identity_number' => $identityNumber,
                    'import_type' => $osp_import->import_type,
                    'income_code' => $incomeCode,
                ]);

                // info('OSP record created:', $osp->toArray());
            }

            DB::commit();

            return true;
        } catch (\Exception $e) {

            DB::rollBack();

            $osp_import->update(['status' => 'failed']);

            return to_route('osp.index')->with('error', 'Proses gagal!');
        }
    }

    protected function uploadToPLMIS($osp)
    {
        $osp->update([
            'is_ready_to_be_upload' => false
        ]);
    }

    private function extractField($line, $start, $length)
    {
        if (is_null($start) || is_null($length)) {
            return null;
        }

        return trim(substr($line, $start, $length));
    }
}
