<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use App\Models\CashierManagement;
use App\Models\CollectionCenter;
use App\Models\Counter;
use App\Models\IncomeCodeDescription;
use App\Models\PaymentType;
use App\Models\Receipt;
use App\Models\SettingAutoNumbering;
use App\Models\SettingCashCollection;
use App\Models\SettingDefaultCashierLocation;
use App\Models\IncomeCategory;
use App\Models\IncomeCode;
use App\Models\OpenedCounter;
use App\Models\ReceiptCollection;
use App\Models\SettingTerminalManagement;
use App\Models\SettingWorkingDay;
use App\Models\SystemConfiguration;
use App\Models\TerminalManagement;
use App\Models\User;
use Hamcrest\Core\Set;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Carbon\Carbon;
use Spatie\Activitylog\Models\Activity;

class SystemController extends Controller
{
    public function configuration()
    {
        auth()->user()->hasPermission('manage configuration system') ?: abort(403);

        $system_configurations = SystemConfiguration::latest();

        return Inertia::render('System/Configuration', [
            'currentRoute' => Route::currentRouteName(),
            'system_configurations' => $system_configurations->first(),
        ]);
    }

    public function updateConfiguration()
    {
        auth()->user()->hasPermission('manage configuration system') ?: abort(403);
      
        $validate = request()->validate([
            'status' => 'required|in:online,offline',
            'total_max_cash' => 'nullable',
            'total_max_receipt' => 'nullable',
            'max_float_cash' => 'nullable',
            'allowed_cancel_receipt' => 'nullable',
            'osp_status' => 'nullable',
            'receipt_format' => 'nullable',
        ]);

        DB::beginTransaction();

        try {

            $system_configurations = SystemConfiguration::create($validate);

            if (!empty($system_configurations->max_float_cash)) {
                CashierManagement::query()->update([
                    'retail_money' => $system_configurations->max_float_cash,
                ]);
            }            

            DB::commit();

            activity()->performedOn($system_configurations)->causedBy(auth()->user())->log('Konfigurasi sistem diubah');

            return redirect()->back()->with('success', 'Proses berjaya!');

        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function viewReceiptSetting(Request $request, $type = 'receipt_collection')
    {
        if(!auth()->user()->role->name === 'counter_supervisor') {
             auth()->user()->hasPermission('read code maintenance') ?: abort(403);
        }

        if($request->has('type')) {
            $type = $request->type;
        }
        
        switch ($type) {
            case 'receipt_collection':
                $data = ReceiptCollection::with('latestChange.causer', 'firstChange.causer')->filter($request->only(['code', 'name','search']))->paginate(10);
                $latestActivity = Activity::where('subject_type', ReceiptCollection::class)->latest()->first();
                $mostRecentlyChangedId = $latestActivity?->subject_id - 1;   
                break;

            case 'collection_center':
                $data = CollectionCenter::with('latestChange.causer', 'firstChange.causer')->filter($request->only(['code', 'name','search']))->paginate(10);
                $latestActivity = Activity::where('subject_type', CollectionCenter::class)->latest()->first();
                $mostRecentlyChangedId = $latestActivity?->subject_id - 1;   
                break;

            case 'counter':
                $data = Counter::with('latestChange.causer', 'firstChange.causer')->filter($request->only(['collection_center_id', 'name','search']))->paginate(10);
                $latestActivity = Activity::where('subject_type', Counter::class)->latest()->first();
                $mostRecentlyChangedId = $latestActivity?->subject_id - 1;   
                break;

            case 'bank':
                $data = Bank::with('latestChange.causer', 'firstChange.causer')->filter($request->only(['code', 'name', 'search']))->paginate(10);
                $latestActivity = Activity::where('subject_type', Bank::class)->latest()->first();
                $mostRecentlyChangedId = $latestActivity?->subject_id - 1;   
                break;

            case 'default_cashier_location':
                $data = SettingDefaultCashierLocation::with('latestChange.causer', 'firstChange.causer')->filter($request->only(['collection_center_id', 'counter_id', 'search']))->paginate(10);
                $latestActivity = Activity::where('subject_type', SettingDefaultCashierLocation::class)->latest()->first();
                $mostRecentlyChangedId = $latestActivity?->subject_id - 1;   
                break;

            case 'payment_type':
                $data = PaymentType::with('latestChange.causer', 'firstChange.causer')->filter($request->only(['code', 'description','search']))->paginate(10);
                $latestActivity = Activity::where('subject_type', PaymentType::class)->latest()->first();
                $mostRecentlyChangedId = $latestActivity?->subject_id - 1;  
                break;

            case 'income_category':
                $data = IncomeCategory::with('latestChange.causer', 'firstChange.causer')->filter($request->only(['code', 'name', 'search']))->paginate(10);
                $latestActivity = Activity::where('subject_type', IncomeCategory::class)->latest()->first();
                $mostRecentlyChangedId = $latestActivity?->subject_id - 1;  
                break;

            case 'income_code':
                $data = IncomeCode::with('latestChange.causer', 'firstChange.causer')->filter($request->only(['code', 'name' ,'search']))->paginate(10);
                $latestActivity = Activity::where('subject_type', IncomeCode::class)->latest()->first();
                $mostRecentlyChangedId = $latestActivity?->subject_id - 1;  
                break;

            case 'income_code_description':
                $data = IncomeCodeDescription::with('latestChange.causer', 'firstChange.causer')->filter($request->only(['code', 'name']))->paginate(10);
                $latestActivity = Activity::where('subject_type', IncomeCodeDescription::class)->latest()->first();
                $mostRecentlyChangedId = $latestActivity?->subject_id - 1; 
                break;

            case 'terminal_management':
                $selectedIncomeCodes = SettingTerminalManagement::with('latestChange.causer', 'firstChange.causer')->where('collection_center_id', $request->collection_center_id)->get()->pluck('income_code_id')->toArray();
                $latestActivity = Activity::where('subject_type', SettingTerminalManagement::class)->latest()->first();
                $mostRecentlyChangedId = $latestActivity?->subject_id - 1; 
                break;

            // case 'startingDate':
            //     $data = QueryBuilder::for(OpenedCounter::class)
            //     ->allowedFilters([
            //         AllowedFilter::callback('search', function ($query, $value) {
            //             $query->select('opened_counters.*')
            //                 ->where(function ($query) use ($value) {
            //                     $query->where('code', 'LIKE', '%' . $value . '%')
            //                         ->orWhere('remark', 'LIKE', '%' . $value . '%');
            //                 });
            //         })
            //     ])
            //     ->with('latestChange.causer', 'firstChange.causer')
            //     ->where('status', OpenedCounter::STATUS_OPEN_BY_ADMIN)
            //     ->paginate(10);
            //     break;

            case 'StartingDate':
                $data = SettingWorkingDay::with('latestChange.causer', 'firstChange.causer')->filter($request->only(['collection_center_id']))->paginate(10);
                $latestActivity = Activity::where('subject_type', SettingWorkingDay::class)->latest()->first();
                $mostRecentlyChangedId = $latestActivity?->subject_id - 1; 
                break;

            default:
                return response()->json(['error' => 'Invalid type provided'], 400);
        }

        return Inertia::render('System/CodeMaintenance/Receipt/Index', [
            'currentRoute' => Route::currentRouteName(),
            'setting_data' => $data ?? ['data' => []],
            'setting_terminal_management' => $selectedIncomeCodes ?? [],
            'cashiers' => User::whereHas('role', function ($query) {$query->where('name', 'cashier');})->get(),
            'collection_centers' => CollectionCenter::with('counters')->get(),
            'counterOptions' => Counter::all(),
            'banks' => Bank::all(),
            'payment_types' => PaymentType::all(),
            'receipt_collections' => ReceiptCollection::all(),
            'income_categories' => IncomeCategory::all(),
            'income_codes' => IncomeCode::all(),
            'no_banks' => DB::table('aualbank')->get(),
            'most_recently_changed' => $mostRecentlyChangedId,
        ]);
    }

    public function storeReceiptSetting(Request $request, $type = 'receipt_collection')
    {
        if(!auth()->user()->role->name === 'counter_supervisor') {
             auth()->user()->hasPermission('read code maintenance') ?: abort(403);
        }

        if($request->has('type')) {
            $type = $request->type;
        }

        DB::beginTransaction();
        
        try {
            switch ($type) {
                case 'receipt_collection':
                    $validated = request()->validate([
                        'code' => 'required|unique:receipt_collections',
                        'name' => 'required',
                    ]);
    
                    $setting = ReceiptCollection::create($validated);
                    $logMessage = 'Penyelenggaraan Kumpulan Resit berjaya ditambah';
                    break;
    
                case 'collection_center':
                    $validated = request()->validate([
                        'code' => 'required|unique:collection_centers',
                        'name' => 'required',
                    ]);
    
                    $setting = CollectionCenter::create($validated);

                    if($setting) {
                        SettingWorkingDay::create([
                            'collection_center_id' => $setting->id,
                            'monday' => true,
                            'tuesday' => true,
                            'wednesday' => true,
                            'thursday' => true,
                            'friday' => true,
                            'saturday' => false,
                            'sunday' => false,
                        ]);
                    }

                    $logMessage = 'Penyelenggaraan Pusat Kutipan berjaya ditambah';
                    break;

                case 'counter':
                    $validated = request()->validate([
                        'collection_center_id' => 'required|exists:collection_centers,id',
                        'name' => 'required',
                        'description' => 'nullable',
                    ]);
    
                    $setting = Counter::create($validated);
                    $logMessage = 'Penyelenggaraan Kaunter berjaya ditambah';
                    break;

                case 'bank':
                    $validated = request()->validate([
                        'code' => 'required|unique:banks',
                        'name' => 'required',
                        'description' => 'nullable',
                    ]);
    
                    $setting = Bank::create($validated);
                    $logMessage = 'Penyelenggaraan Bank berjaya ditambah';
                    break;
                        
                case 'default_cashier_location':
                    $validated = request()->validate([
                        'collection_center_id' => 'required|exists:collection_centers,id',
                        'counter_id' => 'required|exists:counters,id',
                        'user_id' => 'required|exists:users,id',
                    ]);
                    
                    $setting = SettingDefaultCashierLocation::create($validated);

                    // if ($setting) {
                    //     $system_config = SystemConfiguration::latest()->first();
                        
                    //     CashierManagement::create([
                    //         'collection_center_id' => $setting->collection_center_id,
                    //         'counter_id' => $setting->counter_id,
                    //         'user_id' => $setting->user_id,
                    //         'retail_money' => $system_config->max_float_cash ?? '',
                    //     ]);

                    //     TerminalManagement::create([
                    //         'collection_center_id' => $setting->collection_center_id,
                    //         'counter_id' => $setting->counter_id,
                    //         'user_id' => $setting->user_id,
                    //         'receipt_date' => Carbon::now(),
                    //         'counter_status' => 'active',
                    //     ]);
                    // }

                    $logMessage = 'Penyelenggaraan Lokasi Juruwang berjaya ditambah';
                    break;
   
                case 'payment_type':
                    $validated = request()->validate([
                        'code' => 'required|unique:payment_types',
                        'name' => 'required',
                        'description' => 'required',
                        'destination' => 'required',
                    ]);

                    $setting = PaymentType::create($validated);
                    $logMessage = 'Penyelenggaraan Jenis Bayaran berjaya ditambah';
                    break;

                case 'income_category':
                    $validated = request()->validate([
                        'code' => 'required|unique:income_categories',
                        'name' => 'required',
                    ]);
    
                    $setting = IncomeCategory::create($validated);
                    $logMessage = 'Penyelenggaraan Kategori Hasil berjaya ditambah';
                    break;

                case 'income_code':
                    $validated = request()->validate([
                        'code' => 'required|unique:income_codes',
                        'name' => 'required',
                        'description' => 'required',
                        'receipt_collection_id' => 'required|exists:receipt_collections,id',
                        'bank_id' => 'required|exists:banks,id',
                        'income_category_id' => 'nullable|exists:income_categories,id',
                        'gl_account' => 'required',
                        'default_amount' => 'nullable|numeric',
                        'printed_receipt_format' => 'nullable',
                    ]);
    
                    $setting = IncomeCode::create($validated);
                    $logMessage = 'Penyelenggaraan Kod Hasil berjaya ditambah';
                    break;

                case 'income_code_description':
                    $validated = request()->validate([
                        'income_code_id' => 'required|exists:income_codes,id',
                        'description' => 'required',
                    ]);
    
                    $setting = IncomeCodeDescription::create($validated);
                    $logMessage = 'Penyelenggaraan Keterangan Kod Hasil berjaya ditambah';
                    break;

                case 'terminal_management':
                    // dd($request->all());
                    $validated = request()->validate([
                        'collection_center_id' => 'required|exists:collection_centers,id',
                        'selected_income_codes' => 'required|array',
                        'selected_income_codes.*' => 'required|exists:income_codes,id',
                        // 'income_code_id' => 'required|exists:income_codes,id',
                    ]);

                    SettingTerminalManagement::where('collection_center_id', $validated['collection_center_id'])->delete();
                    
                    foreach($request->selected_income_codes as $income_code) {

                        SettingTerminalManagement::create([
                            'collection_center_id' => $validated['collection_center_id'],
                            'income_code_id' => $income_code
                        ]);
                    };

                    $setting = SettingTerminalManagement::latest()->first();

                    // $setting = SettingTerminalManagement::create();
                    $logMessage = 'Penyelenggaraan Kawalan Terminal berjaya ditambah';
                    break;

                default:
                    return response()->json(['error' => 'Invalid type provided'], 400);
            }
    
            DB::commit();
    
            activity()->performedOn($setting)->causedBy(auth()->user())->log($logMessage);
    
            return redirect()->back()->with('success', 'Proses berjaya!');
    
        } catch (\Exception $e) {
            DB::rollBack();
            dd($e);
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function updateReceiptSetting($type = 'receipt_collection', $id)
    {
        if(!auth()->user()->role->name === 'counter_supervisor') {
             auth()->user()->hasPermission('read code maintenance') ?: abort(403);
        }

        DB::beginTransaction();
    
        try {
            switch ($type) {
                case 'receipt_collection':
                    $validated = request()->validate([
                        'code' => "required|unique:receipt_collections,code,$id,id",
                        'name' => 'required',
                    ]);
                    
                    $setting = ReceiptCollection::find($id);
                    $setting->update($validated);
                    $logMessage = 'Penyelenggaraan Kumpulan Resit berjaya dikemaskini';
                    break;
    
                case 'collection_center':
                    $validated = request()->validate([
                        'code' => "required|unique:collection_centers,code,$id,id",
                        'name' => 'required',
                    ]);
    
                    $setting = CollectionCenter::find($id);
                    $setting->update($validated);
                    $logMessage = 'Penyelenggaraan Pusat Kutipan berjaya dikemaskini';
                    break;

                case 'counter':
                    $validated = request()->validate([
                        'collection_center_id' => 'required|exists:collection_centers,id',
                        'name' => 'required',
                        'description' => 'nullable',
                    ]);
    
                    $setting = Counter::find($id);
                    $setting->update($validated);
                    $logMessage = 'Penyelenggaraan Kaunter berjaya dikemaskini';
                    break;

                case 'bank':
                    $validated = request()->validate([
                        'code' => "required|unique:banks,code,$id,id",
                        'name' => 'required',
                        'description' => 'nullable',
                    ]);
    
                    $setting = Bank::find($id);
                    $setting->update($validated);
                    $logMessage = 'Penyelenggaraan Bank berjaya dikemaskini';
                    break;

                case 'default_cashier_location':
                    $validated = request()->validate([
                        'collection_center_id' => 'required|exists:collection_centers,id',
                        'counter_id' => 'required|exists:counters,id',
                        'user_id' => 'required|exists:users,id',
                    ]);
    
                    $setting = SettingDefaultCashierLocation::find($id);
                    $setting->update($validated);

                    // if ($setting) {
                    //     $system_config = SystemConfiguration::latest()->first();
                 
                    //     CashierManagement::updateOrCreate(
                    //         [
                    //             'user_id' => $setting->user_id, 
                    //         ],
                    //         [
                    //             'collection_center_id' => $setting->collection_center_id,
                    //             'counter_id' => $setting->counter_id,
                    //             'user_id' => $setting->user_id,
                    //             'retail_money' => $system_config->max_float_cash ?? '',
                    //         ]
                    //     );

                    //     TerminalManagement::updateOrCreate(
                    //         [
                    //             'user_id' => $setting->user_id,
                    //         ],
                    //         [
                    //             'collection_center_id' => $setting->collection_center_id,
                    //             'counter_id' => $setting->counter_id,
                    //             'user_id' => $setting->user_id,
                    //             'receipt_date' => Carbon::now(),
                    //             'counter_status' => 'active',
                    //         ]
                    //     );
                    // }

                    $logMessage = 'Penyelenggaraan Lokasi Juruwang berjaya dikemaskini';
                    break;

                case 'payment_type':
                    $validated = request()->validate([
                        'code' => "required|unique:payment_types,code,$id,id",
                        'name' => 'required',
                        'description' => 'required',
                        'destination' => 'required',
                    ]);
    
                    $setting = PaymentType::find($id);
                    $setting->update($validated);
                    $logMessage = 'Penyelenggaraan Jenis Bayaran berjaya dikemaskini';
                    break;

                case 'income_category':
                    $validated = request()->validate([
                        'code' => "required|unique:income_categories,code,$id,id",
                        'name' => 'required',
                    ]);
    
                    $setting = IncomeCategory::find($id);
                    $setting->update($validated);
                    $logMessage = 'Penyelenggaraan Kategori Hasil berjaya dikemaskini';
                    break;

                case 'income_code':
                    $validated = request()->validate([
                        'code' => "required|unique:income_codes,code,$id,id",
                        'name' => 'required',
                        'description' => 'required',
                        'receipt_collection_id' => 'required|exists:receipt_collections,id',
                        'bank_id' => 'required|exists:banks,id',
                        'income_category_id' => 'nullable|exists:income_categories,id',
                        'gl_account' => 'required',
                        'default_amount' => 'nullable',
                        'printed_receipt_format' => 'nullable',
                    ]);
    
                    $setting = IncomeCode::find($id);
                    $setting->update($validated);
                    $logMessage = 'Penyelenggaraan Kod Hasil berjaya dikemaskini';
                    break;

                case 'income_code_description':
                    $validated = request()->validate([
                        'income_code_id' => "required|exists:income_codes,id",
                        'description' => 'required',
                    ]);

                    $setting = IncomeCodeDescription::find($id);
                    $setting->update($validated);
                    $logMessage = 'Penyelenggaraan Keterangan Kod Hasil berjaya dikemaskini';
                    break;

                case 'terminal_management':
                    $validated = request()->validate([
                        'collection_center_id' => 'required|exists:collection_centers,id',
                        'income_code_id' => 'required|exists:income_codes,id',
                    ]);
    
                    $setting = SettingTerminalManagement::find($id);
                    $setting->update($validated);
                    $logMessage = 'Penyelenggaraan Kawalan Terminal berjaya dikemaskini';
                    break;

                case 'StartingDate':
                    $validated = request()->validate([
                        'collection_center_id' => 'required|exists:collection_centers,id',
                        'monday' => 'required',
                        'tuesday' => 'required',
                        'wednesday' => 'required',
                        'thursday' => 'required',
                        'friday' => 'required',
                        'saturday' => 'required',
                        'sunday' => 'required',
                    ]);
    
                    $setting = SettingWorkingDay::find($id);
                    $setting->update($validated);
                    $logMessage = 'Penyelenggaraan Tarikh Permulaan Hari berjaya dikemaskini';
                    break;

                default:
                    return response()->json(['error' => 'Invalid type provided'], 400);
            }
    
            DB::commit();
    
            activity()->performedOn($setting)->causedBy(auth()->user())->log($logMessage);
    
            return redirect()->back()->with('success', 'Proses berjaya!');
    
        } catch (\Exception $e) {
            DB::rollBack();
            dd($e);
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function destroyReceiptSetting(Request $request, $type = 'receipt_collection', $id)
    {
        if(!auth()->user()->role->name === 'counter_supervisor') {
             auth()->user()->hasPermission('read code maintenance') ?: abort(403);
        }

        if($request->has('type')) {
            $type = $request->type;
        }

        DB::beginTransaction();

        try {
            switch ($type) {
                case 'receipt_collection':
                    $setting = ReceiptCollection::find($id);
                    $setting->delete();
                    $logMessage = 'Penyelenggaraan Jenis Resit berjaya dipadam';
                    break;
    
                case 'collection_center':
                    $setting = CollectionCenter::find($id);

                    if ($setting) {
                        $workingDays = SettingWorkingDay::where('collection_center_id', $setting->id)->get();

                        foreach ($workingDays as $workingDay) {
                            $workingDay->delete();
                        }
                    }

                    $setting->delete();
                    $logMessage = 'Penyelenggaraan Pusat Kutipan berjaya dipadam';
                    break;
  
                case 'counter':
                    $setting = Counter::find($id);                    
                    $setting->delete();
                    $logMessage = 'Penyelenggaraan Kaunter berjaya dipadam';
                    break;

                case 'bank':
                    $setting = Bank::find($id);
                    $setting->delete();
                    $logMessage = 'Penyelenggaraan Bank berjaya dipadam';
                    break;
                
                case 'default_cashier_location':
                    $setting = SettingDefaultCashierLocation::find($id);
                    $setting->delete();
                    $logMessage = 'Penyelenggaraan Lokasi Juruwang berjaya dipadam';
                    break;

                case 'payment_type':
                    $setting = PaymentType::find($id);
                    $setting->delete();
                    $logMessage = 'Penyelenggaraan Jenis Bayaran berjaya dipadam';
                    break;

                case 'income_category':
                    $setting = IncomeCategory::find($id);
                    $setting->delete();
                    $logMessage = 'Penyelenggaraan Kategori Hasil berjaya dipadam';
                    break;

                case 'income_code':
                    $setting = IncomeCode::find($id);
                    $setting->delete();
                    $logMessage = 'Penyelenggaraan Kod Hasil berjaya dipadam';
                    break;

                case 'income_code_description':
                    $setting = IncomeCodeDescription::find($id);
                    $setting->delete();
                    $logMessage = 'Penyelenggaraan Keterangan Kod Hasil berjaya dipadam';
                    break;

                case 'terminal_management':
                    $setting = SettingTerminalManagement::find($id);
                    $setting->delete();
                    $logMessage = 'Penyelenggaraan Kawalan Terminal berjaya dipadam';
                    break;

                default:
                    return response()->json(['error' => 'Invalid type provided'], 400);
            }
    
            DB::commit();
    
            activity()->performedOn($setting)->causedBy(auth()->user())->log($logMessage);
    
            return redirect()->back()->with('success', 'Proses berjaya!');
    
        } catch (\Exception $e) {
            DB::rollBack();
    
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function viewCenturyFinancial(Request $request, $type = 'cash_collection')
    {
        
        auth()->user()->hasPermission('read code maintenance') ?: abort(403);
   
        if($request->has('type')) {
            $type = $request->type;
        }
        switch ($type) {
            case 'cash_collection':
                $data = SettingCashCollection::with('latestChange.causer', 'firstChange.causer')->filter($request->only(['code', 'name']))->paginate(10);
                $latestActivity = Activity::where('subject_type', SettingCashCollection::class)->latest()->first();
                $mostRecentlyChangedId = $latestActivity?->subject_id - 1; 
                break;

            case 'auto_numbering':
                $data = SettingAutoNumbering::with('latestChange.causer', 'firstChange.causer')->filter($request->only(['code', 'setting_cash_collection_id']))->paginate(10);
                $latestActivity = Activity::where('subject_type', SettingAutoNumbering::class)->latest()->first();
                $mostRecentlyChangedId = $latestActivity?->subject_id - 1; 
                break;

            default:
                return response()->json(['error' => 'Invalid type provided'], 400);
        }

        return Inertia::render('System/CodeMaintenance/CenturyFinancial', [
            'currentRoute' => Route::currentRouteName(),
            'setting_data' => $data,
            'banks' => Bank::all(),
            'setting_cash_collections' => SettingCashCollection::all(),
            'setting_auto_numberings' => SettingAutoNumbering::all(),
            'most_recently_changed' => $mostRecentlyChangedId,
        ]);
    }

    public function storeCenturyFinancial(Request $request, $type = 'cash_collection')
    {
        auth()->user()->hasPermission('read code maintenance') ?: abort(403);

        if($request->has('type')) {
            $type = $request->type;
        }

        DB::beginTransaction();

        try {
            switch ($type) {
                case 'cash_collection':
                    $validated = request()->validate([
                        'code' => 'required|unique:setting_cash_collections',
                        'name' => 'required',
                        'bank_id' => 'required|exists:banks,id',
                        'is_default' => 'nullable|boolean',
                    ]);
    
                    $setting = SettingCashCollection::create($validated);
                    $logMessage = 'Penyelenggaraan Kumpulan Wang berjaya ditambah';
                    break;
    
                case 'auto_numbering':
                    $validated = request()->validate([
                        'code' => 'required|unique:setting_auto_numberings',
                        'name' => 'required',
                        'setting_cash_collection_id' => 'required|exists:setting_cash_collections,id',
                        'prefix' => 'nullable',
                    ]);
    
                    $setting = SettingAutoNumbering::create($validated);
                    $logMessage = 'Penyelenggaraan Auto Penomboran berjaya ditambah';
                    break;

                default:
                    return response()->json(['error' => 'Invalid type provided'], 400);
            }

            DB::commit();

            activity()->performedOn($setting)->causedBy(auth()->user())->log($logMessage);

            return redirect()->back()->with('success', 'Proses berjaya!');

        } catch (\Exception $e) {

            DB::rollBack();
            dd($e);
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function updateCenturyFinancial($type = 'cash_collection', $id)
    {
        auth()->user()->hasPermission('read code maintenance') ?: abort(403);
        
        DB::beginTransaction();

        try {
            switch ($type) {
                case 'cash_collection':
                    $validated = request()->validate([
                        'code' => "required|unique:setting_cash_collections,code,$id,id",
                        'name' => 'required',
                        'bank_id' => 'required|exists:banks,id',
                        'is_default' => 'nullable|boolean',
                    ]);

                    $setting = SettingCashCollection::find($id);
                    $setting->update($validated);
                    $logMessage = 'Penyelenggaraan Kumpulan Wang berjaya dikemaskini';
                    break;
    
                case 'auto_numbering':
                    $validated = request()->validate([
                        'code' => "required|unique:setting_auto_numberings,code,$id,id",
                        'name' => 'required',
                        'setting_cash_collection_id' => 'required|exists:setting_cash_collections,id',
                        'prefix' => 'nullable',
                    ]);
    
                    $setting = SettingAutoNumbering::find($id);
                    $setting->update($validated);
                    $logMessage = 'Penyelenggaraan Auto Penomboran berjaya dikemaskini';
                    break;

                default:
                    return response()->json(['error' => 'Invalid type provided'], 400);
            }

            DB::commit();

            activity()->performedOn($setting)->causedBy(auth()->user())->log($logMessage);

            return redirect()->back()->with('success', 'Proses berjaya!');

        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function destroyCenturyFinancial($type = 'cash_collection', $id)
    {
        auth()->user()->hasPermission('read code maintenance') ?: abort(403);

        DB::beginTransaction();

        try {
            switch ($type) {
                case 'cash_collection':
                    $setting = SettingCashCollection::find($id);
                    $setting->delete();
                    $logMessage = 'Penyelenggaraan Kumpulan Wang berjaya dipadam';
                    break;
    
                case 'auto_numbering':
                    $setting = SettingAutoNumbering::find($id);
                    $setting->delete();
                    $logMessage = 'Penyelenggaraan Auto Penomboran berjaya dipadam';
                    break;

                default:
                    return response()->json(['error' => 'Invalid type provided'], 400);
            }

            DB::commit();

            activity()->performedOn($setting)->causedBy(auth()->user())->log($logMessage);

            return redirect()->back()->with('success', 'Proses berjaya!');

        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function editReceiptNumber()
    {
        $receipts = QueryBuilder::for(Receipt::class)
        ->allowedFilters([
            AllowedFilter::callback('search', function ($query, $value) {
                $query->select('receipts.*')
                    ->where(function ($query) use ($value) {
                        $query->where('code', 'LIKE', '%' . $value . '%')
                            ->orWhere('remark', 'LIKE', '%' . $value . '%');
                    });
            })
        ])
        ->with('latestChange.causer', 'firstChange.causer')
        ->paginate(10);
 
        return Inertia::render('System/Receipt',[
            'currentRoute' => Route::currentRouteName(),
            'receipts' => $receipts
        ]);        
    }

    public function startingDay(Request $request)
    {
        $data = SettingWorkingDay::with('latestChange.causer', 'firstChange.causer')->filter($request->only(['collection_center_id']))->paginate(10);

        $latestActivity = Activity::where('subject_type', SettingWorkingDay::class)->latest()->first();

        $mostRecentlyChangedId = $latestActivity?->subject_id - 1; 

        return Inertia::render('StartingDay/Index',[
            'currentRoute' => Route::currentRouteName(),
            'setting_data' => $data,
            'most_recently_changed' => $mostRecentlyChangedId,
            'collection_centers' => CollectionCenter::with('counters')->get(),
        ]);    
    }
}
