<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use App\Models\BankDepositSlip;
use App\Models\CashReceiptBreakdown;
use App\Models\CollectionCenter;
use App\Models\Counter;
use App\Models\FloatCash;
use App\Models\FloatCashRequest;
use App\Models\IncomeCategory;
use App\Models\IncomeCode;
use App\Models\Receipt;
use App\Models\ReceiptCollection;
use App\Models\Role;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Inertia\Inertia;
use Carbon\Carbon;

class CashReceiptBreakdownController extends Controller
{
    public function form()
    {
        auth()->user()->hasPermission('read cash receipt breakdown') ?: abort(403);

        if (auth()->user()->role->name === Role::NAME_CASHIER && empty(auth()->user()->currentCashierOpenedCounter()->first()->counter_id)) {
            return to_route('counter-and-collection-center.index')->with('error', 'Sila Pilih Kaunter terdahulu!');
        }

        $total_float_cash = FloatCash::where('counter_id', auth()->user()->currentCashierOpenedCounter()->first()->counter_id)
            ->latest()->first();

        $request_total_cash = FloatCashRequest::where('counter_id', auth()->user()->currentCashierOpenedCounter()->first()->counter_id)
            ->latest()->first();

        $request_total_cash = $request_total_cash->total ?? 0;

        $total_float_cash = optional($total_float_cash)->getTotalAmount() + $request_total_cash;

        $total_ammount_receipt = Receipt::where('counter_id', auth()->user()->currentCashierOpenedCounter()->first()->counter_id)
            ->where('payment_type', 'CSH')
            ->whereIn('status', Receipt::ACCEPTABLE_STATUSES)
            ->whereDate('date', Carbon::today())
            ->byUser()
            ->sum('total_amount');

        if (empty($total_float_cash)) {
            return to_route('dashboard')->with('error', 'Proses gagal! Maklumat wang apungan tidak dijumpai! Sila kemaskini wang apungan')->withInput();
        }

        return Inertia::render('ReceiveProcess/CashReceiptBreakdown', [
            'currentRoute' => Route::currentRouteName(),
            'cashiers' => User::whereHas('role', function ($query) {
                $query->where('name', 'cashier');
            })->get(),
            'collection_centers' => CollectionCenter::with('counters')->get(),
            'counters' => Counter::all(),
            'banks' => Bank::all(),
            'receipt_collections' => ReceiptCollection::all(),
            'total_float_cash' => $total_float_cash,
            'total_ammount_receipt' => (float) $total_ammount_receipt,
        ]);
    }

    public function index(Request $request)
    {  
        $filters = $request->input('filter', []);
        
        $query = QueryBuilder::for(CashReceiptBreakdown::class)
            ->allowedFilters([
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->select('cash_receipt_breakdowns.*')
                        ->join('counters', 'cash_receipt_breakdowns.counter_id', '=', 'counters.id')
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
                AllowedFilter::callback('start_date', function ($query, $value) {
                    $date = Carbon::createFromFormat('d-m-Y', $value)->format('Y-m-d');
                    $query->whereDate('receipt_date', '>=', $date);
                }),
            ])
            ->with('latestChange.causer', 'firstChange.causer');

        if (
            !array_key_exists('collection_center_id', $filters) &&
            !array_key_exists('counter_id', $filters) &&
            !array_key_exists('start_date', $filters)
        ) {
            $query->byUser();
        }

        $cash_receipt_breakdown = $query
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $cash_receipt_breakdown->getCollection()->transform(function ($item) {
            $item->total_amount = $item->getTotalAmount();
            return $item;
        });

        return Inertia::render('ReceiveProcess/CashReceiptBreakdownList', [
            'currentRoute' => Route::currentRouteName(),
            'cash_receipt_breakdown' => $cash_receipt_breakdown,
            'users' => User::all(),
            'collection_centers' => CollectionCenter::with('counters')->get(),
            'counters' => Counter::all(),
            'receipt_collections' => ReceiptCollection::all(),
        ]);
    }

    public function store()
    {
        auth()->user()->hasPermission('create cash receipt breakdown') ?: abort(403);

        $validate = request()->validate([
            'collection_center_id' => 'required|exists:collection_centers,id',
            'counter_id' => 'required|exists:counters,id',
            'user_id' => 'required|exists:users,id',
            'receipt_collection_id' => 'required|exists:receipt_collections,id',
            'receipt_date' => 'required',

            'RM100' => 'nullable|numeric|min:0',
            'RM50' => 'nullable|numeric|min:0',
            'RM20' => 'nullable|numeric|min:0',
            'RM10' => 'nullable|numeric|min:0',
            'RM5' => 'nullable|numeric|min:0',
            'RM1' => 'nullable|numeric|min:0',

            'RM0.50' => 'nullable|numeric|min:0',
            'RM0.20' => 'nullable|numeric|min:0',
            'RM0.10' => 'nullable|numeric|min:0',
            'RM0.05' => 'nullable|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {

            $validate['receipt_date'] = Carbon::parse($validate['receipt_date'])->format('Y-m-d H:i:s');

            $previous_cash_receipt_breakdown = CashReceiptBreakdown::where('counter_id', $validate['counter_id'])->whereDate('receipt_date', $validate['receipt_date'])->first();

            if ($previous_cash_receipt_breakdown) {
                $cash_receipt_breakdown = $previous_cash_receipt_breakdown;
                $cash_receipt_breakdown->update(array_merge(
                    $validate,
                    [
                        'RM0_50' => request('RM0.5'),
                        'RM0_20' => request('RM0.2'),
                        'RM0_10' => request('RM0.1'),
                        'RM0_05' => request('RM0.05'),
                    ]
                ));
            } else {
                $cash_receipt_breakdown = CashReceiptBreakdown::create(array_merge(
                    $validate,
                    [
                        'RM0_50' => request('RM0.5'),
                        'RM0_20' => request('RM0.2'),
                        'RM0_10' => request('RM0.1'),
                        'RM0_05' => request('RM0.05'),
                    ]
                ));
            }

            $total_amount = $cash_receipt_breakdown->getTotalAmount();

            $date = Carbon::parse($cash_receipt_breakdown->receipt_date)->toDateString();

            $bank_deposit_slip = BankDepositSlip::where('counter_id', $cash_receipt_breakdown->counter_id)->where('user_id', $cash_receipt_breakdown->user_id)->where('payment_type', 'CSH')->whereDate('date', $date)->first();

            if (!$bank_deposit_slip) {
                return redirect()->back()->with('error', 'Proses gagal! Maklumat Resit Deposit Bank tidak dijumpai!')->withInput();
            }

            $bank_deposit_slip->update(['amount_from_cash_breakdown_receipt' => $total_amount]);

            DB::commit();

            activity()->performedOn($cash_receipt_breakdown)->causedBy(auth()->user())->log('Pecahan Terimaan Tunai telah ditambah');

            return to_route('cash-receipt-breakdown.index')->with('success', 'Proses berjaya!');
        } catch (\Exception $e) {

            DB::rollBack();
            dd($e);
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function print(CashReceiptBreakdown $cash_receipt_breakdown, $id)
    {
        $cash_receipt_breakdown = CashReceiptBreakdown::with(['user', 'counter', 'collectionCenter'])
            ->where('id', $id)
            ->first(); 
        

        $user = $cash_receipt_breakdown->user;
        $counter = $cash_receipt_breakdown->counter;
        $collectionCenter = $cash_receipt_breakdown->collectionCenter;

        $receiptPDF = Pdf::loadView('cash-receipt-breakdown', [
            'staff_id' => $user->staff_id,
            'staff_name' => $user->name,
            'collection_center_name' => $collectionCenter->name,
            'counter_no' => $counter->name,
            'receipt_date' => Carbon::parse($cash_receipt_breakdown->receipt_date)->format('d/m/Y'),
            'receipt_group' => $cash_receipt_breakdown->receipt_collection_id,

            'rm100' => $cash_receipt_breakdown->RM100,
            'rm50' => $cash_receipt_breakdown->RM50,
            'rm20' => $cash_receipt_breakdown->RM20,
            'rm10' => $cash_receipt_breakdown->RM10,
            'rm5' => $cash_receipt_breakdown->RM5,
            'rm1' => $cash_receipt_breakdown->RM1,
            'amt_rm100' => number_format($cash_receipt_breakdown->RM100 * 100, 2),
            'amt_rm50' => number_format($cash_receipt_breakdown->RM50 * 50, 2),
            'amt_rm20' => number_format($cash_receipt_breakdown->RM20 * 20, 2),
            'amt_rm10' => number_format($cash_receipt_breakdown->RM10 * 10, 2),
            'amt_rm5' => number_format($cash_receipt_breakdown->RM5 * 5, 2),
            'amt_rm1' => number_format($cash_receipt_breakdown->RM1 * 1, 2),
            'total_cash' => number_format($cash_receipt_breakdown->total_cash, 2),

            'rm0_50' => $cash_receipt_breakdown->RM0_50,
            'rm0_20' => $cash_receipt_breakdown->RM0_20,
            'rm0_10' => $cash_receipt_breakdown->RM0_10,
            'rm0_05' => $cash_receipt_breakdown->RM0_05,
            'amt_rm0_50' => number_format($cash_receipt_breakdown->RM0_50 * 0.5, 2),
            'amt_rm0_20' => number_format($cash_receipt_breakdown->RM0_20 * 0.2, 2),
            'amt_rm0_10' => number_format($cash_receipt_breakdown->RM0_10 * 0.1, 2),
            'amt_rm0_05' => number_format($cash_receipt_breakdown->RM0_05 * 0.05, 2),
            'total_coin' => $cash_receipt_breakdown->total_coin,

            'total' => $cash_receipt_breakdown->total_all

        ]);

        return $receiptPDF->stream();
    }
}
