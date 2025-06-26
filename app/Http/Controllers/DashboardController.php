<?php

namespace App\Http\Controllers;

use App\Models\BankDepositSlip;
use App\Models\CancelledReceipt;
use App\Models\CollectionCenter;
use App\Models\Counter;
use App\Models\Customer;
use App\Models\FloatCash;
use App\Models\OpenedCounter;
use App\Models\Receipt;
use App\Models\Transaction;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function dashboard(Request $request)
    {
        //dd('here');

        return Inertia::render('Dashboard/Dashboard');
        // $user = auth()->user();

        // if ($user->hasPermission('read dashboard admin')) {
        //     return $this->admin($request);
        // }
    
        // if ($user->hasPermission('read dashboard cashier')) {
        //     return $this->cashier($request);
        // }
    
        // return to_route('login');
    }

    protected function admin(Request $request): Response
    {
        auth()->user()->hasPermission('read dashboard admin') ?: abort(403);

        $start_date = $request->query('start_date')
            ? Carbon::parse($request->query('start_date'))->startOfDay()
            : Carbon::today();
    
        $end_date = $request->query('end_date')
            ? Carbon::parse($request->query('end_date'))->endOfDay()
            : Carbon::today()->endOfDay();

        $date_range = [$start_date, $end_date];

        if($request->query('type')) {
            $collection_center_id = CollectionCenter::where('code', $request->query('type'))->first()->id ?? 1;
        } else {
            $collection_center_id = auth()->user()->currentCashierOpenedCounter()->first()->collection_center_id ?? null;
        }

        if($request->query('counter_type')) {
            $counter_id = $request->query('counter_type');
        } else {
            $counter_id = auth()->user()->currentCashierOpenedCounter()->first()->counter_id ?? null;
        }

        # for development purpose. remove it afterwards
        // $start_date = now()->setDate(2000, 1, 1)->startOfDay();
        // $end_date = now()->setDate(2050, 12, 31)->endOfDay();
        
        $widgets = $this->getWidgetData($date_range, $collection_center_id, $counter_id);
        
        $active_counters = OpenedCounter::whereIn('status', [OpenedCounter::STATUS_OPEN_BY_CASHIER, OpenedCounter::STATUS_CLOSE_BY_CASHIER])
            ->whereBetween('opened_at', $date_range)
            ->when($collection_center_id, function ($query, $collection_center_id) {
                return $query->where('collection_center_id', $collection_center_id);
            })
            ->when($counter_id, function ($query, $counter_id) {
                return $query->where('counter_id', $counter_id);
            })
            ->with(['collectionCenter', 'counter', 'user'])
            ->get();

        $reportIndicator = $this->getReportIndicator($date_range, $collection_center_id, $counter_id);
     
        $chartData = $this->getChartData($date_range, $collection_center_id, $counter_id);

        return Inertia::render('Dashboard/Dashboard', [
            'total_receipts'    => $widgets['total_receipts'] ?: 0,
            'total_receipt_cancelled' => $widgets['total_receipt_cancelled'] ?: 0,
            'total_customers'         => $widgets['total_customers'] ?: 0,
            'total_receipt_collected' => number_format($widgets['total_receipt_collected'] ?: 0, 2, '.', ',') ?: 0,

            'active_counter'    => $active_counters,
            'collection_centers'   => CollectionCenter::with('counters')->get(),
        
            'currentRoute'     => Route::currentRouteName(),
            'float_cash' => 0,
            'openFloatCashModal' => $openFloatCashModal ?? false,
            'start_date'        => $start_date->toDateString(),
            'end_date'          => $end_date->toDateString(),
            'reportIndicator' => $reportIndicator,
            'chartData' => $chartData,
            'graphData' => [],
        ]);
    }

    protected function cashier(Request $request)
    {
        auth()->user()->hasPermission('read dashboard cashier') ?: abort(403);
    
        $start_date = $request->query('start_date')
            ? Carbon::parse($request->query('start_date'))->startOfDay()
            : Carbon::today();
    
        $end_date = $request->query('end_date')
            ? Carbon::parse($request->query('end_date'))->endOfDay()
            : Carbon::today()->endOfDay();

        if($request->query('type')) {
            $collection_center_id = CollectionCenter::where('code', $request->query('type'))->first()->id ?? 1;
        } else {
            $collection_center_id = '';
        }

        if($request->query('counter_type')) {
            $counter_id = $request->query('counter_type');
        } else {
            $counter_id = '';
        }

        # for development purpose. remove it afterwards
        // $start_date = now()->setDate(2000, 1, 1)->startOfDay();
        // $end_date = now()->setDate(2050, 12, 31)->endOfDay();
    
        $date_range = [$start_date, $end_date];

        $widgets = $this->getWidgetData($date_range, $collection_center_id, $counter_id);

        $reportIndicator = $this->getReportIndicator($date_range, $collection_center_id, $counter_id);
        
        $chartData = $this->getChartData($date_range, $collection_center_id, $counter_id);

        $graphData = $this->getGraphData($start_date, $end_date, $date_range, $collection_center_id, $counter_id);

        # Check if need to open float cash modal
        $float_cash_value = 0;
        
        if(!empty(auth()->user()->currentCashierOpenedCounter()->first()->counter_id)) {
            $float_cash = FloatCash::where('counter_id', auth()->user()->currentCashierOpenedCounter()->first()->counter_id)
                ->whereBetween('set_at', $date_range)
                ->first();

            if($float_cash) {
                $float_cash_value = $float_cash->getTotalAmount();
            } 

            $float_cash = FloatCash::where('counter_id', auth()->user()->currentCashierOpenedCounter()->first()->counter_id)
                ->whereDate('set_at', Carbon::today())
                ->first();

            if(!$float_cash) {
                $openFloatCashModal = true;
            } 
        }

        return Inertia::render('Dashboard/Dashboard', [
            'total_receipts'    => $widgets['total_receipts'] ?: 0,
            'total_receipt_cancelled' => $widgets['total_receipt_cancelled'] ?: 0,
            'total_customers'         => $widgets['total_customers'] ?: 0,
            'total_receipt_collected' => number_format($widgets['total_receipt_collected'] ?: 0, 2, '.', ',') ?: 0,
            'receipts'    => $widgets['receipts'] ?: 0,

            'collection_centers'   => CollectionCenter::with('counters')->get(),
            
            'currentRoute'     => Route::currentRouteName(),
            'openFloatCashModal' => $openFloatCashModal ?? false,
            'float_cash' =>  $float_cash_value ?: 0,
            'start_date'        => $start_date->toDateString(),
            'end_date'          => $end_date->toDateString(),
            'reportIndicator' => $reportIndicator,
            'chartData' => $chartData,
            'graphTransactions' => $graphData['graphTransactions'],
            'graphAmounts' => $graphData['graphAmounts'],
        ]);
    }

    protected function getWidgetData($date_range, $collection_center_id = null, $counter_id = null)
    {
        $total_receipts = Receipt::whereBetween('date', $date_range)
            ->when($collection_center_id, function ($query, $collection_center_id) {
                return $query->where('collection_center_id', $collection_center_id);
            })
            ->when($counter_id, function ($query, $counter_id) {
                return $query->where('counter_id', $counter_id);
            })
            ->byUser()
            ->count();

        $total_receipt_cancelled = Receipt::whereBetween('date', $date_range)
            ->when($collection_center_id, function ($query, $collection_center_id) {
                return $query->where('collection_center_id', $collection_center_id);
            })
            ->when($counter_id, function ($query, $counter_id) {
                return $query->where('counter_id', $counter_id);
            })
            ->where('status', Receipt::STATUS_CANCELLED)
            ->byUser()
            ->count();
        
        $total_receipt_collected = Receipt::whereBetween('date', $date_range)
            ->when($collection_center_id, function ($query, $collection_center_id) {
                return $query->where('collection_center_id', $collection_center_id);
            })
            ->when($counter_id, function ($query, $counter_id) {
                return $query->where('counter_id', $counter_id);
            })
            ->byUser()
            ->whereIn('status', Receipt::ACCEPTABLE_STATUSES)
            ->sum('total_amount');
    
        $total_customers = Receipt::whereBetween('date', $date_range)
            ->when($collection_center_id, function ($query, $collection_center_id) {
                return $query->where('collection_center_id', $collection_center_id);
            })
            ->when($counter_id, function ($query, $counter_id) {
                return $query->where('counter_id', $counter_id);
            })  
            ->byUser()
            ->count(DB::raw('DISTINCT receipt_grouping_id'));

        $receipts = Receipt::where('status', Receipt::STATUS_GENERATED)
            ->when($collection_center_id, function ($query, $collection_center_id) {
                return $query->where('collection_center_id', $collection_center_id);
            })
            ->when($counter_id, function ($query, $counter_id) {
                return $query->where('counter_id', $counter_id);
            })  
            ->whereBetween('date', $date_range)
            ->with(['collectionCenter', 'counter', 'user'])
            ->byUser()
            ->get();

        return [
            'total_receipts'    => $total_receipts ?: 0,
            'total_receipt_cancelled' => $total_receipt_cancelled,
            'total_customers'         => $total_customers,
            'total_receipt_collected' => $total_receipt_collected,
            'receipts'    => $receipts,
        ];
    }

    protected function getChartData($date_range, $collection_center_id = null, $counter_id = null)
    {
        // Build base query once
        $baseQuery = Receipt::whereBetween('created_at', $date_range)
            ->when($collection_center_id, fn ($query) => $query->where('collection_center_id', $collection_center_id))
            ->when($counter_id, fn ($query) => $query->where('counter_id', $counter_id))
            ->whereIn('status', Receipt::ACCEPTABLE_STATUSES)
            ->byUser();

        // Define payment types and their labels
        $paymentTypes = [
            'CSH' => 'Tunai',
            'LCQ' => 'Cek',
            'CC'  => 'KadKeredit',
            'Wang Pos' => 'WangPos',
            'EFT' => 'EFT',
            'Deraf Bank' => 'DerafBank',
            'Slip Bank' => 'SlipBank',
            'QR' => 'QRPay',
        ];

        // Loop through types and sum amounts
        $chartData = [];

        foreach ($paymentTypes as $type => $label) {
            $chartData[$label] = (clone $baseQuery)
                ->where('payment_type', $type)
                ->sum('amount') ?? 0;
        }

        return $chartData;
    }

    protected function getGraphData($start_date, $end_date, $date_range,$collection_center_id = null, $counter_id = null)
    {
        $isSingleDay = $start_date->isSameDay($end_date);

        // Get all transactions in range
        $transaction = Receipt::whereBetween('created_at', [$start_date, $end_date])
            ->when($collection_center_id, fn ($query) => $query->where('collection_center_id', $collection_center_id))
            ->when($counter_id, fn ($query) => $query->where('counter_id', $counter_id))
            ->byUser()
            ->get();

        if ($isSingleDay) {
        
            // 🕐 Group by hour
            $grouped = $transaction->groupBy(function ($item) {
                return Carbon::parse($item->created_at)->format('H');
            });

            $data = collect(range(0, 23))->map(function ($hour) use ($grouped) {
                $hourStr = str_pad($hour, 2, '0', STR_PAD_LEFT);
                $group = $grouped->get($hourStr, collect());

                return [
                    'x' => $hourStr . ':00',// Use numeric X if chart expects it
                    'label' => $hourStr . ':00',
                    'transactions' => $group->count(),
                    'amount' => (float) $group->sum('amount'),
                ];
            });
        } else {
            // 📆 Group by date
            $grouped = $transaction->groupBy(function ($item) {
                return Carbon::parse($item->created_at)->format('Y-m-d');
            });

            $datePeriod = Carbon::parse($start_date)->daysUntil($end_date);
            $data = collect($datePeriod)->map(function ($date) use ($grouped) {
                $dateStr = $date->format('Y-m-d');
                $group = $grouped->get($dateStr, collect());

                return [
                    'x' => $dateStr,
                    'transactions' => $group->count(),
                    'amount' => (float) $group->sum('amount'),
                ];
            });
        }

        // Remove zero transactions
        $filtered = $data->filter(fn ($item) => $item['transactions'] > 0)->values();

        return [
            'graphTransactions' => $filtered->map(fn ($item) => ['x' => $item['x'], 'y' => $item['transactions']]),
            'graphAmounts' => $filtered->map(fn ($item) => ['x' => $item['x'], 'y' => $item['amount']]),
        ];
    }

    protected function getReportIndicator($date_range, $collection_center_id = null, $counter_id = null)
    {
        // $mismatchedTypes = BankDepositSlip::whereRaw('amount_from_receipt != amount_from_cash_breakdown_receipt')
        //     ->whereBetween('created_at', $date_range)
        //     ->whereIn('payment_type', ['Tunai', 'Cek', 'CC', 'Wang Pos', 'EFT', 'Deraf Bank', 'Slip Bank'])
        //     ->when($collection_center_id, function ($query, $collection_center_id) {
        //         return $query->where('collection_center_id', $collection_center_id);
        //     })
        //     ->when($counter_id, function ($query, $counter_id) {
        //         return $query->where('counter_id', $counter_id);
        //     })    
        //     ->pluck('payment_type') 
        //     ->unique()             
        //     ->values();          

        // $paymentTypes = ['Tunai', 'Cek', 'CC', 'Wang Pos', 'EFT', 'Deraf Bank', 'Slip Bank'];

        // $reportIndicator = collect($paymentTypes)->mapWithKeys(function ($type) use ($mismatchedTypes) {
        //     return [$type => $mismatchedTypes->contains($type)];
        // });

        $paymentTypes = ['CSH', 'Cek', 'CC', 'Wang Pos', 'EFT', 'Deraf Bank', 'Slip Bank'];

        // Only check mismatches for "Tunai"
        $mismatchedTypes = BankDepositSlip::where('payment_type', 'CSH')
            ->whereRaw('amount_from_receipt > amount_from_cash_breakdown_receipt')
            ->byUser()
            ->pluck('payment_type') // should only return 'Tunai' if any mismatches
            ->unique()
            ->values();

        // Mark only "Tunai" as true if there's a mismatch
        $reportIndicator = collect($paymentTypes)->mapWithKeys(function ($type) use ($mismatchedTypes) {
            if ($type === 'CSH') {
                return [$type => $mismatchedTypes->contains('CSH')];
            }
            return [$type => false]; // Non-Tunai types are always considered matched
        });

        return $reportIndicator;
    }
}
