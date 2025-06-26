<?php

namespace App\Http\Controllers;

use App\Models\CollectionCenter;
use App\Models\Counter;
use App\Models\FloatCashRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Carbon\Carbon;
use App\Notifications\FloatCashRequestNotification;

class FloatCashController extends Controller
{
    public function index()
    {
        auth()->user()->hasPermission('read float cash') ?: abort(403);

        $float_cash_requests = QueryBuilder::for(FloatCashRequest::class)
            ->allowedFilters([
                AllowedFilter::callback('search', function ($query, $value) {
                    $statusMap = [
                        'lulus' => 'approved',
                        'tolak' => 'rejected',
                        'dalam proses' => 'requested',
                    ];
                    
                    $valueLower = strtolower($value);
                    $mappedStatus = $statusMap[$valueLower] ?? null;

                    $query->select('float_cash_requests.*')
                        ->join('counters', 'float_cash_requests.counter_id', '=', 'counters.id')
                        ->join('collection_centers', 'counters.collection_center_id', '=', 'collection_centers.id')
                        ->join('users', 'float_cash_requests.user_id', '=', 'users.id')
                        ->where(function ($query) use ($value,$mappedStatus) {
                            $query->where('counters.name', 'LIKE', '%' . $value . '%')
                                ->orWhere('collection_centers.name', 'LIKE', '%' . $value . '%')
                                ->orWhere('users.name', 'LIKE', '%' . $value . '%')
                                ->orWhere('float_cash_requests.type', 'LIKE', '%' . $value . '%')
                                ->orWhere('float_cash_requests.reason', 'LIKE', '%' . $value . '%')
                                ->orWhere('float_cash_requests.total', 'LIKE', '%' . $value . '%');

                            if ($mappedStatus) {
                                $query->orWhere('float_cash_requests.status', $mappedStatus);
                            }
                        });
                }),
                AllowedFilter::callback('collection_center_id', function ($query, $value) {
                    $query->select('float_cash_requests.*')
                    ->where('float_cash_requests.collection_center_id', $value);
                }),
                AllowedFilter::callback('counter_id', function ($query, $value) {
                    $query->select('float_cash_requests.*')
                    ->where('float_cash_requests.counter_id', $value);
                }),
                AllowedFilter::callback('start_date', function ($query, $value) {
                $startDate = Carbon::parse($value)->startOfDay() ?? null;
                   $query->select('float_cash_requests.*')
                    ->whereDate('float_cash_requests.date_applied', '>=', $startDate);
                }),
                AllowedFilter::callback('end_date', function ($query, $value) {
                    $endDate = Carbon::parse($value)->endOfDay() ?? null;
                   $query->select('float_cash_requests.*')
                    ->where('float_cash_requests.date_applied', '<=', $endDate);
                }),
            ])
            ->with('latestChange.causer', 'firstChange.causer')
            ->where(function ($query) {
                if(auth()->user()->role->name == 'cashier') {
                    $query->where('user_id', auth()->user()->id);
                }
            })
            ->orderBy('date_applied', 'desc')
            ->paginate(10);

        return Inertia::render('FloatingCash/Index', [
            'float_cash_requests' => $float_cash_requests,
            'users' => User::all(),
            'collection_centers' => CollectionCenter::with('counters')->get(),
            'counters' => Counter::all(),
            'currentRoute' => Route::currentRouteName()
        ]);
    }

    public function requestForm()
    {
        auth()->user()->hasPermission('read float cash request form') ?: abort(403);

        return Inertia::render('FloatingCash/Request', [
            'currentRoute' => Route::currentRouteName(),
            'cashiers' => User::whereHas('role', function ($query) {
                $query->where('name', 'cashier');
            })->get(),
            'collection_centers' => CollectionCenter::with('counters')->get(),
        ]);
    }

    public function store()
    {
        auth()->user()->hasPermission('create float cash request form') ?: abort(403);

        $validate = request()->validate([
            'collection_center_id' => 'required|exists:collection_centers,id',
            'counter_id' => 'required|exists:counters,id',
            'user_id' => 'required|exists:users,id',
            'type' => 'required|in:increment,decrement',
            'date_applied' => 'required|date',
            'total' => 'required',
        ]);

        DB::beginTransaction();

        try {
            $validate['date_applied'] = Carbon::parse($validate['date_applied'])->format('Y-m-d H:i:s');

            $validate['status'] = FloatCashRequest::STATUS_REQUESTED;

            $float_cash_requests = FloatCashRequest::create($validate);

            User::notifyRole([Role::NAME_SUPERVISOR, Role::NAME_COUNTER_SUPERVISOR], new FloatCashRequestNotification($float_cash_requests));

            DB::commit();

            activity()->performedOn($float_cash_requests)->causedBy(auth()->user())->log("Amaun Pembukaan wang apungan telah dimohon");

            return to_route('float-cash.index')->with('success', 'Proses berjaya!');
        } catch (\Exception $e) {

            DB::rollBack();
            dd($e);
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function approve(FloatCashRequest $float_cash_request)
    {
        auth()->user()->hasPermission('read float cash') ?: abort(403);

        $validate = request()->validate([]);

        DB::beginTransaction();

        try {

            $float_cash_request->update([
                'status' => FloatCashRequest::STATUS_APPROVED,
            ]);

            DB::commit();

            activity()->performedOn($float_cash_request)->causedBy(auth()->user())->log("Permohonan Wang Apungan berjaya diluluskan");

            return to_route('float-cash.index')->with('success', 'Proses berjaya!');
        } catch (\Exception $e) {

            DB::rollBack();
            dd($e);
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function reject(FloatCashRequest $float_cash_request)
    {
        auth()->user()->hasPermission('read float cash') ?: abort(403);

        $validate = request()->validate([
            'reason' => 'required',
        ]);

        DB::beginTransaction();

        try {

            $float_cash_request->update([
                'status' => FloatCashRequest::STATUS_REJECTED,
                'reason' => $validate['reason'],
            ]);

            DB::commit();

            activity()->performedOn($float_cash_request)->causedBy(auth()->user())->log("Permohonan Wang Apungan gagal diluluskan");

            return to_route('float-cash.index')->with('success', 'Proses berjaya!');
        } catch (\Exception $e) {

            DB::rollBack();
            dd($e);
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }
}
