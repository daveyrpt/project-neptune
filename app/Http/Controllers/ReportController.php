<?php

namespace App\Http\Controllers;

use App\Models\BankDepositSlip;
use App\Models\CancelledReceipt;
use App\Models\CollectionCenter;
use App\Models\Counter;
use App\Models\Customer;
use App\Models\FloatCash;
use App\Models\FloatCashRequest;
use App\Models\Incident;
use App\Models\IncomeCode;
use App\Models\OpenedCounter;
use App\Models\PaymentType;
use App\Models\Receipt;
use App\Models\ReceiptCollection;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Arr;
use Spatie\Activitylog\Models\Activity;

class ReportController extends Controller
{
    public function index()
    {
        $details = Incident::get();

        // dd($details[0]->gps);

        return Inertia::render('Report/Index',[
            'currentRoute' => Route::currentRouteName(),
            'details' => $details
        ]);

        // auth()->user()->hasPermission('read report') ?: abort(403);

        // $paymentTypes = ['CSH', 'Cek', 'CC', 'Wang Pos', 'EFT', 'Deraf Bank', 'Slip Bank'];

        // // Only check mismatches for "Tunai"
        // $mismatchedTypes = BankDepositSlip::where('payment_type', 'CSH')
        //     ->whereRaw('amount_from_receipt > amount_from_cash_breakdown_receipt')
        //     ->byUser()
        //     ->pluck('payment_type') // should only return 'Tunai' if any mismatches
        //     ->unique()
        //     ->values();

        // // Mark only "Tunai" as true if there's a mismatch
        // $reportIndicator = collect($paymentTypes)->mapWithKeys(function ($type) use ($mismatchedTypes) {
        //     if ($type === 'CSH') {
        //         return [$type => $mismatchedTypes->contains('CSH')];
        //     }
        //     return [$type => false]; // Non-Tunai types are always considered matched
        // });

     
        // return Inertia::render('Report/Index',[
        //     'currentRoute' => Route::currentRouteName(),
        //     'reportIndicator' => $reportIndicator,
        // ]);
    }

    public function hydrant()
    {
        return Inertia::render('Report/Hydrant',[
            'currentRoute' => Route::currentRouteName(),
        ]);
    }

    public function station()
    {
        return Inertia::render('Report/Station',[
            'currentRoute' => Route::currentRouteName(),
        ]);
    }

    public function police()
    {
        return Inertia::render('Report/Police',[
            'currentRoute' => Route::currentRouteName(),
        ]);
    }

    public function ambulance()
    {
        return Inertia::render('Report/Ambulance',[
            'currentRoute' => Route::currentRouteName(),
        ]);
    }

    public function list()
    {
        return Inertia::render('Report/List',[
            'currentRoute' => Route::currentRouteName(),
        ]);
    }

    public function audit()
    {
        return Inertia::render('Report/Audit',[
            'currentRoute' => Route::currentRouteName(),
        ]);
    }

    public function downloadPdf($id)
    {
        $incident = (object) [
            'id'       => 301,
            'lokasi'   => 'Pasar Filipina, Kota Kinabalu',
            'tahap'    => 'Resolved',
            'status'   => 'Low',
            'message'  => 'Kebakaran kecil gerai makanan berjaya dipadamkan. Tiada kecederaan dilaporkan.',
            'masa'     => '18:05',
            'tarikh'   => '26/06/2025',
            'sumber'   => 'WhatsApp',
            'pegawai'  => 'Azahari Salleh',
            'phone'    => '+60129991100',
            'address'  => 'Jalan Tun Fuad Stephens, 88000 Kota Kinabalu',
            'gps'      => '5.9837, 116.0769',
        ];

        // Simple Blade view for PDF (resources/views/incidents/pdf.blade.php)
        $pdf = PDF::loadView('incidents', [ 'incident' => $incident ]);

        $filename = 'Laporan Contoh.pdf';
        return $pdf->stream($filename);
    }

    public function auditPrint()
    {
        // Simple Blade view for PDF (resources/views/incidents/pdf.blade.php)
        $pdf = PDF::loadView('audit');

        $filename = 'Audit Contoh.pdf';
        return $pdf->stream($filename);
    }

    public function customReport()
    {
        auth()->user()->hasPermission('read report') ?: abort(403);

        $filter = request()->has('filter') ? request('filter') : [];

        $start_date = request()->query('start_date')
            ? Carbon::parse(request()->query('start_date'))->startOfDay()
            : Carbon::today();
    
        $end_date = request()->query('end_date')
            ? Carbon::parse(request()->query('end_date'))->endOfDay()
            : Carbon::today()->endOfDay();

        $date_range = [$start_date, $end_date];
        

        $pageTitle = '';
        $report = request('report');
        $data = null; 
        // dd($report);
        switch ($report) {
            case 'report-float-cash':
                $data = $this->FloatCash();
                $pageTitle = 'Laporan Wang Apungan';
                break;
            case 'cs04':
                $data = $this->CS04();
                $pageTitle =  'CS04 - S. Audit Mengikut Jenis Bayaran';
                break;
            case 'cs05':
                $data = $this->CS05();
                $pageTitle =  'CS05 - S. Audit Jenis Bayaran (Rumusan)';
                break;
            case 'cs06':
                $data = $this->CS06();
                $pageTitle =  'CS06 - S. Audit Mengikut Jenis Pungutan';
                break;
            case 'cs07':
                $data = $this->CS07();
                $pageTitle =  'CS07 - S. Audit Jenis Pungutan Sama dengan CS05';
                break;
            case 'cs08':
                $data = $this->CS08();
                $pageTitle =  'CS08 - S. Bayaran Mengikut Kod Hasil';
                break;
            case 'cs09':
                $data = $this->CS09();
                $pageTitle =  'CS09 - S. Bayaran Kod Hasil (Rumusan)';
                break;
            case 'cs10':
                $data = $this->CS10();
                $pageTitle = 'CS10 - Senarai Audit Bayaran Kaunter';
                break;
            case 'cs11':
                $data = $this->CS11();
                $pageTitle = 'CS11 - Butir-butir Pungutan (Maklumat)';
                break;
            case 'cs12':
                $data = $this->CS12();
                $pageTitle = 'CS12 - Butir-butir Pungutan (Rumusan)';
                break;
            case 'cs13':
                $data = $this->CS13();
                $pageTitle = 'CS13 - Senarai Terperinci Bayaran Kaunter';
                break;
            case 'cs16':
                $data = $this->CS16();
                $pageTitle = 'CS16 - S. Audit Pemprosesan Pengunjung Hari';
                break;
            case 'cs17':
                $data = $this->CS17();
                $pageTitle = 'CS17 - S. Bayaran Mengikut Nama Pembayar';
                break;
            case 'slip_deposit_bank_tunai': // Report - Slip Deposit Bank (Tunai)
                $data = $this->Slip_Deposit_Bank_Tunai();
                $pageTitle = 'Slip Deposit Bank (Tunai)';
                break;
            case 'slip_deposit_bank_deraf_bank': // Report - Slip Deposit Bank (Deraf Bank)
                $data = $this->Slip_Deposit_Bank_Deraf_Bank();
                $pageTitle = 'Slip Deposit Bank (Deraf Bank)';
                break;
            case 'slip_deposit_bank_cek': // Report - Slip Deposit Bank (Cek)
                $data = $this->Slip_Deposit_Bank_Cek();
                $pageTitle = 'Slip Deposit Bank (Cek)';
                break;
            case 'slip_deposit_bank_slip_bank': // Report - Slip Deposit Bank (Slip Bank)
                $data = $this->Slip_Deposit_Bank_Slip_Bank();
                $pageTitle = 'Slip Deposit Bank (Slip Bank)';
                break;
            case 'slip_deposit_bank_cc': // Report - Slip Deposit Bank (CC)
                $data = $this->Slip_Deposit_Bank_CC();
                $pageTitle = 'Slip Deposit Bank (CC)';
                break;
            case 'slip_deposit_bank_qr': // Report - Slip Deposit Bank (QR)
                $data = $this->Slip_Deposit_Bank_QR();
                $pageTitle = 'Slip Deposit Bank (QR Pay)';
                break;
            case 'slip_deposit_bank_wang_pos': // Report - Slip Deposit Bank (Pos)
                $data = $this->Slip_Deposit_Bank_Pos();
                $pageTitle = 'Slip Deposit Bank (Wang Pos)';
                break;
            case 'slip_deposit_bank_eft': // Report - Slip Deposit Bank (EFT)
                $data = $this->Slip_Deposit_Bank_EFT();
                $pageTitle = 'Slip Deposit Bank (EFT)';
                break;
    
            case 'laporan_audit_roi': // Report - Audit Roi
                $data = $this->Audit_Roi();
                $pageTitle = 'Laporan Audit Rol';
                break;
            case 'laporan_audit_roi_mengikut_resit': // Report - Audit Roi Mengikut Resit
                $data = $this->Audit_Roi_Mengikut_Resit();
                $pageTitle = 'Laporan Audit Rol Mengikut Resit';
                break;
            case 'laporan_audit_trail': // Report - Audit Trail
                $data = $this->Audit_Trail();
                $pageTitle = 'Laporan Audit Trail';
                break;
            case 'senarai_audit_ikut_jenis_bayaran': // Report - Senarai Audit Ikut Jenis Bayaran
                $data = $this->Senarai_Audit_Ikut_Jenis_Bayaran();
                $pageTitle = 'Senarai Audit Ikut Jenis Bayaran';
                break;
            case 'senarai_audit_bayaran_kaunter': // Report - Senarai Audit Bayaran Kaunter
                $data = $this->Senarai_Audit_Bayaran_Kaunter();
                $pageTitle = 'Senarai Audit Bayaran Kaunter';
                break;
            case 'senarai_resit_batal': // Report - Senarai Resit Batal
                $data = $this->Senarai_Resit_Batal();
                $pageTitle = 'Senarai Resit Batal';
                break;
            case 'inquiry': // Report - Senarai Resit Batal
                $data = $this->Inquiry();
                $pageTitle = 'Inquiry';
                break;
            case 'laporan_edit_resit': // Report - Edit Resit
                $data = $this->Edit_Resit();
                $pageTitle = 'Laporan Edit Resit';
                break;
            case 'laporan_tamat_hari': // Report - Tamat Hari
                $data = $this->Tamat_Hari();
                $pageTitle = 'Laporan Tamat Hari';
                break;

            default:
                // If no matching report code found
                return response()->json(['error' => 'Report not found'], 404);
        }

        $filterData = request()->only([
            'filter',
            'start_date',
            'end_date',
            'page'
        ]);

        //Add blank filter if the filter is empty
        $filterData['filter'] = $filterData['filter'] ?? '';

        // Render the Inertia page with the generated data.
        return Inertia::render('Report/Report', [
            'pageTitle' => $pageTitle,
            'filterData' => $filterData,
            'reportData' => $data,
            'typeReport' => $report,
            'cashiers' => User::whereHas('role', function ($query) {$query->where('name', 'cashier');})->get(),
            'collection_centers' => CollectionCenter::with('counters')->get(),
            'receipt_collections' => ReceiptCollection::all(),
            'counters' => Counter::all(),
            'users' => User::all(),
            'income_codes' => IncomeCode::all(),
            'payment_type' => PaymentType::all(),
            'customers' => Customer::all(),
        ]);
    }

    public function update(BankDepositSlip $bankDepositSlip)
    {
        auth()->user()->hasPermission('manage report') ?: abort(403);

        $validate = request()->validate([
            'deposit_date' => 'required|date',
            'slip_number' => 'required',
        ]);

        DB::beginTransaction();

        try {
            $validate['status'] = auth()->user()->role() === Role::NAME_CASHIER ? BankDepositSlip::STATUS_UPDATED_BY_CASHIER : BankDepositSlip::STATUS_UPDATED_BY_SUPERVISOR;

            $validate['deposit_date'] = Carbon::parse($validate['deposit_date'])->format('Y-m-d');

            $bankDepositSlip->update($validate);

            $this->closeCounter($bankDepositSlip);

            DB::commit();

            activity('update')->performedOn($bankDepositSlip)->causedBy(auth()->user())->log("Slip Deposit Bank berjaya dikemaskini");
           
            return redirect()->back()->with('success', 'Proses berjaya!');

        } catch (\Exception $e) {
            DB::rollBack();
            dd($e);
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }

    }

    protected function CS04()
    {
        $report = QueryBuilder::for(Receipt::class)
            ->allowedFilters([
                AllowedFilter::callback('collection_center_id', function ($query, $value) {
                    $query->where('collection_center_id', $value);
                }),
                AllowedFilter::callback('counter_id', function ($query, $value) {
                    $query->where('counter_id', $value);
                }),
                AllowedFilter::callback('payment_type', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('payment_type', $value);
                    }
                }),
            ])
            ->when(request()->query('start_date'), function ($query) {
                $date = Carbon::createFromFormat('d-m-Y', request()->query('start_date'))->format('Y-m-d');
                $query->whereDate('date', '>=', $date);
            })
            ->when(request()->query('end_date'), function ($query) {
                $date = Carbon::createFromFormat('d-m-Y', request()->query('end_date'))->format('Y-m-d');
                $query->whereDate('date', '<=', $date);
            })
            ->with('latestChange.causer', 'firstChange.causer', 'paymentType')
            ->whereIn('status', Receipt::ACCEPTABLE_STATUSES)
            
            ->orderBy('date', 'desc')
            ->paginate(10);
        
        return $report;
    }

    protected function CS05()
    {
        $filterData = request()->only([
            'filter', 'start_date', 'end_date', 'page'
        ]);

        session(['cs05_filters' => $filterData]);

        $filters = request()->input('filter', []);
        $collectionCenterId = $filters['collection_center_id'] ?? null;
        $counterId = $filters['counter_id'] ?? null;
        $paymentType = $filters['payment_type'] ?? null;
      
        $report = PaymentType::query()
            ->select([
                'payment_types.id',
                'payment_types.description',
                'payment_types.name',
                DB::raw('COUNT(receipts.id) as count'),
                DB::raw('SUM(receipts.total_amount) as amount'),
            ])
            ->leftJoin('receipts', 'receipts.payment_type', '=', 'payment_types.name')
            ->when($collectionCenterId, fn($q) => $q->where('receipts.collection_center_id', $collectionCenterId))
            ->when($counterId, fn($q) => $q->where('receipts.counter_id', $counterId))
            ->when($paymentType, fn($q) => $q->whereIn('receipts.payment_type', $paymentType))
            ->when(request('start_date'), fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', request('start_date'))->format('Y-m-d')))
            ->when(request('end_date'), fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', request('end_date'))->format('Y-m-d')))
            ->groupBy('payment_types.id', 'payment_types.description', 'payment_types.name')
            ->orderBy('payment_types.id', 'asc')
            ->paginate(10)
            ->through(function ($row) {
                return [
                    'jenis_bayaran' => $row->description,
                    'name'          => $row->name,
                    'count'         => (int) $row->count,
                    'amount'        => number_format($row->amount ?: 0, 2, '.', ','),
                ];
            });
 
        // $report = QueryBuilder::for(PaymentType::class)
        //     ->when($paymentType, fn($q) => $q->where('name', $paymentType))
        //     ->paginate(10) 
        //     ->through(function ($type) use ($collectionCenterId, $counterId) {

        //         $receiptQuery = $type->receipts()
                    
        //             ->when($collectionCenterId, fn($q) => $q->where('collection_center_id', $collectionCenterId))
        //             ->when($counterId, fn($q) => $q->where('counter_id', $counterId))
        //             ->when(request()->query('start_date'), function ($query) {
        //                 $date = Carbon::createFromFormat('d-m-Y', request()->query('start_date'))->format('Y-m-d');
        //                 $query->whereDate('date', '>=', $date);
        //             })
        //             ->when(request()->query('end_date'), function ($query) {
        //                 $date = Carbon::createFromFormat('d-m-Y', request()->query('end_date'))->format('Y-m-d');
        //                 $query->whereDate('date', '<=', $date);
        //             });

        //         return [
        //             'jenis_bayaran' => $type->description,
        //             'code'          => $type->code,
        //             'count'         => $receiptQuery->count(),
        //             'amount'         => number_format($receiptQuery->sum('total_amount') ?: 0, 2, '.', ',') ?: 0,
        //         ];
        //     });

        return $report;
    }

    protected function CS06()
    {
        $filterData = request()->only([
            'filter', 'receipt_date', 'page'
        ]);

        session(['cs06_filters' => $filterData]);

        $filters = request()->input('filter', []);
        $collectionCenterId = $filters['collection_center_id'] ?? null;
        $counterId = $filters['counter_id'] ?? null;
        $userId = $filters['user_id'] ?? null;

        $rawDate = request()->input('receipt_date');
        $receiptDate = $rawDate
            ? Carbon::createFromFormat('d-m-Y', $rawDate)
            : Carbon::today();

        $selectedDay = $receiptDate->copy()->startOfDay()->toDateString();
        $selectedMonthMin = $receiptDate->copy()->startOfMonth()->toDateString();
        $selectedMonthMax = $receiptDate->copy()->endOfMonth()->toDateString();
        $selectedYearMin = $receiptDate->copy()->startOfYear()->toDateString();
        $selectedYearMax = $receiptDate->copy()->endOfYear()->toDateString();

        $query = DB::table('income_codes')
            ->leftJoin('receipts', 'receipts.service', '=', 'income_codes.name')
            ->select(
                'income_codes.id',
                'income_codes.name as service',
                'income_codes.code',

                DB::raw("SUM(CASE WHEN DATE(receipts.date) = '{$selectedDay}' THEN 1 ELSE 0 END) as day_count"),
                DB::raw("SUM(CASE WHEN DATE(receipts.date) = '{$selectedDay}' THEN receipts.total_amount ELSE 0 END) as day_amount"),

                DB::raw("SUM(CASE WHEN DATE(receipts.date) BETWEEN '{$selectedMonthMin}' AND '{$selectedMonthMax}' THEN 1 ELSE 0 END) as month_count"),
                DB::raw("SUM(CASE WHEN DATE(receipts.date) BETWEEN '{$selectedMonthMin}' AND '{$selectedMonthMax}' THEN receipts.total_amount ELSE 0 END) as month_amount"),

                DB::raw("SUM(CASE WHEN DATE(receipts.date) BETWEEN '{$selectedYearMin}' AND '{$selectedYearMax}' THEN 1 ELSE 0 END) as year_count"),
                DB::raw("SUM(CASE WHEN DATE(receipts.date) BETWEEN '{$selectedYearMin}' AND '{$selectedYearMax}' THEN receipts.total_amount ELSE 0 END) as year_amount")
            )
            ->when($collectionCenterId, fn($q) => $q->where('receipts.collection_center_id', $collectionCenterId))
            ->when($counterId, fn($q) => $q->where('receipts.counter_id', $counterId))
            ->when($userId, fn($q) => $q->where('receipts.user_id', $userId))
            ->when(request('start_date'), fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', request('receipt_date'))->format('Y-m-d')))
            ->groupBy('income_codes.id', 'income_codes.name', 'income_codes.code')
            ->havingRaw('
                SUM(CASE WHEN DATE(receipts.date) = ? THEN 1 ELSE 0 END) > 0
                OR SUM(CASE WHEN DATE(receipts.date) BETWEEN ? AND ? THEN 1 ELSE 0 END) > 0
                OR SUM(CASE WHEN DATE(receipts.date) BETWEEN ? AND ? THEN 1 ELSE 0 END) > 0
            ', [$selectedDay, $selectedMonthMin, $selectedMonthMax, $selectedYearMin, $selectedYearMax])
            ->orderBy('income_codes.id', 'asc');

        // Paginate and format
        $report = DB::table(DB::raw("({$query->toSql()}) as sub"))
            ->mergeBindings($query)
            ->paginate(10)
            ->through(function ($row) {
                return [
                    'service'       => $row->service,
                    'code'          => $row->code,

                    'count'         => (int) $row->day_count,
                    'amount'        => (float) $row->day_amount,

                    'month_count'   => (int) $row->month_count,
                    'month_amount'  => (float) $row->month_amount,

                    'year_count'    => (int) $row->year_count,
                    'year_amount'   => (float) $row->year_amount,
                ];
            });

        return $report;
    }

    protected function CS07()
    {
        $filterData = request()->only([
            'filter', 'receipt_date', 'page'
        ]);

        session(['cs07_filters' => $filterData]);

        $filters = request()->input('filter', []);
        $collectionCenterId = $filters['collection_center_id'] ?? null;
        $counterId = $filters['counter_id'] ?? null;
        $userId = $filters['user_id'] ?? null;

        $rawDate = request()->input('receipt_date');
        $receiptDate = $rawDate
            ? Carbon::createFromFormat('d-m-Y', $rawDate)
            : Carbon::today();

        $selectedDay = $receiptDate->copy()->startOfDay()->toDateString();
        $selectedMonthMin = $receiptDate->copy()->startOfMonth()->toDateString();
        $selectedMonthMax = $receiptDate->copy()->endOfMonth()->toDateString();
        $selectedYearMin = $receiptDate->copy()->startOfYear()->toDateString();
        $selectedYearMax = $receiptDate->copy()->endOfYear()->toDateString();

        $query = DB::table('income_codes')
            ->leftJoin('receipts', 'receipts.service', '=', 'income_codes.name')
            ->select(
                'income_codes.id',
                'income_codes.name as service',
                'income_codes.code',

                DB::raw("SUM(CASE WHEN DATE(receipts.date) = '{$selectedDay}' THEN 1 ELSE 0 END) as day_count"),
                DB::raw("SUM(CASE WHEN DATE(receipts.date) = '{$selectedDay}' THEN receipts.total_amount ELSE 0 END) as day_amount"),

                DB::raw("SUM(CASE WHEN DATE(receipts.date) BETWEEN '{$selectedMonthMin}' AND '{$selectedMonthMax}' THEN 1 ELSE 0 END) as month_count"),
                DB::raw("SUM(CASE WHEN DATE(receipts.date) BETWEEN '{$selectedMonthMin}' AND '{$selectedMonthMax}' THEN receipts.total_amount ELSE 0 END) as month_amount"),

                DB::raw("SUM(CASE WHEN DATE(receipts.date) BETWEEN '{$selectedYearMin}' AND '{$selectedYearMax}' THEN 1 ELSE 0 END) as year_count"),
                DB::raw("SUM(CASE WHEN DATE(receipts.date) BETWEEN '{$selectedYearMin}' AND '{$selectedYearMax}' THEN receipts.total_amount ELSE 0 END) as year_amount")
            )
            ->when($collectionCenterId, fn($q) => $q->where('receipts.collection_center_id', $collectionCenterId))
            ->when($counterId, fn($q) => $q->where('receipts.counter_id', $counterId))
            ->when($userId, fn($q) => $q->where('receipts.user_id', $userId))
            ->when(request('start_date'), fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', request('receipt_date'))->format('Y-m-d')))
            ->groupBy('income_codes.id', 'income_codes.name', 'income_codes.code')
            ->havingRaw('
                SUM(CASE WHEN DATE(receipts.date) = ? THEN 1 ELSE 0 END) > 0
                OR SUM(CASE WHEN DATE(receipts.date) BETWEEN ? AND ? THEN 1 ELSE 0 END) > 0
                OR SUM(CASE WHEN DATE(receipts.date) BETWEEN ? AND ? THEN 1 ELSE 0 END) > 0
            ', [$selectedDay, $selectedMonthMin, $selectedMonthMax, $selectedYearMin, $selectedYearMax])
            ->orderBy('income_codes.id', 'asc');

        // Paginate and format
        $report = DB::table(DB::raw("({$query->toSql()}) as sub"))
            ->mergeBindings($query)
            ->paginate(10)
            ->through(function ($row) {
                return [
                    'service'       => $row->service,
                    'code'          => $row->code,

                    'count'         => (int) $row->day_count,
                    'amount'        => (float) $row->day_amount,

                    'month_count'   => (int) $row->month_count,
                    'month_amount'  => (float) $row->month_amount,

                    'year_count'    => (int) $row->year_count,
                    'year_amount'   => (float) $row->year_amount,
                ];
            });

        return $report;
    }

    protected function CS08()
    {
        $filterData = request()->only([
            'filter', 'start_date', 'end_date', 'page'
        ]);

        session(['cs08_filters' => $filterData]);

        $report = QueryBuilder::for(Receipt::class)
            ->allowedFilters([
                AllowedFilter::callback('collection_center_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('collection_center_id', $value);
                    }
                }),
                AllowedFilter::callback('counter_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('counter_id', $value);
                    }
                }),
                AllowedFilter::callback('income_code_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->whereHas('incomeCode', function ($q) use ($value) {
                            $q->whereIn('id', $value);
                        });
                    }
                }),
            ])
            ->when(request('start_date'), fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', request('start_date'))->format('Y-m-d')))
            ->when(request('end_date'), fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', request('end_date'))->format('Y-m-d')))
            ->with('latestChange.causer', 'firstChange.causer', 'paymentType')
            
            ->orderBy('date', 'desc')
            ->paginate(10);

        return $report; 
    }

    // protected function CS09()
    // {
    //     $filters = request()->input('filter', []);
    //     $collectionCenterId = $filters['collection_center_id'] ?? null;
    //     $counterId = $filters['counter_id'] ?? null;
    //     $userId = $filters['user_id'] ?? null;
    //     $incomeCodeId = $filters['income_code_id'] ?? null;
   
    //     $report = QueryBuilder::for(IncomeCode::class)
    //         ->when($incomeCodeId, fn($q) => $q->where('id', $incomeCodeId))
    //         ->paginate(10) 
    //         ->through(function ($type) use ($collectionCenterId, $counterId, $userId) {

    //             $receiptQuery = $type->receipts()
                    
    //                 ->when($collectionCenterId, fn($q) => $q->where('collection_center_id', $collectionCenterId))
    //                 ->when($counterId, fn($q) => $q->where('counter_id', $counterId))
    //                 ->when($userId, fn($q) => $q->where('user_id', $userId));

    //             return [
    //                 'jenis_bayaran' => $type->name,
    //                 'code'          => $type->code,
    //                 'count'         => $receiptQuery->count(),
    //                 'amount'         => number_format($receiptQuery->sum('total_amount') ?: 0, 2, '.', ',') ?: 0,
    //             ];
    //         });
       
    //     return $report;
    // }
    protected function CS09()
    {
        $filterData = request()->only([
            'filter', 'start_date', 'end_date', 'page'
        ]);

        session(['cs09_filters' => $filterData]);

        $filters = request()->input('filter', []);
        $collectionCenterId = $filters['collection_center_id'] ?? null;
        $counterId = $filters['counter_id'] ?? null;
        $incomeCodeId = $filters['income_code_id'] ?? null;

        $report = IncomeCode::query()
            ->select([
                'income_codes.id',
                'income_codes.name as jenis_bayaran',
                'income_codes.code',
                DB::raw('COUNT(receipts.id) as count'),
                DB::raw('SUM(receipts.total_amount) as amount'),
            ])
            ->leftJoin('receipts', 'receipts.service', '=', 'income_codes.name')
            ->when($incomeCodeId, fn($q) => $q->whereIn('income_codes.id', $incomeCodeId))
            ->when($collectionCenterId, fn($q) => $q->where('receipts.collection_center_id', $collectionCenterId))
            ->when($counterId, fn($q) => $q->where('receipts.counter_id', $counterId))
            ->when(request('start_date'), fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', request('start_date'))->format('Y-m-d')))
            ->when(request('end_date'), fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', request('end_date'))->format('Y-m-d')))
            ->groupBy('income_codes.id', 'income_codes.name', 'income_codes.code')
            ->orderBy('income_codes.id', 'asc')
            ->paginate(10)
            ->through(function ($row) {
                return [
                    'jenis_bayaran' => $row->jenis_bayaran,
                    'code'          => $row->code,
                    'count'         => (int) $row->count,
                    'amount'        => number_format($row->amount ?: 0, 2, '.', ','),
                ];
            });

        return $report;
    }

    protected function CS10()
    {
        $report = QueryBuilder::for(Receipt::class)
            ->allowedFilters([
                AllowedFilter::callback('collection_center_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('collection_center_id', $value);
                    }
                }),
                AllowedFilter::callback('counter_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('counter_id', $value);
                    }
                }),
                AllowedFilter::callback('user_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('user_id', $value);
                    }
                }),
            ])
            ->when(request('start_date'), fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', request('start_date'))->format('Y-m-d')))
            ->when(request('end_date'), fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', request('end_date'))->format('Y-m-d')))
            ->with('latestChange.causer', 'firstChange.causer', 'paymentType', 'details')
            
            ->orderBy('date', 'desc')
            ->paginate(10);
    
        return $report;
    }

    protected function CS11()
    {
        $report = QueryBuilder::for(Receipt::class)
            ->allowedFilters([
                AllowedFilter::callback('collection_center_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('collection_center_id', $value);
                    }
                }),
                AllowedFilter::callback('counter_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('counter_id', $value);
                    }
                }),
                AllowedFilter::callback('user_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('user_id', $value);
                    }
                }),
            ])
            ->when(request('start_date'), fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', request('start_date'))->format('Y-m-d')))
            ->when(request('end_date'), fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', request('end_date'))->format('Y-m-d')))
            ->with('latestChange.causer', 'firstChange.causer', 'paymentType', 'details')
            
            ->orderBy('date', 'desc')
            ->paginate(10);
    
        return $report;
    }

    protected function CS12()
    {
        $filters = request()->input('filter', []);
        $collectionCenterId = $filters['collection_center_id'] ?? null;
        $counterId = $filters['counter_id'] ?? null;
        $userId = $filters['user_id'] ?? null;

        $report = QueryBuilder::for(PaymentType::class)
            ->paginate(10) 
            ->through(function ($type) use ($collectionCenterId, $counterId, $userId) {

                $receiptQuery = $type->receipts()
                    
                    ->when($collectionCenterId, fn($q) => $q->where('collection_center_id', $collectionCenterId))
                    ->when($counterId, fn($q) => $q->where('counter_id', $counterId))
                    ->when($userId, fn($q) => $q->where('user_id', $userId));

                return [
                    'jenis_bayaran' => $type->description,
                    'code'          => $type->code,
                    'count'         => $receiptQuery->count(),
                    'amount'         => number_format($receiptQuery->sum('total_amount') ?: 0, 2, '.', ',') ?: 0,
                ];
            });

        return $report;
    }

    protected function CS13()
    {
        $report = QueryBuilder::for(Receipt::class)
            ->allowedFilters([
                AllowedFilter::callback('collection_center_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('collection_center_id', $value);
                    }
                }),
                AllowedFilter::callback('counter_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('counter_id', $value);
                    }
                }),
                AllowedFilter::callback('income_code', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('service', $value);
                    }
                }),
            ])
            ->when(request('start_date'), fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', request('start_date'))->format('Y-m-d')))
            ->when(request('end_date'), fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', request('end_date'))->format('Y-m-d')))
            ->with('latestChange.causer', 'firstChange.causer', 'paymentType', 'incomeCode', 'details')
            
            ->orderBy('date', 'desc')
            ->paginate(10);
    
        return $report;
    }

    protected function getCS16Query()
    {
        return QueryBuilder::for(Receipt::class)
            ->allowedFilters([
                AllowedFilter::callback('collection_center_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('collection_center_id', $value);
                    }
                }),
                AllowedFilter::callback('counter_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('counter_id', $value);
                    }
                }),
                AllowedFilter::callback('user_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('user_id', $value);
                    }
                }),
            ])
            ->when(request()->query('start_date'), function ($query) {
                $date = Carbon::createFromFormat('d-m-Y', request()->query('start_date'))->format('Y-m-d');
                $query->whereDate('date', '>=', $date);
            })
            ->when(request()->query('end_date'), function ($query) {
                $date = Carbon::createFromFormat('d-m-Y', request()->query('end_date'))->format('Y-m-d');
                $query->whereDate('date', '<=', $date);
            })
            ->with('latestChange.causer', 'firstChange.causer', 'paymentType', 'incomeCode', 'details')
            ->orderBy('date', 'desc')
            ;
    }

    protected function CS16()
    {
        $filterData = request()->only([
            'filter', 'start_date', 'end_date', 'page'
        ]);

        session(['cs16_filters' => $filterData]);

        return $this->getCS16Query()->paginate(10);
    }

    public function printCS16(Receipt $receipt)
    {
        $collection_center = $receipt->collectionCenter->name;

        $counter = $receipt->counter->name;

        $entries = Receipt::where('id', $receipt->id)
            
            ->with('details')
            ->orderBy('date', 'desc')
            ->limit(50)
            ->get();
   
        $pdf = Pdf::loadView('pdf.report.cs16', 
            compact('entries', 
                'collection_center', 
                'counter', 
            ));
            
        return $pdf->stream();
    }

    protected function getCS17Query()
    {
        $latestIds = Receipt::selectRaw('MAX(id) as id')
            ->whereNotNull('account_number')
            ->groupBy('account_number');

        return QueryBuilder::for(Receipt::class)
            ->whereIn('id', $latestIds)
            ->allowedFilters([
                AllowedFilter::callback('collection_center_id', fn($q, $v) => $q->where('collection_center_id', $v)),
                AllowedFilter::callback('counter_id', fn($q, $v) => $q->where('counter_id', $v)),
                AllowedFilter::callback('payment_type', fn($q, $v) => $q->where('payment_type', $v)),
            ])
            ->when(request('start_date'), fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', request('start_date'))->format('Y-m-d')))
            ->when(request('end_date'), fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', request('end_date'))->format('Y-m-d')))
            ->with('customer', 'paymentType', 'incomeCode', 'details')
            ->orderBy('date', 'desc')
            ;
    }

    public function CS17()
    {
        $filterData = request()->only([
            'filter', 'start_date', 'end_date', 'page'
        ]);

        session(['cs17_filters' => $filterData]);

        $report = $this->getCS17Query()->paginate(10);
        return $this->appendCustomerNames($report);
    }

    private function appendCustomerNames($report)
    {
        $accountNumbers = $report->pluck('account_number')->filter()->unique();
        $customers = Customer::whereIn('account_number', $accountNumbers)->get()->keyBy('account_number');

        $report->getCollection()->transform(function ($receipt) use ($customers) {
            $receipt->customer_name = $customers[$receipt->account_number]->name ?? '-';
            return $receipt;
        });

        return $report;
    }

    public function printCS17()
    {
        $customer_name = request()->input('customer');

        $filter = request()->input('filterValues');

        $collectionCenterId = $filter['filter[collection_center_id'] ?? null;

        $counterId = $filter['filter[counter_id'] ?? null;

        $startDate = Carbon::parse(Arr::get($filter, 'start_date', now()))->startOfDay();

        $endDate = Carbon::parse(Arr::get($filter, 'end_date', now()))->startOfDay();

        $listOfAccountNumber = Customer::where('name', 'like', '%' . $customer_name . '%')
            ->pluck('account_number')
            ->unique()
            ->toArray();

        $entries = Receipt::whereIn('account_number', $listOfAccountNumber)
            ->when($collectionCenterId, fn ($query) => $query->where('collection_center_id', $collectionCenterId)
            )
            ->when($counterId, fn ($query) => $query->where('counter_id', $counterId)
            )
            
            ->with('details')
            ->orderBy('date', 'desc')
            ->limit(50)
            ->get();
        
        $pdf = Pdf::loadView('pdf.report.cs17', 
            compact('entries', 
                'customer_name', 
                'collectionCenterId', 
                'counterId',
                'startDate', 
                'endDate',
            ));
            
        return $pdf->stream();
    }

    protected function Slip_Deposit_Bank_Tunai()
    {
        $report = QueryBuilder::for(BankDepositSlip::class)
            ->allowedFilters([
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->select('bank_deposit_slips.*')
                        ->join('counters', 'bank_deposit_slips.counter_id', '=', 'counters.id')
                        ->join('collection_centers', 'counters.collection_center_id', '=', 'collection_centers.id')
                        ->where(function ($query) use ($value) {
                            $query->where('counters.name', 'LIKE', '%' . $value . '%')
                                ->orWhere('collection_centers.name', 'LIKE', '%' . $value . '%');
                        });
                }),
                AllowedFilter::callback('collection_center_id', function ($query, $value) {
                    $query->where('collection_center_id', $value);
                }),
                AllowedFilter::callback('counter_id', function ($query, $value) {
                    $query->where('counter_id', $value);
                }),
                AllowedFilter::callback('user_id', function ($query, $value) {
                    $query->where('user_id', $value);
                }),
            ])
            ->when(request('start_date'), fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', request('start_date'))->format('Y-m-d')))
            ->when(request('end_date'), fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', request('end_date'))->format('Y-m-d')))
            ->with(['latestChange.causer', 'firstChange.causer'])
            ->whereIn('payment_type', ['Tunai', 'CSH'])
            
            ->orderBy('date', 'desc')
            ->limit(50)
            ->paginate(10);

        $report->getCollection()->transform(function ($item) {
            $item->isAllowEdit = ($item->amount_from_receipt <= $item->amount_from_cash_breakdown_receipt);
            return $item;
        });

        $report->getCollection()->transform(function ($item) {
            $item->isAllowView = ($item->deposit_date != null) && ($item->slip_number != null);
            return $item;
        });

        return $report;
    }
    
    protected function Slip_Deposit_Bank_Deraf_Bank()
    {
        $report = QueryBuilder::for(BankDepositSlip::class)
            ->allowedFilters([
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->select('bank_deposit_slips.*')
                        ->join('counters', 'bank_deposit_slips.counter_id', '=', 'counters.id')
                        ->join('collection_centers', 'counters.collection_center_id', '=', 'collection_centers.id')
                        ->where(function ($query) use ($value) {
                            $query->where('counters.name', 'LIKE', '%' . $value . '%')
                                ->orWhere('collection_centers.name', 'LIKE', '%' . $value . '%');
                        });
                }),
                AllowedFilter::callback('collection_center_id', function ($query, $value) {
                    $query->where('collection_center_id', $value);
                }),
                AllowedFilter::callback('counter_id', function ($query, $value) {
                    $query->where('counter_id', $value);
                }),
                AllowedFilter::callback('user_id', function ($query, $value) {
                    $query->where('user_id', $value);
                }),
            ])
            ->when(request('start_date'), fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', request('start_date'))->format('Y-m-d')))
            ->when(request('end_date'), fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', request('end_date'))->format('Y-m-d')))
            ->with(['latestChange.causer', 'firstChange.causer'])
            ->where('payment_type', 'DF')
            
            ->paginate(10);

        return $report;
    }
    
    protected function Slip_Deposit_Bank_Cek()
    {
        $report = QueryBuilder::for(BankDepositSlip::class)
            ->allowedFilters([
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->select('bank_deposit_slips.*')
                        ->join('counters', 'bank_deposit_slips.counter_id', '=', 'counters.id')
                        ->join('collection_centers', 'counters.collection_center_id', '=', 'collection_centers.id')
                        ->where(function ($query) use ($value) {
                            $query->where('counters.name', 'LIKE', '%' . $value . '%')
                                ->orWhere('collection_centers.name', 'LIKE', '%' . $value . '%');
                        });
                }),
                AllowedFilter::callback('collection_center_id', function ($query, $value) {
                    $query->where('collection_center_id', $value);
                }),
                AllowedFilter::callback('counter_id', function ($query, $value) {
                    $query->where('counter_id', $value);
                }),
                AllowedFilter::callback('user_id', function ($query, $value) {
                    $query->where('user_id', $value);
                }),
            ])
            ->when(request('start_date'), fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', request('start_date'))->format('Y-m-d')))
            ->when(request('end_date'), fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', request('end_date'))->format('Y-m-d')))
            ->with(['latestChange.causer', 'firstChange.causer'])
            ->where('payment_type', 'LCQ')
            
            ->paginate(10);

        return $report;
    }
    
    protected function Slip_Deposit_Bank_Slip_Bank()
    {
        $report = QueryBuilder::for(BankDepositSlip::class)
            ->allowedFilters([
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->select('bank_deposit_slips.*')
                        ->join('counters', 'bank_deposit_slips.counter_id', '=', 'counters.id')
                        ->join('collection_centers', 'counters.collection_center_id', '=', 'collection_centers.id')
                        ->where(function ($query) use ($value) {
                            $query->where('counters.name', 'LIKE', '%' . $value . '%')
                                ->orWhere('collection_centers.name', 'LIKE', '%' . $value . '%');
                        });
                }),
                AllowedFilter::callback('collection_center_id', function ($query, $value) {
                    $query->where('collection_center_id', $value);
                }),
                AllowedFilter::callback('counter_id', function ($query, $value) {
                    $query->where('counter_id', $value);
                }),
                AllowedFilter::callback('user_id', function ($query, $value) {
                    $query->where('user_id', $value);
                }),
            ])
            ->when(request('start_date'), fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', request('start_date'))->format('Y-m-d')))
            ->when(request('end_date'), fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', request('end_date'))->format('Y-m-d')))
            ->with(['latestChange.causer', 'firstChange.causer'])
            ->where('payment_type', 'SB')
            
            ->paginate(10);
      
        return $report;
    }
    
    protected function Slip_Deposit_Bank_CC()
    {
        $report = QueryBuilder::for(BankDepositSlip::class)
            ->allowedFilters([
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->select('bank_deposit_slips.*')
                        ->join('counters', 'bank_deposit_slips.counter_id', '=', 'counters.id')
                        ->join('collection_centers', 'counters.collection_center_id', '=', 'collection_centers.id')
                        ->where(function ($query) use ($value) {
                            $query->where('counters.name', 'LIKE', '%' . $value . '%')
                                ->orWhere('collection_centers.name', 'LIKE', '%' . $value . '%');
                        });
                }),
                AllowedFilter::callback('collection_center_id', function ($query, $value) {
                    $query->where('collection_center_id', $value);
                }),
                AllowedFilter::callback('counter_id', function ($query, $value) {
                    $query->where('counter_id', $value);
                }),
                AllowedFilter::callback('user_id', function ($query, $value) {
                    $query->where('user_id', $value);
                }),
            ])
            ->when(request('start_date'), fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', request('start_date'))->format('Y-m-d')))
            ->when(request('end_date'), fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', request('end_date'))->format('Y-m-d')))
            ->with(['latestChange.causer', 'firstChange.causer'])
            ->where('payment_type', 'CC')
            
            ->paginate(10);

        return $report;
    }
    
    protected function Slip_Deposit_Bank_QR()
    {
        $report = QueryBuilder::for(BankDepositSlip::class)
            ->allowedFilters([
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->select('bank_deposit_slips.*')
                        ->join('counters', 'bank_deposit_slips.counter_id', '=', 'counters.id')
                        ->join('collection_centers', 'counters.collection_center_id', '=', 'collection_centers.id')
                        ->where(function ($query) use ($value) {
                            $query->where('counters.name', 'LIKE', '%' . $value . '%')
                                ->orWhere('collection_centers.name', 'LIKE', '%' . $value . '%');
                        });
                }),
                AllowedFilter::callback('collection_center_id', function ($query, $value) {
                    $query->where('collection_center_id', $value);
                }),
                AllowedFilter::callback('counter_id', function ($query, $value) {
                    $query->where('counter_id', $value);
                }),
                AllowedFilter::callback('user_id', function ($query, $value) {
                    $query->where('user_id', $value);
                }),
            ])
            ->when(request('start_date'), fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', request('start_date'))->format('Y-m-d')))
            ->when(request('end_date'), fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', request('end_date'))->format('Y-m-d')))
            ->with(['latestChange.causer', 'firstChange.causer'])
            ->where('payment_type', 'QR')
            
            ->paginate(10);

        return $report;
    }

    protected function Slip_Deposit_Bank_Pos()
    {
        $report = QueryBuilder::for(BankDepositSlip::class)
            ->allowedFilters([
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->select('bank_deposit_slips.*')
                        ->join('counters', 'bank_deposit_slips.counter_id', '=', 'counters.id')
                        ->join('collection_centers', 'counters.collection_center_id', '=', 'collection_centers.id')
                        ->where(function ($query) use ($value) {
                            $query->where('counters.name', 'LIKE', '%' . $value . '%')
                                ->orWhere('collection_centers.name', 'LIKE', '%' . $value . '%');
                        });
                }),
                AllowedFilter::callback('collection_center_id', function ($query, $value) {
                    $query->where('collection_center_id', $value);
                }),
                AllowedFilter::callback('counter_id', function ($query, $value) {
                    $query->where('counter_id', $value);
                }),
                AllowedFilter::callback('user_id', function ($query, $value) {
                    $query->where('user_id', $value);
                }),
            ])
            ->when(request('start_date'), fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', request('start_date'))->format('Y-m-d')))
            ->when(request('end_date'), fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', request('end_date'))->format('Y-m-d')))
            ->with(['latestChange.causer', 'firstChange.causer'])
            ->where('payment_type', 'WP')
            
            ->paginate(10);

        return $report;
    }
    
    protected function Slip_Deposit_Bank_EFT()
    {
        $report = QueryBuilder::for(BankDepositSlip::class)
            ->allowedFilters([
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->select('bank_deposit_slips.*')
                        ->join('counters', 'bank_deposit_slips.counter_id', '=', 'counters.id')
                        ->join('collection_centers', 'counters.collection_center_id', '=', 'collection_centers.id')
                        ->where(function ($query) use ($value) {
                            $query->where('counters.name', 'LIKE', '%' . $value . '%')
                                ->orWhere('collection_centers.name', 'LIKE', '%' . $value . '%');
                        });
                }),
                AllowedFilter::callback('collection_center_id', function ($query, $value) {
                    $query->where('collection_center_id', $value);
                }),
                AllowedFilter::callback('counter_id', function ($query, $value) {
                    $query->where('counter_id', $value);
                }),
                AllowedFilter::callback('user_id', function ($query, $value) {
                    $query->where('user_id', $value);
                }),
            ])
            ->when(request('start_date'), fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', request('start_date'))->format('Y-m-d')))
            ->when(request('end_date'), fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', request('end_date'))->format('Y-m-d')))
            ->with(['latestChange.causer', 'firstChange.causer'])
            ->where('payment_type', 'EFT')
            
            ->paginate(10);

        return $report;
    }
    
    protected function Audit_Roi()
    {
        $report = QueryBuilder::for(Receipt::class)
            ->allowedFilters([
                AllowedFilter::callback('collection_center_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('collection_center_id', $value);
                    }
                }),
                AllowedFilter::callback('counter_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('counter_id', $value);
                    }
                }),
                AllowedFilter::callback('user_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('user_id', $value);
                    }
                }),
            ])
            ->when(request()->query('start_date'), function ($query) {
                $date = Carbon::createFromFormat('d-m-Y', request()->query('start_date'))->format('Y-m-d');
                $query->whereDate('date', '>=', $date);
            })
            ->when(request()->query('end_date'), function ($query) {
                $date = Carbon::createFromFormat('d-m-Y', request()->query('end_date'))->format('Y-m-d');
                $query->whereDate('date', '<=', $date);
            })
            ->with(['latestChange.causer', 'firstChange.causer'])
            
            ->orderBy('date', 'desc')
            ->paginate(10);

        return $report;
    }

    public function printAuditRol(Receipt $receipt)
    {
        $operator_id = $receipt->user_id;
        $operator_name =  $receipt->user->name;
        $date = Carbon::parse($receipt->date)->format('d-m-Y');
        $station = $receipt->collectionCenter->name;
        $machine = $receipt->counter->name;
        $page = '1';

        $entries = Receipt::where('id', $receipt->id)->limit(50)->get();

        $pdf = Pdf::loadView('pdf.report.audit-rol', compact('entries', 'operator_id', 'operator_name', 'date', 'station', 'machine', 'page'));

        return $pdf->stream();
    }
    
    protected function Audit_Roi_Mengikut_Resit()
    {
        $report = QueryBuilder::for(Receipt::class)
            ->allowedFilters([
                AllowedFilter::callback('collection_center_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('collection_center_id', $value);
                    }
                }),
                AllowedFilter::callback('counter_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('counter_id', $value);
                    }
                }),
                AllowedFilter::callback('user_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('user_id', $value);
                    }
                }),
            ])
            ->when(request()->query('start_date'), function ($query) {
                $date = Carbon::createFromFormat('d-m-Y', request()->query('start_date'))->format('Y-m-d');
                $query->whereDate('date', '>=', $date);
            })
            ->when(request()->query('end_date'), function ($query) {
                $date = Carbon::createFromFormat('d-m-Y', request()->query('end_date'))->format('Y-m-d');
                $query->whereDate('date', '<=', $date);
            })
            ->with(['latestChange.causer', 'firstChange.causer'])
            
            ->orderBy('date', 'desc')
            ->paginate(10);

        return $report;
    }
    
    protected function Audit_Trail()
    {
        $report = QueryBuilder::for(Activity::class)
            ->when(request()->query('start_date'), function ($query) {
                $date = Carbon::createFromFormat('d-m-Y', request()->query('start_date'))->format('Y-m-d');
                $query->whereDate('created_at', '>=', $date);
            })
            ->when(request()->query('end_date'), function ($query) {
                $date = Carbon::createFromFormat('d-m-Y', request()->query('end_date'))->format('Y-m-d');
                $query->whereDate('created_at', '<=', $date);
            })
            ->where(function ($q) {
                $q->where('log_name', 'login')
                ->orWhere('log_name', 'logout');
            })
            ->with('causer')
            ->latest()
            ->paginate(10);

        return $report;
    }

    public function printAuditTrail()
    {
        $start_date = request()->query('start_date');
        $end_date = request()->query('end_date');

        $logs = Activity::whereIn('log_name', ['login', 'logout'])
            ->when(request()->query('start_date'), function ($query) use ($start_date) {
                $date = Carbon::createFromFormat('d-m-Y', $start_date)->format('Y-m-d');
                $query->whereDate('created_at', '>=', $date);
            })
            ->when(request()->query('end_date'), function ($query)  use ($end_date) {
                $date = Carbon::createFromFormat('d-m-Y', $end_date)->format('Y-m-d');
                $query->whereDate('created_at', '<=', $date);
            })
            ->with('causer')
            ->latest()
            ->get();

        $pdf = Pdf::loadView('pdf.report.audit-trail', compact('logs', 'start_date', 'end_date'));

        return $pdf->stream();
    }
    
    protected function Senarai_Resit_Batal()
    {
        $filterData = request()->only([
            'filter', 'start_date', 'end_date', 'page'
        ]);

        session(['laporan_resit_batal_filters' => $filterData]);

        $report = QueryBuilder::for(Receipt::class)
            ->allowedFilters([
                AllowedFilter::callback('collection_center_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('collection_center_id', $value);
                    }
                }),
                AllowedFilter::callback('counter_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('counter_id', $value);
                    }
                }),
                AllowedFilter::callback('user_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('user_id', $value);
                    }
                }),
            ])
            ->when(request()->query('start_date'), function ($query) {
                $date = Carbon::createFromFormat('d-m-Y', request()->query('start_date'))->format('Y-m-d');
                $query->whereDate('date', '>=', $date);
            })
            ->when(request()->query('end_date'), function ($query) {
                $date = Carbon::createFromFormat('d-m-Y', request()->query('end_date'))->format('Y-m-d');
                $query->whereDate('date', '<=', $date);
            })
            ->with('latestChange.causer', 'firstChange.causer', 'cancelled')
            ->where('status', Receipt::STATUS_CANCELLED)
            
            ->orderBy('date', 'desc')
            ->paginate(10);
      
        return $report;
    }
    
    protected function Edit_Resit()
    {
        $filterData = request()->only([
            'filter', 'start_date', 'end_date', 'page'
        ]);

        session(['laporan_edit_resit_filters' => $filterData]);

        $report = QueryBuilder::for(Receipt::class)
            ->allowedFilters([
                AllowedFilter::callback('collection_center_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('collection_center_id', $value);
                    }
                }),
                AllowedFilter::callback('counter_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('counter_id', $value);
                    }
                }),
                AllowedFilter::callback('user_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('user_id', $value);
                    }
                }),
            ])
            ->when(request()->query('start_date'), function ($query) {
                $date = Carbon::createFromFormat('d-m-Y', request()->query('start_date'))->format('Y-m-d');
                $query->whereDate('date', '>=', $date);
            })
            ->when(request()->query('end_date'), function ($query) {
                $date = Carbon::createFromFormat('d-m-Y', request()->query('end_date'))->format('Y-m-d');
                $query->whereDate('date', '<=', $date);
            })
            ->with('latestChange.causer', 'firstChange.causer')
            ->where('status', Receipt::STATUS_EDITED)
            
            ->orderBy('date', 'desc')
            ->paginate(10);

        return $report;
    }
    
    protected function Tamat_Hari()
    {
        $filters = request()->input('filter', []);
        $collectionCenterId = $filters['collection_center_id'] ?? null;
        $counterId = $filters['counter_id'] ?? null;
        $userId = $filters['user_id'] ?? null;

        $report = QueryBuilder::for(PaymentType::class)
            ->paginate(10) 
            ->through(function ($type) use ($collectionCenterId, $counterId, $userId) {

                $receiptQuery = $type->receipts()
                    
                    ->when($collectionCenterId, fn($q) => $q->where('collection_center_id', $collectionCenterId))
                    ->when($counterId, fn($q) => $q->where('counter_id', $counterId))
                    ->when($userId, fn($q) => $q->where('user_id', $userId))
                    ->when(request()->query('start_date'), function ($query) {
                        $date = Carbon::createFromFormat('d-m-Y', request()->query('start_date'))->format('Y-m-d');
                        $query->whereDate('date', $date);
                    });
                    // ->when(request()->query('end_date'), function ($query) {
                    //     $date = Carbon::createFromFormat('d-m-Y', request()->query('end_date'))->format('Y-m-d');
                    //     $query->whereDate('date', '<=', $date);
                    // });

                return [
                    'jenis_bayaran' => $type->description,
                    'code'          => $type->code,
                    'count'         => $receiptQuery->count(),
                    'amount'         => number_format($receiptQuery->sum('total_amount') ?: 0, 2, '.', ',') ?: 0,
                ];
            });

        return $report;
    }

    protected function Inquiry()
    {
        $filterData = request()->only([
            'filter', 'start_date', 'end_date', 'page'
        ]);

        session(['inquiry_fitler' => $filterData]);

        $report = QueryBuilder::for(Receipt::class)
            ->allowedFilters([
                AllowedFilter::callback('collection_center_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('collection_center_id', $value);
                    }
                }),
                AllowedFilter::callback('counter_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('counter_id', $value);
                    }
                }),
                AllowedFilter::callback('income_code', function ($query, $value) {
                    if (!empty($value)) {
                        $query->whereIn('service', $value);
                    }
                }),
                AllowedFilter::callback('payment_type', function ($query, $value) {
                    if (!empty($value)) {
                        $query->whereIn('payment_type', $value);
                    }
                }),
            ])
            ->when(request()->query('start_date'), function ($query) {
                $date = Carbon::createFromFormat('d-m-Y', request()->query('start_date'))->format('Y-m-d');
                $query->whereDate('date', '>=', $date);
            })
            ->when(request()->query('end_date'), function ($query) {
                $date = Carbon::createFromFormat('d-m-Y', request()->query('end_date'))->format('Y-m-d');
                $query->whereDate('date', '<=', $date);
            })
            ->with('latestChange.causer', 'firstChange.causer', 'paymentType')
            
            ->orderBy('date', 'desc')
            ->paginate(10);

        return $report;
        
    }

    protected function FloatCash()
    {
        $filterData = request()->only([
            'filter', 'start_date', 'end_date', 'page'
        ]);

        session(['float_cash_fitler' => $filterData]);

        $report = QueryBuilder::for(FloatCashRequest::class)
            ->allowedFilters([
                AllowedFilter::callback('collection_center_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('collection_center_id', $value);
                    }
                }),
                AllowedFilter::callback('counter_id', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('counter_id', $value);
                    }
                }),
                AllowedFilter::callback('floating_type', function ($query, $value) {
                    if (!empty($value)) {
                        $query->where('type', $value);
                    }
                }),
            ])
            ->when(request()->query('start_date'), function ($query) {
                $date = Carbon::createFromFormat('d-m-Y', request()->query('start_date'))->format('Y-m-d');
                $query->whereDate('date_applied', '>=', $date);
            })
            ->when(request()->query('end_date'), function ($query) {
                $date = Carbon::createFromFormat('d-m-Y', request()->query('end_date'))->format('Y-m-d');
                $query->whereDate('date_applied', '<=', $date);
            })
            ->where('status', FloatCashRequest::STATUS_APPROVED)
            ->with('latestChange.causer', 'firstChange.causer')
            
            ->orderBy('date_applied', 'desc')
            ->paginate(10);

        return $report;
    }

    protected function closeCounter($bankDepositSlip) 
    {
        try {
            # Get All Receipts Total Amount based on Counter ID
            // $receipts_amount = Receipt::where('collection_center_id', $bankDepositSlip->collection_center_id)
            //     ->where('counter_id', $bankDepositSlip->counter_id)
            //     ->sum('total_amount');

            # Tally Bank Deposit Slip
            // if($receipts_amount !== $bankDepositSlip->amount) {
            //     return redirect()->back()->with('error', 'Proses gagal! Amaun Wang Terimaan dan Amaun Resit Deposit Bank tidak sama!');
            // }

            $date = Carbon::parse($bankDepositSlip->date)->toDateString();
            # Close Counter Record for Cashier
            $openedCounter = OpenedCounter::where('collection_center_id', $bankDepositSlip->collection_center_id)
                ->where('counter_id', $bankDepositSlip->counter_id)
                ->whereDate('opened_at', $date)
                ->where('status', OpenedCounter::STATUS_OPEN_BY_CASHIER)
                ->first();

            if (!$openedCounter) {
                return redirect()->back()->with('error', 'Proses gagal! Maklumat Kaunter yang dibuka oleh juruwang tidak dijumpai!');
            }

            $openedCounter->status = OpenedCounter::STATUS_CLOSE_BY_CASHIER;
            $openedCounter->closed_at = Carbon::now();
            $openedCounter->save();

            # Close Counter Record for Admin
            $openedCounter = OpenedCounter::where('collection_center_id', $bankDepositSlip->collection_center_id)
                ->where('counter_id', $bankDepositSlip->counter_id)
                ->whereDate('opened_at', $date)
                ->where('status', OpenedCounter::STATUS_OPEN_BY_ADMIN)
                ->first();

            if (!$openedCounter) {
                return redirect()->back()->with('error', 'Proses gagal! Maklumat Kaunter yang dibuka oleh Penyelia tidak dijumpai!');
            }

            $openedCounter->status = OpenedCounter::STATUS_CLOSE_BY_ADMIN;
            $openedCounter->closed_at = Carbon::now();
            $openedCounter->save();

            activity('update')->performedOn($openedCounter)->causedBy(auth()->user())->log("Kaunter berjaya ditutup");

            # Open Back Counter for case to allow half day
            $openedCounter = OpenedCounter::where('collection_center_id', $bankDepositSlip->collection_center_id)
                ->where('counter_id', $bankDepositSlip->counter_id)
                ->whereDate('opened_at', $date)
                ->where('status', OpenedCounter::STATUS_CLOSE_BY_ADMIN)
                ->first();

            if (!$openedCounter) {
                return redirect()->back()->with('error', 'Proses gagal! Maklumat Kaunter yang ditutup oleh Penyelia tidak dijumpai!');
            }

            $openedCounter->status = OpenedCounter::STATUS_OPEN_BY_ADMIN;
            $openedCounter->closed_at = null;
            $openedCounter->save();

        } catch (\Exception $e) {
            DB::rollBack();
            dd($e);
            return redirect()->back()->with('error', 'Proses gagal!');
        }
    }

    public function printDefaultReport($type)
    {
        switch ($type) {
            case 'senarai_resit_batal':
                $filters = session('laporan_resit_batal_filters', []);

                request()->merge($filters);
          
                $report = QueryBuilder::for(Receipt::class)
                    ->allowedFilters([
                        AllowedFilter::callback('collection_center_id', fn($q, $v) => $q->where('collection_center_id', $v)),
                        AllowedFilter::callback('counter_id', fn($q, $v) => $q->where('counter_id', $v)),
                        AllowedFilter::callback('user_id', fn($q, $v) => $q->where('user_id', $v)),
                    ])
                    ->when(request('start_date'), fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', request('start_date'))->format('Y-m-d')))
                    ->when(request('end_date'), fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', request('end_date'))->format('Y-m-d')))
                    ->with('latestChange.causer', 'firstChange.causer', 'cancelled')
                    ->where('status', Receipt::STATUS_CANCELLED)
                    
                    ->limit(50)
                    ->get();

                $pdf = Pdf::loadView('pdf.report.cancelled-receipt', compact('report'));
                break;

            case 'inquiry':
                $filters = session('inquiry_fitler', []);

                request()->merge($filters);
                
                $report = QueryBuilder::for(Receipt::class)
                    ->allowedFilters([
                        AllowedFilter::callback('collection_center_id', fn($q, $v) => $q->where('collection_center_id', $v)),
                        AllowedFilter::callback('counter_id', fn($q, $v) => $q->where('counter_id', $v)),
                        AllowedFilter::callback('income_code', fn($q, $v) => $q->where('service', $v)),
                        AllowedFilter::callback('payment_type', fn($q, $v) => $q->where('payment_type', $v)),
                    ])
                    ->when(request('start_date'), fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', request('start_date'))->format('Y-m-d')))
                    ->when(request('end_date'), fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', request('end_date'))->format('Y-m-d')))
                    ->with('latestChange.causer', 'firstChange.causer')
                    
                    ->orderBy('date', 'desc')
                    ->limit(50)
                    ->get();

                $pdf = Pdf::loadView('pdf.report.inquiry', compact('report'));
                break;

            case 'report-float-cash':
                $filters = session('float_cash_fitler', []);

                request()->merge($filters);

                $report = QueryBuilder::for(FloatCashRequest::class)
                        ->allowedFilters([
                        AllowedFilter::callback('collection_center_id', function ($query, $value) {
                            if (!empty($value)) {
                                $query->where('collection_center_id', $value);
                            }
                        }),
                        AllowedFilter::callback('counter_id', function ($query, $value) {
                            if (!empty($value)) {
                                $query->where('counter_id', $value);
                            }
                        }),
                        AllowedFilter::callback('floating_type', function ($query, $value) {
                            if (!empty($value)) {
                                $query->where('type', $value);
                            }
                        }),
                    ])
                    ->when(request()->query('start_date'), function ($query) {
                        $date = Carbon::createFromFormat('d-m-Y', request()->query('start_date'))->format('Y-m-d');
                        $query->whereDate('date_applied', '>=', $date);
                    })
                    ->when(request()->query('end_date'), function ($query) {
                        $date = Carbon::createFromFormat('d-m-Y', request()->query('end_date'))->format('Y-m-d');
                        $query->whereDate('date_applied', '<=', $date);
                    })
                    ->where('status', FloatCashRequest::STATUS_APPROVED)
                    ->with('latestChange.causer', 'firstChange.causer')
                    
                    ->orderBy('date_applied', 'desc')
                    ->limit(50)
                    ->get();

                $pdf = Pdf::loadView('pdf.report.float-cash', compact('report'));
                break;

            case 'laporan_tamat_hari':
                $filters = request()->input('filterValues');

                $requiredFields = [
                    'filter[user_id', 
                    'filter[collection_center_id', 
                    'filter[counter_id', 
                    'start_date'
                ];

                foreach ($requiredFields as $field) {
                    if (empty($filters[$field])) {
                        return redirect()->back()->with('error', 'Sila masukkan semua data yang diperlukan.');
                    }
                }

                $collectionCenterId = $filters['filter[collection_center_id'];
                $counterId = $filters['filter[counter_id'];
                $userId = $filters['filter[user_id'];
                $startDate = Carbon::parse($filters['start_date']);
                $endDate = isset($filters['end_date']) ? Carbon::parse($filters['end_date']) : null;

                // Eager-load these
                $collectionCenter = CollectionCenter::findOrFail($collectionCenterId);
                $counter = Counter::findOrFail($counterId);
                $cashier = User::findOrFail($userId);

                // Common scope
                $receiptBaseQuery = fn($q) => $q->where('collection_center_id', $collectionCenterId)
                    ->where('counter_id', $counterId)
                    ->where('user_id', $userId)
                    ->whereDate('date', $startDate);

                // Payment Type Summary
                $report = PaymentType::with(['receipts' => $receiptBaseQuery])
                    ->get()
                    ->map(function ($type) {
                        $receipts = $type->receipts;
                        return [
                            'jenis_bayaran' => $type->description,
                            'code' => $type->code,
                            'count' => $receipts->count(),
                            'amount' => $receipts->sum('total_amount'), // keep raw number
                        ];
                    });

                // Income Code Summary
                $incomeCodes = IncomeCode::with(['receipts' => $receiptBaseQuery])
                    ->get()
                    ->map(function ($code) {
                        $receipts = $code->receipts;
                        return [
                            'code' => "{$code->code} - {$code->description}",
                            'description' => $code->description,
                            'count' => $receipts->count(),
                            'amount' => $receipts->sum('total_amount'),
                        ];
                    })->filter(fn($item) => $item['count'] > 0);

                // Receipts
                $lastReceipt = Receipt::where('collection_center_id', $collectionCenterId)
                    ->where('counter_id', $counterId)
                    ->where('user_id', $userId)
                    ->whereDate('date', $startDate)
                    ->latest('date')
                    ->first();

                $cancelledReceipt = Receipt::where('collection_center_id', $collectionCenterId)
                    ->where('counter_id', $counterId)
                    ->where('user_id', $userId)
                    ->whereDate('date', $startDate)
                    ->where('status', Receipt::STATUS_CANCELLED)
                    ->count();

                // Final totals
                $totalAmount = $report->sum('amount');
                $totalTransactions = $incomeCodes->sum('count');
                $totalTransactionAmount = $incomeCodes->sum('amount');

                $pdf = Pdf::loadView('pdf.report.report-tamat-hari', [
                    'location' => $collectionCenter->name,
                    'station' => $collectionCenter->code,
                    'machine' => $counter->name,
                    'date' => $startDate->format('d/m/Y'),
                    'operatorCode' => $cashier->staff_id,
                    'operatorName' => $cashier->name,
                    'paymentMethods' => $report->map(fn($r) => [
                        ...$r,
                        'amount' => number_format($r['amount'], 2, '.', ',')
                    ]),
                    'totalAmount' => number_format($totalAmount, 2, '.', ','),
                    'lastReceipt' => $lastReceipt->receipt_number ?? null,
                    'cancelledReceipts' => $cancelledReceipt,
                    'transactions' => $incomeCodes->map(fn($c) => [
                        ...$c,
                        'amount' => number_format($c['amount'], 2, '.', ',')
                    ]),
                    'totalTransactions' => $totalTransactions,
                    'totalTransactionAmount' => number_format($totalTransactionAmount, 2, '.', ','),
                ]);

                break;
            case 'laporan_audit_roi':
                $filters = request()->input('filterValues');

                if (
                    empty($filters['filter[collection_center_id']) ||
                    empty($filters['filter[counter_id']) ||
                    empty($filters['filter[user_id']) ||
                    empty($filters['start_date']) ||
                    empty($filters['end_date'])
                ) {
                    return redirect()->back()->with('error', 'Sila masukkan semua data yang diperlukan.');
                }
               

                $operator = User::find($filters['filter[user_id']);
                $operator_id = $operator->id;
                $operator_name =  $operator->name;
                $date = Carbon::parse($filters['start_date'])->format('d-m-Y');
                $station = CollectionCenter::find($filters['filter[collection_center_id'])->code;
                $machine = Counter::find($filters['filter[counter_id'])->name;

                $startDate = Carbon::parse($filters['start_date'])->startOfDay() ?? null;
                
                $endDate = Carbon::parse($filters['end_date'])->startOfDay() ?? null;

                $entries = QueryBuilder::for(Receipt::class)
                    ->where('collection_center_id', $filters['filter[collection_center_id'])
                    ->where('counter_id', $filters['filter[counter_id'])
                    ->whereDate('date', '>=', $startDate)
                    ->whereDate('date', '<=', $endDate)
                    ->where('user_id', $filters['filter[user_id'])
                    
                    ->orderBy('date', 'desc')
                    ->limit(50)
                    ->get();

                $page = '1';

                $pdf = Pdf::loadView('pdf.report.audit-rol', compact('entries', 'operator_id', 'operator_name', 'date', 'station', 'machine', 'page'));

                break;

            case 'laporan_audit_roi_mengikut_resit':
                $filters = request()->input('filterValues');
                if (
                    empty($filters['filter[collection_center_id']) ||
                    empty($filters['filter[counter_id']) ||
                    empty($filters['filter[user_id']) ||
                    empty($filters['start_date']) ||
                    empty($filters['end_date'])
                ) {
                    return redirect()->back()->with('error', 'Sila masukkan semua data yang diperlukan.');
                }

                $operator = User::find($filters['filter[user_id']);
                $operator_id = $operator->id;
                $operator_name =  $operator->name;
                $date = Carbon::parse($filters['start_date'])->format('d-m-Y');
                $station = CollectionCenter::find($filters['filter[collection_center_id'])->code;
                $machine = Counter::find($filters['filter[counter_id'])->name;

                $entries = QueryBuilder::for(Receipt::class)
                    ->where('collection_center_id', $filters['filter[collection_center_id'])
                    ->where('counter_id', $filters['filter[counter_id'])
                    // ->whereBetween('date', [$filters['start_date'], $filters['end_date']])
                    ->where('user_id', $filters['filter[user_id'])
                    ->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', $filters['start_date'])->format('Y-m-d'))
                    ->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', $filters['end_date'])->format('Y-m-d'))
                    ->orderBy('date', 'desc')
                    ->limit(50)
                    ->get();

                $page = '1';

                $pdf = Pdf::loadView('pdf.report.audit-rol-mengikut-resit', compact('entries', 'operator_id', 'operator_name', 'date', 'station', 'machine', 'page'));

                break;

            case 'laporan_edit_resit':

                $filters = session('laporan_edit_resit_filters', []);

                request()->merge($filters);

                $report = QueryBuilder::for(Receipt::class)
                    ->allowedFilters([
                        AllowedFilter::callback('collection_center_id', fn($q, $v) => $q->where('collection_center_id', $v)),
                        AllowedFilter::callback('counter_id', fn($q, $v) => $q->where('counter_id', $v)),
                        AllowedFilter::callback('user_id', fn($q, $v) => $q->where('user_id', $v)),
                    ])
                    ->when(request('start_date'), fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', request('start_date'))->format('Y-m-d')))
                    ->when(request('end_date'), fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', request('end_date'))->format('Y-m-d')))
                    ->with('latestChange.causer', 'firstChange.causer', 'cancelled')
                    ->where('status', Receipt::STATUS_EDITED)
                    
                    ->limit(50)
                    ->get();

                $pdf = Pdf::loadView('pdf.report.editted-receipt', compact('report'));
                break;

            case 'cs04':
                $filter = request()->input('filterValues');

                if (
                    empty($filter['filter[collection_center_id']) ||
                    empty($filter['filter[counter_id']) ||
                    // empty($filter['filter[payment_type']) ||
                    empty($filter['start_date']) ||
                    empty($filter['end_date'])
                ) {
                    return redirect()->back()->with('error', 'Sila masukkan semua data yang diperlukan.');
                }

                $collectionCenterId = $filter['filter[collection_center_id'] ?? null;

                $counterId = $filter['filter[counter_id'] ?? null;

                $paymentType = $filter['filter[payment_type'] ?? null;

                $startDate = Carbon::parse($filter['start_date'])->startOfDay() ?? null;

                $endDate = Carbon::parse($filter['end_date'])->startOfDay() ?? null;

                $entries = QueryBuilder::for(Receipt::class)
                    ->where('collection_center_id', $collectionCenterId)
                    ->where('counter_id', $counterId)
                    ->whereDate('date', '>=', $startDate)
                    ->whereDate('date', '<=', $endDate)
                    
                    ->when($paymentType, fn($q) => $q->where('payment_type', $paymentType))
                    ->with('latestChange.causer', 'firstChange.causer', 'paymentType')
                    ->whereIn('status', Receipt::ACCEPTABLE_STATUSES)
                    
                    ->orderBy('date', 'desc')
                    ->limit(50)
                    ->get();
                
                if(empty($paymentType)) {
                    $allPaymentTypes = PaymentType::all()->pluck('description')->toArray();
                }else {
                    $allPaymentTypes = PaymentType::where('name', $paymentType)->first()->description;
                }

                $pdf = Pdf::loadView('pdf.report.cs04', [
                    'entries'           => $entries,
                    'collection_center' => CollectionCenter::find($collectionCenterId)->first()->code,
                    'counter'           => Counter::find($counterId)->first()->name,
                    'payment_type'      => $allPaymentTypes,
                    'start_date'         => Carbon::parse($startDate)->format('d-m-Y'),
                    'end_date'           => Carbon::parse($endDate)->format('d-m-Y'),
                ]);

                break;

            case 'cs05':
                $filters = session('cs05_filters', []);

                request()->merge($filters);

                $filters = request()->input('filter');

                $filter = request()->input('filterValues');

                if (
                    empty($filter['filter[collection_center_id']) ||
                    empty($filter['filter[counter_id']) ||
                    empty($filter['filter[payment_type']) ||
                    empty($filter['start_date']) ||
                    empty($filter['end_date'])
                ) {
                    return redirect()->back()->with('error', 'Sila masukkan semua data yang diperlukan.');
                }

                $collectionCenterId = $filter['filter[collection_center_id'] ?? null;

                $counterId = $filter['filter[counter_id'] ?? null;

                $paymentType = $filter['payment_type'] ?? null;

                $startDate = $filter['start_date'] ?? null;

                $endDate = $filter['end_date']?? null;

                $entries = PaymentType::query()
                    ->select([
                        'payment_types.id',
                        'payment_types.description',
                        'payment_types.name',
                        DB::raw('COUNT(receipts.id) as count'),
                        DB::raw('SUM(receipts.total_amount) as amount'),
                    ])
                    ->leftJoin('receipts', 'receipts.payment_type', '=', 'payment_types.name')
                    ->when($collectionCenterId, fn($q) => $q->where('receipts.collection_center_id', $collectionCenterId))
                    ->when($counterId, fn($q) => $q->where('receipts.counter_id', $counterId))
                    ->when($paymentType, fn($q) => $q->where('receipts.payment_type', 'CSH'))
                    ->when(request('start_date'), fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', request('start_date'))->format('Y-m-d')))
                    ->when(request('end_date'), fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', request('end_date'))->format('Y-m-d')))
                    ->groupBy('payment_types.id', 'payment_types.description', 'payment_types.name')
                    ->orderBy('payment_types.id', 'asc')
                    ->get()
                    ->map(function ($row) {
                        return [
                            'jenis_bayaran' => $row->description,
                            'name'          => $row->name,
                            'count'         => (int) $row->count,
                            'amount'        => number_format($row->total_amount ?: 0, 2, '.', ','),
                        ];
                    });
          
                $paymentTypeString = '';

                if (!empty($filters['payment_type']) && is_array($filters['payment_type'])) {
                    $paymentTypes = PaymentType::whereIn('name', $filters['payment_type'])->pluck('description')->toArray();
                    $paymentTypeString = implode(',', $paymentTypes);
                }
           
                $pdf = Pdf::loadView('pdf.report.cs05', [
                    'entries'           => $entries,
                    'collection_center' => CollectionCenter::find($collectionCenterId)->first()->code,
                    'counter'           => Counter::find($counterId)->first()->name,
                    'paymentTypeString'   => $paymentTypeString,
                    'start_date'         => $startDate,
                    'end_date'           => $endDate,
                ]);

                break;

            case 'cs06':
                $filters = session('cs06_filters', []);

                request()->merge($filters);

                $filters = request()->input('filter');

                $filter = request()->input('filterValues');
                
                if (
                    empty($filter['filter[collection_center_id']) ||
                    empty($filter['filter[counter_id']) ||
                    empty($filter['receipt_date']) 
                ) {
                    return redirect()->back()->with('error', 'Sila masukkan semua data yang diperlukan.');
                }
              
                $collectionCenterId = $filter['filter[collection_center_id'] ?? null;

                $counterId = $filter['filter[counter_id'] ?? null;

                # Parse receipt_date (from d-m-Y to Y-m-d)
                $rawDate = request()->input('receipt_date');
                $receiptDate = $rawDate
                    ? Carbon::createFromFormat('d-m-Y', $rawDate)
                    : Carbon::today();

                // Relative boundaries
                $selectedDay = $receiptDate->copy()->startOfDay()->toDateString();
                $selectedMonthMin = $receiptDate->copy()->startOfMonth()->toDateString();
                $selectedMonthMax = $receiptDate->copy()->endOfMonth()->toDateString();
                $selectedYearMin = $receiptDate->copy()->startOfYear()->toDateString();
                $selectedYearMax = $receiptDate->copy()->endOfYear()->toDateString();

                $query = DB::table('income_codes')
                    ->leftJoin('receipts', 'receipts.service', '=', 'income_codes.name')
                    ->select(
                        'income_codes.id',
                        'income_codes.name as service',
                        'income_codes.code',

                        DB::raw("SUM(CASE WHEN DATE(receipts.date) = '{$selectedDay}' THEN 1 ELSE 0 END) as day_count"),
                        DB::raw("SUM(CASE WHEN DATE(receipts.date) = '{$selectedDay}' THEN receipts.total_amount ELSE 0 END) as day_amount"),

                        DB::raw("SUM(CASE WHEN DATE(receipts.date) BETWEEN '{$selectedMonthMin}' AND '{$selectedMonthMax}' THEN 1 ELSE 0 END) as month_count"),
                        DB::raw("SUM(CASE WHEN DATE(receipts.date) BETWEEN '{$selectedMonthMin}' AND '{$selectedMonthMax}' THEN receipts.total_amount ELSE 0 END) as month_amount"),

                        DB::raw("SUM(CASE WHEN DATE(receipts.date) BETWEEN '{$selectedYearMin}' AND '{$selectedYearMax}' THEN 1 ELSE 0 END) as year_count"),
                        DB::raw("SUM(CASE WHEN DATE(receipts.date) BETWEEN '{$selectedYearMin}' AND '{$selectedYearMax}' THEN receipts.total_amount ELSE 0 END) as year_amount")
                    )
                    ->when($collectionCenterId, fn($q) => $q->where('receipts.collection_center_id', $collectionCenterId))
                    ->when($counterId, fn($q) => $q->where('receipts.counter_id', $counterId))
                    ->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', $filter['receipt_date'])->format('Y-m-d'))
                    ->groupBy('income_codes.id', 'income_codes.name', 'income_codes.code')
                    ->havingRaw('
                        SUM(CASE WHEN DATE(receipts.date) = ? THEN 1 ELSE 0 END) > 0
                        OR SUM(CASE WHEN DATE(receipts.date) BETWEEN ? AND ? THEN 1 ELSE 0 END) > 0
                        OR SUM(CASE WHEN DATE(receipts.date) BETWEEN ? AND ? THEN 1 ELSE 0 END) > 0
                    ', [$selectedDay, $selectedMonthMin, $selectedMonthMax, $selectedYearMin, $selectedYearMax])
                    ->orderBy('income_codes.id', 'asc');

                $entries = DB::table(DB::raw("({$query->toSql()}) as sub"))
                    ->mergeBindings($query)
                    ->get()
                    ->map(function ($row) {
                        return [
                            'service'       => $row->service,
                            'code'          => $row->code,

                            'count'         => (int) $row->day_count,
                            'amount'        => (float) $row->day_amount,

                            'month_count'   => (int) $row->month_count,
                            'month_amount'  => (float) $row->month_amount,

                            'year_count'    => (int) $row->year_count,
                            'year_amount'   => (float) $row->year_amount,
                        ];
                    });

                $pdf = Pdf::loadView('pdf.report.cs06', [
                    'entries'           => $entries,
                    'collection_center' => CollectionCenter::find($collectionCenterId)->first()->name,
                    'counter'           => Counter::find($counterId)->first()->name,
                    'start_date'         => $receiptDate,
                ]);
                
                break;

            case 'cs07':
                $filters = session('cs07_filters', []);

                request()->merge($filters);

                $filters = request()->input('filter');

                $filter = request()->input('filterValues');
                
                if (
                    empty($filter['filter[collection_center_id']) ||
                    empty($filter['filter[counter_id']) ||
                    empty($filter['receipt_date']) 
                ) {
                    return redirect()->back()->with('error', 'Sila masukkan semua data yang diperlukan.');
                }
              
                $collectionCenterId = $filter['filter[collection_center_id'] ?? null;

                $counterId = $filter['filter[counter_id'] ?? null;

                # Parse receipt_date (from d-m-Y to Y-m-d)
                $rawDate = request()->input('receipt_date');
                $receiptDate = $rawDate
                    ? Carbon::createFromFormat('d-m-Y', $rawDate)
                    : Carbon::today();

                // Relative boundaries
                $selectedDay = $receiptDate->copy()->startOfDay()->toDateString();
                $selectedMonthMin = $receiptDate->copy()->startOfMonth()->toDateString();
                $selectedMonthMax = $receiptDate->copy()->endOfMonth()->toDateString();
                $selectedYearMin = $receiptDate->copy()->startOfYear()->toDateString();
                $selectedYearMax = $receiptDate->copy()->endOfYear()->toDateString();

                $query = DB::table('income_codes')
                    ->leftJoin('receipts', 'receipts.service', '=', 'income_codes.name')
                    ->select(
                        'income_codes.id',
                        'income_codes.name as service',
                        'income_codes.code',

                        DB::raw("SUM(CASE WHEN DATE(receipts.date) = '{$selectedDay}' THEN 1 ELSE 0 END) as day_count"),
                        DB::raw("SUM(CASE WHEN DATE(receipts.date) = '{$selectedDay}' THEN receipts.total_amount ELSE 0 END) as day_amount"),

                        DB::raw("SUM(CASE WHEN DATE(receipts.date) BETWEEN '{$selectedMonthMin}' AND '{$selectedMonthMax}' THEN 1 ELSE 0 END) as month_count"),
                        DB::raw("SUM(CASE WHEN DATE(receipts.date) BETWEEN '{$selectedMonthMin}' AND '{$selectedMonthMax}' THEN receipts.total_amount ELSE 0 END) as month_amount"),

                        DB::raw("SUM(CASE WHEN DATE(receipts.date) BETWEEN '{$selectedYearMin}' AND '{$selectedYearMax}' THEN 1 ELSE 0 END) as year_count"),
                        DB::raw("SUM(CASE WHEN DATE(receipts.date) BETWEEN '{$selectedYearMin}' AND '{$selectedYearMax}' THEN receipts.total_amount ELSE 0 END) as year_amount")
                    )
                    ->when($collectionCenterId, fn($q) => $q->where('receipts.collection_center_id', $collectionCenterId))
                    ->when($counterId, fn($q) => $q->where('receipts.counter_id', $counterId))
                    ->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', $filter['receipt_date'])->format('Y-m-d'))
                    ->groupBy('income_codes.id', 'income_codes.name', 'income_codes.code')
                    ->havingRaw('
                        SUM(CASE WHEN DATE(receipts.date) = ? THEN 1 ELSE 0 END) > 0
                        OR SUM(CASE WHEN DATE(receipts.date) BETWEEN ? AND ? THEN 1 ELSE 0 END) > 0
                        OR SUM(CASE WHEN DATE(receipts.date) BETWEEN ? AND ? THEN 1 ELSE 0 END) > 0
                    ', [$selectedDay, $selectedMonthMin, $selectedMonthMax, $selectedYearMin, $selectedYearMax])
                    ->orderBy('income_codes.id', 'asc');

                $entries = DB::table(DB::raw("({$query->toSql()}) as sub"))
                    ->mergeBindings($query)
                    ->get()
                    ->map(function ($row) {
                        return [
                            'service'       => $row->service,
                            'code'          => $row->code,

                            'count'         => (int) $row->day_count,
                            'amount'        => (float) $row->day_amount,

                            'month_count'   => (int) $row->month_count,
                            'month_amount'  => (float) $row->month_amount,

                            'year_count'    => (int) $row->year_count,
                            'year_amount'   => (float) $row->year_amount,
                        ];
                    });

                $pdf = Pdf::loadView('pdf.report.cs07', [
                    'entries'           => $entries,
                    'collection_center' => CollectionCenter::find($collectionCenterId)->first()->name,
                    'counter'           => Counter::find($counterId)->first()->name,
                    'start_date'         => $receiptDate,
                ]);
                
                break;

            case 'cs08':
                $filters = session('cs08_filters', []);

                request()->merge($filters);
           
                $filter = request()->input('filterValues');

                if (
                    empty($filter['filter[collection_center_id']) ||
                    empty($filter['filter[counter_id']) ||
                    empty($filter['filter[income_code_id']) ||
                    empty($filter['start_date']) ||
                    empty($filter['end_date'])
                ) {
                    return redirect()->back()->with('error', 'Sila masukkan semua data yang diperlukan.');
                }

                $collectionCenterId = $filter['filter[collection_center_id'] ?? null;

                $counterId = $filter['filter[counter_id'] ?? null;

                $startDate = Carbon::parse($filter['start_date'])->startOfDay() ?? null;

                $endDate = Carbon::parse($filter['end_date'])->startOfDay() ?? null;

                $entries = QueryBuilder::for(Receipt::class)
                    ->allowedFilters([
                        AllowedFilter::callback('collection_center_id', fn($q, $v) => $q->where('collection_center_id', $v)),
                        AllowedFilter::callback('counter_id', fn($q, $v) => $q->where('counter_id', $v)),
                        AllowedFilter::callback('income_code_id', function ($query, $value) {
                            if (!empty($value)) {
                                $query->whereHas('incomeCode', function ($q) use ($value) {
                                    $q->whereIn('id', $value);
                                });
                            }
                        }),
                    ])
                    ->when(request('start_date'), fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', request('start_date'))->format('Y-m-d')))
                    ->when(request('end_date'), fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', request('end_date'))->format('Y-m-d')))
                    ->with('latestChange.causer', 'firstChange.causer', 'paymentType', 'details', 'incomeCode')
                    ->orderBy('date', 'desc')
                    ->limit(50)
                    ->get();

                $filters = request()->input('filter');

                $incomeCodeString = '';

                if (!empty($filters['income_code_id']) && is_array($filters['income_code_id'])) {
                    $incomeCodes = IncomeCode::whereIn('id', $filters['income_code_id'])->pluck('code')->toArray();
                    $incomeCodeString = implode(',', $incomeCodes);
                }
               
                $pdf = Pdf::loadView('pdf.report.cs08', [
                    'entries'           => $entries,
                    'collection_center' => CollectionCenter::find($collectionCenterId)->first()->code,
                    'counter'           => Counter::find($counterId)->first()->name,
                    'start_date'         => $startDate,
                    'end_date'           => $endDate,
                    'incomeCodeString'   => $incomeCodeString
                ]);

                break;

            case 'cs09':
                $filters = session('cs09_filters', []);

                request()->merge($filters);

                $filters = request()->input('filter');

                $filter = request()->input('filterValues');
    
                if (
                    empty($filter['filter[collection_center_id']) ||
                    empty($filter['filter[counter_id']) ||
                    empty($filter['filter[income_code_id']) ||
                    empty($filter['start_date']) ||
                    empty($filter['end_date'])
                ) {
                    return redirect()->back()->with('error', 'Sila masukkan semua data yang diperlukan.');
                }
              
                $collectionCenterId = $filter['filter[collection_center_id'] ?? null;

                $counterId = $filter['filter[counter_id'] ?? null;

                $incomeCodeId = $filters['income_code_id'] ?? null;

                $startDate = Carbon::parse($filter['start_date'])->startOfDay() ?? null;

                $endDate = Carbon::parse($filter['end_date'])->startOfDay() ?? null;

                $entries = IncomeCode::query()
                    ->select([
                        'income_codes.id',
                        'income_codes.name as jenis_bayaran',
                        'income_codes.code',
                        DB::raw('COUNT(receipts.id) as count'),
                        DB::raw('SUM(receipts.total_amount) as amount'),
                    ])
                    ->leftJoin('receipts', 'receipts.service', '=', 'income_codes.name')
                    ->when($incomeCodeId, fn($q) => $q->whereIn('income_codes.id', $incomeCodeId))
                    ->when($collectionCenterId, fn($q) => $q->where('receipts.collection_center_id', $collectionCenterId))
                    ->when($counterId, fn($q) => $q->where('receipts.counter_id', $counterId))
                    ->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', $filter['start_date'])->format('Y-m-d'))
                    ->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', $filter['end_date'])->format('Y-m-d'))
                    ->groupBy('income_codes.id', 'income_codes.name', 'income_codes.code')
                    ->orderBy('income_codes.id', 'asc')
                    ->get()
                    ->map(function ($row) {
                        return [
                            'jenis_bayaran' => $row->jenis_bayaran,
                            'code'          => $row->code,
                            'count'         => (int) $row->count,
                            'amount'        => number_format($row->amount ?: 0, 2, '.', ','),
                        ];
                    });

                $incomeCodeString = '';

                if (!empty($filters['income_code_id']) && is_array($filters['income_code_id'])) {
                    $incomeCodes = IncomeCode::whereIn('id', $filters['income_code_id'])->pluck('code')->toArray();
                    $incomeCodeString = implode(',', $incomeCodes);
                }

                $pdf = Pdf::loadView('pdf.report.cs09', [
                    'entries'           => $entries,
                    'collection_center' => CollectionCenter::find($collectionCenterId)->first()->name,
                    'counter'           => Counter::find($counterId)->first()->name,
                    'incomeCodeString'   => $incomeCodeString,
                    'start_date'         => $startDate,
                    'end_date'           => $endDate,
                ]);

                break;  

            case 'cs10':

                $filter = request()->input('filterValues');
  
                if (
                    empty($filter['filter[collection_center_id']) ||
                    empty($filter['filter[counter_id']) ||
                    empty($filter['filter[user_id']) ||
                    empty($filter['start_date']) ||
                    empty($filter['end_date'])
                ) {
                    return redirect()->back()->with('error', 'Sila masukkan semua data yang diperlukan.');
                }
              
                $collectionCenterId = $filter['filter[collection_center_id'] ?? null;

                $counterId = $filter['filter[counter_id'] ?? null;

                $userId = $filter['filter[user_id'] ?? null;

                $startDate = Carbon::parse($filter['start_date'])->startOfDay() ?? null;

                $endDate = Carbon::parse($filter['end_date'])->startOfDay() ?? null;

                $entries = Receipt::where('collection_center_id', $collectionCenterId)
                    ->where('counter_id', $counterId)
                    ->where('user_id', $userId)
                    ->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', $filter['start_date'])->format('Y-m-d'))
                    ->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', $filter['end_date'])->format('Y-m-d'))
                    // ->whereBetween('date', [$startDate, $endDate])
                    ->with('latestChange.causer', 'firstChange.causer', 'paymentType', 'details')
                    
                    ->limit(50)
                    ->get();
                
                $pdf = Pdf::loadView(
                    'pdf.report.cs10',
                    compact(
                        'entries',
                        'collectionCenterId',
                        'counterId',
                        'startDate',
                        'endDate'
                    )
                );

                break;

            case 'cs11':
                $filter = request()->input('filterValues');
                
                if (
                    empty($filter['filter[collection_center_id']) ||
                    empty($filter['filter[counter_id']) ||
                    empty($filter['filter[user_id']) ||
                    empty($filter['start_date']) ||
                    empty($filter['end_date'])
                ) {
                    return redirect()->back()->with('error', 'Sila masukkan semua data yang diperlukan.');
                }
              
                $collectionCenterId = $filter['filter[collection_center_id'] ?? null;

                $counterId = $filter['filter[counter_id'] ?? null;

                $userId = $filter['filter[user_id'] ?? null;

                $startDate = Carbon::parse($filter['start_date'])->startOfDay() ?? null;
             
                $endDate = Carbon::parse($filter['end_date'])->startOfDay() ?? null;

                $entries = Receipt::where('collection_center_id', $collectionCenterId)
                    ->where('counter_id', $counterId)
                    ->where('user_id', $userId)
                    ->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', $filter['start_date'])->format('Y-m-d'))
                    ->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', $filter['end_date'])->format('Y-m-d'))
                    // ->whereBetween('date', [$startDate, $endDate])
                    ->orderBy('date', 'desc')
                    ->limit(50)
                    ->get();
              
                $pdf = Pdf::loadView(
                    'pdf.report.cs11',
                    compact(
                        'entries',
                        'collectionCenterId',
                        'counterId',
                        'startDate',
                        'endDate'
                    )
                );

                break;

            case 'cs12':
                $filter = request()->input('filterValues');

                if (
                    empty($filter['filter[collection_center_id']) ||
                    empty($filter['filter[counter_id']) 
                    // empty($filter['filter[user_id']) ||
                    // empty($filter['start_date']) ||
                    // empty($filter['end_date'])
                ) {
                    return redirect()->back()->with('error', 'Sila masukkan semua data yang diperlukan.');
                }

                $collectionCenterId = $filter['filter[collection_center_id'] ?? null;

                $counterId = $filter['filter[counter_id'] ?? null;

                $userId = $filter['filter[user_id'] ?? null;

                // $startDate = Carbon::parse($filter['start_date'])->startOfDay() ?? null;

                // $endDate = Carbon::parse($filter['end_date'])->startOfDay() ?? null;

                $entries = QueryBuilder::for(PaymentType::class)
                    ->limit(50)->get()
                    ->map(function ($type) use ($collectionCenterId, $counterId, $userId) {

                        $receiptQuery = $type->receipts()
                            
                            ->when($collectionCenterId, fn($q) => $q->where('collection_center_id', $collectionCenterId))
                            ->when($counterId, fn($q) => $q->where('counter_id', $counterId))
                            ->when($userId, fn($q) => $q->where('user_id', $userId));

                        return [
                            'jenis_bayaran' => $type->description,
                            'code' => $type->code,
                            'count' => $receiptQuery->count(),
                            'amount' => number_format($receiptQuery->sum('total_amount') ?: 0, 2, '.', ',') ?: 0,
                        ];
                    });
          
                $pdf = Pdf::loadView('pdf.report.cs12', [
                    'entries'           => $entries,
                    'collection_center' => CollectionCenter::find($collectionCenterId)->first()->code,
                    'counter'           => Counter::find($counterId)->first()->name,
                    'start_date'         => !empty($filter['start_date']) ? Carbon::parse($filter['start_date']) : null,
                    'end_date'           => !empty($filter['end_date']) ? Carbon::parse($filter['end_date']) : null,
                ]);

                break;  

            case 'cs13':
                $filter = request()->input('filterValues');
    
                if (
                    empty($filter['filter[collection_center_id']) ||
                    empty($filter['filter[counter_id']) ||
                    empty($filter['filter[income_code']) ||
                    empty($filter['start_date']) ||
                    empty($filter['end_date'])
                ) {
                    return redirect()->back()->with('error', 'Sila masukkan semua data yang diperlukan.');
                }

                $collectionCenterId = $filter['filter[collection_center_id'] ?? null;

                $counterId = $filter['filter[counter_id'] ?? null;

                $incomeCode = $filter['filter[income_code'] ?? null;
         
                $startDate = Carbon::parse($filter['start_date'])->startOfDay() ?? null;

                $endDate = Carbon::parse($filter['end_date'])->startOfDay() ?? null;

                $entries = Receipt::where('collection_center_id', $collectionCenterId)
                    ->where('counter_id', $counterId)
                    ->whereBetween('date', [$startDate, $endDate])
                    ->where('service', $incomeCode)
                    
                    ->orderBy('date', 'desc')
                    ->limit(50)
                    ->get();

                $pdf = Pdf::loadView('pdf.report.cs13', [
                    'entries'           => $entries,
                    'collection_center' => CollectionCenter::find($collectionCenterId)->first()->name,
                    'counter'           => Counter::find($counterId)->first()->name,
                    'income_code'        => IncomeCode::where('name', $incomeCode)->first()->name,
                    'start_date'         => $startDate,
                    'end_date'           => $endDate,
                ]);

                break;

            case 'cs16':
                $filter = request()->input('filterValues');

                if (
                    empty($filter['filter[collection_center_id']) ||
                    empty($filter['filter[counter_id']) ||
                    empty($filter['filter[user_id']) ||
                    empty($filter['start_date']) ||
                    empty($filter['end_date'])
                ) {
                    return redirect()->back()->with('error', 'Sila masukkan semua data yang diperlukan.');
                }

                $collectionCenterId = $filter['filter[collection_center_id'] ?? null;

                $counterId = $filter['filter[counter_id'] ?? null;

                $userId = $filter['filter[user_id'] ?? null;

                $startDate = Carbon::parse($filter['start_date'])->startOfDay() ?? null;

                $endDate = Carbon::parse($filter['end_date'])->startOfDay() ?? null;

                $entries = Receipt::where('collection_center_id', $collectionCenterId)
                    ->where('counter_id', $counterId)
                    ->where('user_id', $userId)
                    ->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', $filter['start_date'])->format('Y-m-d'))
                    ->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', $filter['end_date'])->format('Y-m-d'))
                    // ->whereBetween('date', [$startDate, $endDate])
                    ->orderBy('date', 'desc')
                    ->limit(50)
                    ->get();
              
                $pdf = Pdf::loadView('pdf.report.cs16', [
                    'entries'           => $entries,
                    'collection_center' => CollectionCenter::find($collectionCenterId)->first()->name,
                    'counter'           => Counter::find($counterId)->first()->name,
                    'start_date'         => $startDate,
                    'end_date'           => $endDate,
                ]);

                break;
            case 'cs17':
                $filters = session('cs17_filters', []);

                request()->merge($filters);

                $report = $this->getCS17Query()->limit(50)->get();
           
                $pdf = Pdf::loadView('pdf.report.cs17-list', compact('report'));
                break;
            default:
                return redirect()->back()->with('error', 'Jenis laporan tidak dikenali.');
        }

        return $pdf->stream();
    }

    public function printBankDepositSlip($type)
    {
        $items = [];

        $filters = request()->input('filter', []);

        $startDate = request()->input('start_date');
        $endDate = request()->input('end_date');

        if ($type == 'slip_deposit_bank_tunai') {
            $type = 'Tunai';
            $items = BankDepositSlip::whereIn('payment_type', ['Tunai', 'CSH'])
                ->when(!empty($filters['user_id']), fn($q) => $q->where('user_id', $filters['user_id']))
                ->when(!empty($filters['collection_center_id']), fn($q) => $q->where('collection_center_id', $filters['collection_center_id']))
                ->when(!empty($filters['counter_id']), fn($q) => $q->where('counter_id', $filters['counter_id']))
                ->when(
                    !empty($startDate),
                    fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', $startDate)->format('Y-m-d'))
                )
                ->when(
                    !empty($endDate), 
                    fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', $endDate)->format('Y-m-d'))
                )
                ->orderBy('date', 'desc')
                ->limit(50)
                ->get();
        } elseif ($type == 'slip_deposit_bank_deraf_bank') {
            $type = 'Deraf Bank';
            $items = BankDepositSlip::whereIn('payment_type', ['DF'])
                ->when(!empty($filters['user_id']), fn($q) => $q->where('user_id', $filters['user_id']))
                ->when(!empty($filters['collection_center_id']), fn($q) => $q->where('collection_center_id', $filters['collection_center_id']))
                ->when(!empty($filters['counter_id']), fn($q) => $q->where('counter_id', $filters['counter_id']))
                ->when(
                    !empty($startDate),
                    fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', $startDate)->format('Y-m-d'))
                )
                ->when(
                    !empty($endDate),
                    fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', $endDate)->format('Y-m-d'))
                )
                ->orderBy('date', 'desc')
                ->limit(50)->get();
        } elseif ($type == 'slip_deposit_bank_cek') {
            $type = 'Cek';
            $items = BankDepositSlip::whereIn('payment_type', ['LCQ'])
                ->when(!empty($filters['user_id']), fn($q) => $q->where('user_id', $filters['user_id']))
                ->when(!empty($filters['collection_center_id']), fn($q) => $q->where('collection_center_id', $filters['collection_center_id']))
                ->when(!empty($filters['counter_id']), fn($q) => $q->where('counter_id', $filters['counter_id']))
                ->when(
                    !empty($startDate),
                    fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', $startDate)->format('Y-m-d'))
                )
                ->when(
                    !empty($endDate),
                    fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', $endDate)->format('Y-m-d'))
                )
                ->orderBy('date', 'desc')
                ->limit(50)->get();
        } elseif ($type == 'slip_deposit_bank_cc') {
            $type = 'Kad Kredit';
            $items = BankDepositSlip::whereIn('payment_type', ['CC'])
                ->when(!empty($filters['user_id']), fn($q) => $q->where('user_id', $filters['user_id']))
                ->when(!empty($filters['collection_center_id']), fn($q) => $q->where('collection_center_id', $filters['collection_center_id']))
                ->when(!empty($filters['counter_id']), fn($q) => $q->where('counter_id', $filters['counter_id']))
                ->when(
                    !empty($startDate),
                    fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', $startDate)->format('Y-m-d'))
                )
                ->when(
                    !empty($endDate),
                    fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', $endDate)->format('Y-m-d'))
                )
                ->orderBy('date', 'desc')
                ->limit(50)->get();
        } elseif ($type == 'slip_deposit_bank_slip_bank') {
            $type = 'Slip Bank';
            $items = BankDepositSlip::whereIn('payment_type', ['SB'])
                ->when(!empty($filters['user_id']), fn($q) => $q->where('user_id', $filters['user_id']))
                ->when(!empty($filters['collection_center_id']), fn($q) => $q->where('collection_center_id', $filters['collection_center_id']))
                ->when(!empty($filters['counter_id']), fn($q) => $q->where('counter_id', $filters['counter_id']))
                ->when(
                    !empty($startDate),
                    fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', $startDate)->format('Y-m-d'))
                )
                ->when(
                    !empty($endDate),
                    fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', $endDate)->format('Y-m-d'))
                )
                ->orderBy('date', 'desc')
                ->limit(50)->get();
        } elseif ($type == 'slip_deposit_bank_qr') {
            $type = 'QR';
            $items = BankDepositSlip::whereIn('payment_type', ['QR'])
                ->when(!empty($filters['user_id']), fn($q) => $q->where('user_id', $filters['user_id']))
                ->when(!empty($filters['collection_center_id']), fn($q) => $q->where('collection_center_id', $filters['collection_center_id']))
                ->when(!empty($filters['counter_id']), fn($q) => $q->where('counter_id', $filters['counter_id']))
                ->when(
                    !empty($startDate),
                    fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', $startDate)->format('Y-m-d'))
                )
                ->when(
                    !empty($endDate),
                    fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', $endDate)->format('Y-m-d'))
                )
                ->orderBy('date', 'desc')
                ->limit(50)->get();
        } elseif ($type == 'slip_deposit_bank_eft') {
            $type = 'EFT';
            $items = BankDepositSlip::whereIn('payment_type', ['EFT'])
                ->when(!empty($filters['user_id']), fn($q) => $q->where('user_id', $filters['user_id']))
                ->when(!empty($filters['collection_center_id']), fn($q) => $q->where('collection_center_id', $filters['collection_center_id']))
                ->when(!empty($filters['counter_id']), fn($q) => $q->where('counter_id', $filters['counter_id']))
                ->when(
                    !empty($startDate),
                    fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', $startDate)->format('Y-m-d'))
                )
                ->when(
                    !empty($endDate),
                    fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', $endDate)->format('Y-m-d'))
                )
                ->orderBy('date', 'desc')
                ->limit(50)->get();
        } elseif ($type == 'slip_deposit_bank_wang_pos') {
            $type = 'Wang Pos';
            $items = BankDepositSlip::whereIn('payment_type', ['WP'])
                ->when(!empty($filters['user_id']), fn($q) => $q->where('user_id', $filters['user_id']))
                ->when(!empty($filters['collection_center_id']), fn($q) => $q->where('collection_center_id', $filters['collection_center_id']))
                ->when(!empty($filters['counter_id']), fn($q) => $q->where('counter_id', $filters['counter_id']))
                ->when(
                    !empty($startDate),
                    fn($q) => $q->whereDate('date', '>=', Carbon::createFromFormat('d-m-Y', $startDate)->format('Y-m-d'))
                )
                ->when(
                    !empty($endDate),
                    fn($q) => $q->whereDate('date', '<=', Carbon::createFromFormat('d-m-Y', $endDate)->format('Y-m-d'))
                )
                ->orderBy('date', 'desc')
                ->limit(50)->get();
        } 


        $pdf = Pdf::loadView('pdf.report.bank-deposit-slip', compact('items', 'type'));
     
        return $pdf->stream();
    }

    public function show(BankDepositSlip $bankDepositSlip)
    {
       
        $items = Receipt::where('counter_id', $bankDepositSlip->counter_id)
                    ->select('receipt_number', 'amount', 'counter_id')
                    ->whereDate('date', $bankDepositSlip->date)
                    ->where('payment_type', $bankDepositSlip->payment_type)
                    ->limit(50)
                    ->get();

        $payment_type = PaymentType::where('name', $bankDepositSlip->payment_type)->first()->description;

        $pdf = Pdf::loadView('pdf.report.show', compact('items', 'payment_type', 'bankDepositSlip'));

        return $pdf->stream();

        // return $pdf->download('slip deposit bank.pdf'); 
    }

}