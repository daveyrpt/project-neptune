<?php

namespace App\Http\Controllers;

use App\Models\Aurealloc;
use App\Models\Aureopit;
use App\Models\Bank;
use App\Models\BankDepositSlip;
use App\Models\CancelledReceipt;
use App\Models\CollectionCenter;
use App\Models\Counter;
use App\Models\Customer;
use App\Models\IncomeCode;
use App\Models\OpenedCounter;
use App\Models\PaymentType;
use App\Models\Receipt;
use App\Models\ReceiptDetail;
use App\Models\Role;
use App\Models\SettingTerminalManagement;
use App\Models\User;
use App\Notifications\ReceiptGenerated;
use App\Notifications\ReportGenerated;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class ReceiptController extends Controller
{
    public function index()
    {
        auth()->user()->hasPermission('read list of receipt') ?: abort(403);

        $receipts = QueryBuilder::for(Receipt::class)
            ->allowedFilters([
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->select('receipts.*')
                        ->join('counters', 'receipts.counter_id', '=', 'counters.id')
                        ->join('collection_centers', 'counters.collection_center_id', '=', 'collection_centers.id')
                        ->where(function ($query) use ($value) {
                            $query->where('counters.name', 'LIKE', '%' . $value . '%')
                                ->orWhere('collection_centers.name', 'LIKE', '%' . $value . '%')
                                ->orWhere('receipts.account_number', 'LIKE', '%' . $value . '%')
                                ->orWhere('receipts.receipt_number', 'LIKE', '%' . $value . '%')
                                ->orWhere('receipts.service', 'LIKE', '%' . $value . '%');
                        });
                }),
                AllowedFilter::callback('collection_center_id', function ($query, $value) {
                    $query->where('receipts.collection_center_id', $value);
                }),
                AllowedFilter::callback('counter_id', function ($query, $value) {
                    $query->where('counter_id', $value);
                }),
                AllowedFilter::callback('status', function ($query, $value) {
                    $query->where('status', $value);
                }),
                AllowedFilter::callback('start_date', function ($query, $value) {
                    $date = Carbon::createFromFormat('d-m-Y', $value)->format('Y-m-d');
                    $query->whereDate('date', '>=', $date);
                }),
                AllowedFilter::callback('end_date', function ($query, $value) {
                    $date = Carbon::createFromFormat('d-m-Y', $value)->format('Y-m-d');
                    $query->whereDate('date', '<=', $date);
            }),
            ])
            ->with('latestChange.causer', 'firstChange.causer', 'details')
            ->byUser()
            ->orderBy('date', 'desc')
            ->paginate(10);
       
        return Inertia::render('ReceiveProcess/ReceiveList', [
            'currentRoute' => Route::currentRouteName(),
            'receipts' => $receipts,
            'collection_centers'   => CollectionCenter::with('counters')->get(),
            'counters' => Counter::all(),
        ]);
    }

    public function view(Receipt $receipt)
    {
        auth()->user()->hasPermission('read receipt form') ?: abort(403);

        return Inertia::render('', [
            'currentRoute' => Route::currentRouteName(),
            'receipt' => $receipt
        ]);
    }

    public function create()
    {
        auth()->user()->hasPermission('create receipt form') ?: abort(403);

        if (auth()->user()->role->name === Role::NAME_CASHIER && empty(auth()->user()->currentCashierOpenedCounter()->first()->counter_id)) {
            return to_route('counter-and-collection-center.index')->with('error', 'Sila Pilih Kaunter terdahulu!');
        }

        # Get counter id. If not cashier, get counter id from request or default '1'
        if (auth()->user()->role->name === Role::NAME_CASHIER) {
            $counter_id = auth()->user()->currentCashierOpenedCounter()->first()->counter_id;
        } else {
            $counter_id = request('counter_id') ?? 1;
        }

        $current_receipt_number = $this->currentReceiptNumber($counter_id); 

        $prefix = substr($current_receipt_number, 0, -4);

        $lastNumber = intval(substr($current_receipt_number, -4));

        $lastNumber++;

        $current_receipt_number = $prefix . str_pad($lastNumber, 4, '0', STR_PAD_LEFT);
    
        # Total transaction made on this counter today

        $current_bill = Receipt::where('counter_id', auth()->user()->currentCashierOpenedCounter()->first()->counter_id ?? 1)->whereIn('status', Receipt::ACCEPTABLE_STATUSES)->whereDate('date', Carbon::today())->count();

        //List all customer with their account number but only unique
        $customersOptions = DB::table('customers')->select('account_number')->distinct()->get();
        //    dd($customersOptions);


        // $customers = [];
        // if (request()->has('account_number')) {
        //     $account_number = request('account_number');
        //     $account_number = '01000003Z';

        //     $customers = Cache::remember("search_joined_" . strtolower($account_number), 600, function () use ($account_number) {
        //         return DB::table('aureopit as a')
        //             ->join('aurealloc as b', 'a.MDU_ACC', '=', 'b.ACCT_NO')
        //             ->select(
        //                 'a.RCP_NM1 as name',
        //                 'a.MDU_ACC as acc_number',
        //                 'b.BILL_NO as bill_no',
        //                 'b.AMT as amount'
        //             )
        //             ->where('a.MDU_ACC', 'LIKE', '%' . $account_number . '%')
        //             ->limit(50)
        //             ->get();
        //     });

        //     dd($customers);
        // }

        // dd(SettingTerminalManagement::where('collection_center_id', auth()->user()->currentCashierOpenedCounter()->first()->collection_center_id ?? 1)->get());
        return Inertia::render('ReceiveProcess/Receive', [
            'currentRoute' => Route::currentRouteName(),
            'cashiers' => User::hasRole('cashier')->get(),
            'collection_centers'   => CollectionCenter::with('counters')->get(),
            'customers' => Customer::all(),
            //'customers' => $customers,
            'customersOptions' => $customersOptions->toArray(),
            // 'income_codes' => IncomeCode::all(),
            'income_codes' => SettingTerminalManagement::with('incomeCode')
            ->where('collection_center_id', auth()->user()->currentCashierOpenedCounter()->first()->collection_center_id ?? 1)
            ->get()
            ->pluck('incomeCode')  // Get only the related income_code models
            ->filter(),// Remove nulls in case of missing relations,
            'payment_types' => PaymentType::all(),
            'counters' => Counter::all(),
            'banks' => Bank::all(),
            'current_receipt_number' => $current_receipt_number,
            'current_bill' => $current_bill + 1,
        ]);
    }

    public function store()
    {
        // dd(request()->all());
        auth()->user()->hasPermission('create receipt form') ?: abort(403);
        // dd(request()->all());
        //Check payment_type for Cheque, should required code_bank, bank_name
        if(request()->payment[0]['type'] === 2){
            $validateOptional = request()->validate([
                'payment.*.code_bank' => 'required|string',
                'payment.*.bank_name' => 'required|string',
            ],[
                'payment.*.code_bank.required' => 'Kod Bank wajib diisi',
                'payment.*.bank_name.required' => 'Nama Bank wajib diisi',
            ]);
        };

        //account_number, bill_number , income_code is not required
        $validate = request()->validate(
            [
                'collection_center_id' => 'required|exists:collection_centers,id',
                'counter_id' => 'required|exists:counters,id',
                'user_id' => 'required|exists:users,id',
                'date' => 'required|date',
                'current_bill' => 'required|numeric',
                'transactions' => 'required|array',
                'transactions.*.account_number' => 'nullable|string',

                'transactions.*.bill_number' => 'nullable|array',
                //'transactions.*.bill_number.*' => 'required|string',
                // 'transactions.*.bill_number.*' => 'required',

                'transactions.*.receipt_number' => 'required|string',

                'transactions.*.income_code' => 'nullable|array',
                //'transactions.*.income_code.*' => 'required|string',
                'transactions.*.income_code.*' => '',

                'transactions.*.description' => 'required|string',
                'transactions.*.reference_number' => 'nullable|string',
                'transactions.*.amount' => 'required|numeric|min:0',

                // 'payment_type' => 'required|string',
                'payment' => 'required|array',

                'amount_paid' => 'required|numeric|min:0',
                'return_amount' => 'nullable|numeric',
            ],
            [
                'collection_center_id.required' => 'Maklumat Pusat Kutipan tidak lengkap',
                'counter_id.required' => 'Maklumat Kaunter tidak lengkap',
                'user_id.required' => 'Maklumat Juruwang tidak lengkap',
                'date.required' => 'Tarikh tidak lengkap',
                'transactions.*.bill_number.*.required' => 'Maklumat Pembayaran tidak lengkap',
                // 'transactions.*.receipt_number.required' => 'Maklumat No. Resit tidak lengkap',
                'transactions.*.income_code.required' => 'Maklumat Kod Hasil tidak lengkap',
                'transactions.*.description' => 'Maklumat Keterangan tidak lengkap',
                'transactions.*.amount' => 'Maklumat Jumlah tidak lengkap',
            ]
        );

        DB::beginTransaction();

        try {

            // $current_receipt_number = $this->currentReceiptNumber(auth()->user()->currentCashierOpenedCounter()->first()->counter_id ?? 1); # Add  ?? 1 on $current_receipt_number temporary fix since front end not returning any counter_id

            // $prefix = substr($current_receipt_number, 0, -4); // Remove the last 4 digits to get the collection center and counter

            // $lastNumber = intval(substr($current_receipt_number, -4)); // Get the last 4 digits only

            $totalAmount = 0;

            # Add hashing as receipt cateogry 6 digit
            $validate['receipt_grouping_id'] = Str::uuid()->toString();

            $receiptNumber = [];
            $receiptID = [];

            foreach ($validate['transactions'] as $transaction) {

                // $lastNumber++;

                // $expected_receipt_number = $prefix . str_pad($lastNumber, 4, '0', STR_PAD_LEFT); // ABC + 0001

                // # Crosscheck receipt number with FE and BE
                // if ($transaction['receipt_number'] !== $expected_receipt_number) {
                //     return response()->json(['error' => 'Receipt number does not match'], 400);
                // }


                //Check for duplicate receipt number
                if (isset($receiptNumber[$transaction['receipt_number']])) {
                    $receiptNumber[$transaction['receipt_number']] += 1;
                } else {
                    //if no duplicate, make a new one
                    $receiptNumber[$transaction['receipt_number']] = 1;
                }
              
                $totalAmount += $transaction['amount'];

                $receipt = Receipt::create([
                    'collection_center_id' => $validate['collection_center_id'],
                    'counter_id' => $validate['counter_id'],
                    'user_id' => $validate['user_id'],
                    'date' => Carbon::now(),
                    'current_bill' => $validate['current_bill'],
                    'account_number' => $transaction['account_number'] ?? null,

                    // Bill Number store on Receipt Details
                    // Income Code store on Receipt Details

                    'receipt_grouping_id' => $validate['receipt_grouping_id'],
                    'receipt_number' => $transaction['receipt_number'],
                    'description' => $transaction['description'],
                    'reference_number' => $transaction['reference_number'],


                    # FE send cash
                    #'payment_type' => $validate['payment_type'],
                    'payment_type' => PaymentType::find($validate['payment'][0]['type'])->name,

                    # All payment type done on the receipt group
                    'payment_detail' => $validate['payment'],

                    # Receipt individual amount
                    'amount' => $transaction['amount'],

                    # Receipt grouping amount
                    'total_amount' => $totalAmount,

                    # Receipt grouping amount need to be paid / Amaun Kena Bayar
                    'amount_to_be_paid' => $totalAmount,

                    # Receipt grouping amount paid by customer / Amaun Diterima
                    'amount_paid' => $validate['amount_paid'],

                    # Receipt grouping balance return to customer
                    'return_amount' => $totalAmount - $validate['amount_paid'], // Add checking with $validate['return_amount']

                    'service' => $transaction['income_code']['name'] ?? null, // get detail from counter -> service
                    'status' => Receipt::STATUS_GENERATED,
                ]);

                //Check for grouped receipt, if receipt number more than one, skip
                if(isset($receiptNumber[$transaction['receipt_number']]) && $receiptNumber[$transaction['receipt_number']] > 1){
                    continue;
                }else{
                    //if no duplicate, make a new one
                    $receiptID[] = $receipt->id;
                }

                ReceiptDetail::create([
                    'receipt_id' => $receipt->id,
                    'bill_number' => $transaction['bill_number']['bill_number'] ?? null, # customer details
                    'income_code' => $transaction['income_code']['name'] ?? null,
                    'amount' => $transaction['amount'] ?? 0,
                ]);


                // ReceiptDetail::create([
                //     'receipt_id' => $receipt->id,
                //     'bill_number' => $transaction['bill_number'] ?? null, # customer details
                //     'income_code' => $transaction['income_code']['name'] ?? null,
                //     'amount' => $transaction['amount'] ?? 0,
                // ]);
            }
            // dd($receiptNumber);
            // dd($receiptID);
            // User::notifyRole([Role::NAME_SUPERVISOR, Role::NAME_COUNTER_SUPERVISOR, Role::NAME_ADMIN], new ReceiptGenerated($receipt));

            $this->generateBankDepositSlip($receipt);

            DB::commit();

            activity()->performedOn($receipt)->causedBy(auth()->user())->log("Resit baru telah ditambah");

           //Check for unique receipt number
            if (count($receiptNumber) > 1) {
                //Get all receipt number with from receiptNumber
                $receiptsMultiple = Receipt::whereIn('id', $receiptID)->get();

                $newReceipt = $this->printMultipleReceipt($receiptsMultiple);

                return Inertia::render('ReceiveProcess/ShowMultipleReceipt', [
                    'receipts' => $newReceipt,
                    'currentRoute' => Route::currentRouteName(),
                ]);
            };

        return redirect()->route('receipt.print', ['receipt' => $receipt->id]);

            // return view('receipt', [
            //     'receipt' => $receipt,
            //     'juruwang' => $juruwang,
            //     'counter' => $counter,
            //     'collection_center' => $collection_center,
            // ]);
        } catch (\Exception $e) {

            DB::rollBack();
            dd($e);
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function edit(Receipt $receipt)
    {
        // auth()->user()->hasPermission('edit receipt form') ?: abort(403);

        return Inertia::render('ReceiveProcess/ReceiveEdit', [
            'currentRoute' => Route::currentRouteName(),
            'receipt' => $receipt,
            'receipt_details' => $receipt->details,
            'income_codes' => IncomeCode::all(),
        ]);
    }

    public function update(Receipt $receipt)
    {
        // auth()->user()->hasPermission('edit receipt form') ?: abort(403);

        $validate = request()->validate([
            'collection_center_id' => 'required|exists:collection_centers,id',
            'counter_id' => 'required|exists:counters,id',
            // 'date' => 'required|datetime',
            'receipt_number' => 'required|string',
            'account_number' => 'required|string',
            'income_code' => 'required|string',
            'amount_paid' => 'required|numeric|min:0',
            'description' => 'required|string',
            'edit_description' => 'required|string',
        ]);

        DB::beginTransaction();

        try {

            $receipt->update([
                'counter_id' => $validate['counter_id'],
                'collection_center_id' => $validate['collection_center_id'],
                'date' => $receipt->date,
                'receipt_number' => $validate['receipt_number'],
                'account_number' => $validate['account_number'],
                // 'income_code' => $validate['income_code'],
                'amount_paid' => $validate['amount_paid'],
                'total_amount' => $validate['amount_paid'],
                'amount_to_be_paid' => $validate['amount_paid'],
                'return_amount' => 0,
                'payment_type' => 'CSH',
                'description' => $validate['description'],
                'edit_description' => $validate['edit_description'],
                'status' => Receipt::STATUS_EDITED,
            ]);

            # Fix income code since its supoose to be in receipt details

            DB::commit();

            activity('update')->performedOn($receipt)->causedBy(auth()->user())->log("Resit berjaya dikemaskini");

            return to_route('receipt.index')->with('success', 'Proses berjaya!');
        } catch (\Exception $e) {

            DB::rollBack();
            dd($e);
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function preview(CancelledReceipt $cancelledReceipt)
    {
        auth()->user()->hasPermission('read receipt form') ?: abort(403);
        
        $receipt = Receipt::where('id', $cancelledReceipt->receipt_id)->with('details')->first();
        
        $payment_detail = [
            'index' => $receipt->payment_detail[0]['index'] ?? '',
            'type' => PaymentType::where('id', $receipt->payment_detail[0]['type'])->first()->description ?? '',
            'amount' => $receipt->payment_detail[0]['amount'] ?? '',
            'code_bank' => $receipt->payment_detail[0]['code_bank'] ?? '',
            'bank_name' => $receipt->payment_detail[0]['bank_name'] ?? '',
            'reference_number' => $receipt->payment_detail[0]['reference_number'] ?? '',
            'card_holder_name' => $receipt->payment_detail[0]['card_holder_name'] ?? '',
            'reference' => $receipt->payment_detail[0]['reference'] ?? '',
        ];

        $current_bill = (int) ltrim(substr($receipt->receipt_number, -4), '0');

        return Inertia::render('ReceiveProcess/CancelRequest/Show', [
            'currentRoute' => Route::currentRouteName(),
            'receipt' => $receipt,
            'cancelled_receipt' => $cancelledReceipt,
            'collection_centers' => CollectionCenter::with('counters')->get(),
            'counters' => Counter::all(),
            'current_bill' => $current_bill,
            'payment_detail' => $payment_detail,
        ]);
    }


    # Opt for frontend printing instead
    public function print(Receipt $receipt)
    {
        auth()->user()->hasPermission('read receipt form') ?: abort(403);

        $receipt = $receipt->with('details')->where('id', $receipt->id)->first();

        # Total transaction made on this counter
        $current_bill = (int) ltrim(substr($receipt->receipt_number, -4), '0');
        $juruwang = $receipt->user->name ?? null;
        $counter = $receipt->counter->name ?? null;
        $collection_center = $receipt->collectionCenter->name ?? null;

        //Check for grouped receipt
        $groupedReceipt = Receipt::where('receipt_grouping_id', $receipt->receipt_grouping_id)->where('receipt_number', $receipt->receipt_number)->count();
        if ($groupedReceipt > 1) {
            $receipts = Receipt::where('receipt_grouping_id', $receipt->receipt_grouping_id)->where('receipt_number', $receipt->receipt_number)->get();

            return Inertia::render('ReceiveProcess/Print', [
                'currentRoute' => Route::currentRouteName(),
                'grouped' => true,
                'receipt' => $receipts,
                'juruwang' => $juruwang,
                'counter' => $counter,
                'receipts' => $receipts
            ]);
        }

        return Inertia::render('ReceiveProcess/Print', [
            'currentRoute' => Route::currentRouteName(),
            'receipt' => $receipt,
            'juruwang' => $juruwang,
            'counter' => $counter,
            'collection_center' => $collection_center,
            'collection_centers'   => CollectionCenter::with('counters')->get(),
            'counters' => Counter::all(),
            'current_bill' => $current_bill,
        ]);
    }

    public function printMultipleReceipt($receipts)
    {
        $newReceipt = [];
        foreach($receipts as $receipt) {

            $receipt = $receipt->with('details')->where('id', $receipt->id)->first();

            $receipt->juruwang = $receipt->user->name;
            $receipt->counter = $receipt->counter->name;
            $receipt->collection_center = $receipt->collectionCenter->name;

            $groupedReceipt = Receipt::where('receipt_grouping_id', $receipt->receipt_grouping_id)->where('receipt_number', $receipt->receipt_number)->count();
            if ($groupedReceipt > 1) {
                $receipt->grouped = true;
                $receipt->groupReceipt = Receipt::where('receipt_grouping_id', $receipt->receipt_grouping_id)->where('receipt_number', $receipt->receipt_number)->get();
            }else{
                $receipt->grouped = false;
            }


            $newReceipt[] = $receipt;
        }

        return $newReceipt;
    }

    protected function generateBankDepositSlip(Receipt $receipt)
    {
        try {

            $oldRecord = BankDepositSlip::where('collection_center_id', $receipt->collection_center_id)
                ->where('counter_id', $receipt->counter_id)
                ->where('user_id', $receipt->user_id)
                ->whereDate('date', $receipt->date)
                ->where('payment_type', $receipt->payment_type)
                ->first();

            if ($oldRecord) {

                $oldRecord->amount_from_receipt += $receipt->total_amount;
                $oldRecord->user_id = $receipt->user_id;
                $oldRecord->save();
            } else {

                $record = BankDepositSlip::create([
                    'collection_center_id' => $receipt->collection_center_id,
                    'counter_id' => $receipt->counter_id,
                    'user_id' => $receipt->user_id,
                    'receipt_collection' => $receipt->collection_center->code ?? 'PL1',
                    'date' => $receipt->date,
                    'payment_type' => $receipt->payment_type,
                    'amount_from_receipt' => $receipt->total_amount,
                    'amount_from_cash_breakdown_receipt' => 0,
                    'report_type' => 'terperinci',
                    'deposit_date' => null,
                    'slip_number' => null,
                    'status' => BankDepositSlip::STATUS_GENERATED,
                ]);
            }

            $record = $record ?? $oldRecord;

            activity('create')->performedOn($record)->causedBy(auth()->user())->log("Slip Deposit Bank berjaya dijana");


            User::where('id', $record->user_id)->first()->notify(new ReportGenerated($record));

            User::notifyRole([Role::NAME_SUPERVISOR, Role::NAME_COUNTER_SUPERVISOR], new ReportGenerated($record));

            return $record;
        } catch (\Exception $e) {
            dd($e);
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    protected function currentReceiptNumber($counter_id)
    {
        $current_receipt_number = Receipt::currentReceiptNumber($counter_id);
        
        if (!$current_receipt_number) {

            $currCounter = Counter::where('id', $counter_id)
                ->first();

            $currCollectionCenter = CollectionCenter::where('id', $currCounter->collection_center_id)
                ->first();

            $current_receipt_number = $currCollectionCenter->code . $currCounter->name . '000000';
        }

        return $current_receipt_number;
    }

    public function printReceipt(Receipt $receipt)
    {
        $receipt = $receipt->with('details')->where('id', $receipt->id)->first();

        # Total transaction made on this counter
        $current_bill = (int) ltrim(substr($receipt->receipt_number, -4), '0');
        $juruwang = $receipt->user->name ?? null;
        $counter = $receipt->counter->name ?? null;
        $collection_center = $receipt->collectionCenter->name ?? null;
         
        //Check for grouped receipt
        $groupedReceipt = Receipt::where('receipt_grouping_id', $receipt->receipt_grouping_id)->where('receipt_number', $receipt->receipt_number)->count();
        if ($groupedReceipt > 1) {
            $receipts = Receipt::with('details')->where('receipt_grouping_id', $receipt->receipt_grouping_id)->where('receipt_number', $receipt->receipt_number)->get();

            $receiptPDF = Pdf::loadView('receipt', [
                'receipts' => $receipts,
                'grouped' => true,
                'juruwang' => $juruwang,
                'counter' => $counter,
                'collection_center' => $collection_center,
                'collection_centers'   => CollectionCenter::with('counters')->get(),
                'counters' => Counter::all(),
                'current_bill' => $current_bill, 
            ]);

            return $receiptPDF->stream();
        }

        $receiptPDF = Pdf::loadView('receipt', [
            'receipt' => $receipt,
            'grouped' => false,
            'juruwang' => $juruwang,
            'counter' => $counter,
            'collection_center' => $collection_center,
            'collection_centers'   => CollectionCenter::with('counters')->get(),
            'counters' => Counter::all(),
            'current_bill' => $current_bill,
        ]);

        return $receiptPDF->stream();

        // return view('receipt', [
        //     'receipt' => $receipt,
        //     'juruwang' => $juruwang,
        //     'counter' => $counter,
        //     'collection_center' => $collection_center,
        //     'collection_centers'   => CollectionCenter::with('counters')->get(),
        //     'counters' => Counter::all(),
        //     'current_bill' => $current_bill,
        // ]);
    }

    public function pdf() {
        $pdf = Pdf::loadView('pdf');
        return $pdf->stream();
    }
}
