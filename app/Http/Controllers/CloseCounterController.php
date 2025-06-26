<?php

namespace App\Http\Controllers;

use App\Models\HistoryCounter;
use App\Models\OpenedCounter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class CloseCounterController extends Controller
{
    public function index()
    {
        auth()->user()->hasPermission('manage close counter') ?: abort(403);

        $opened_counters = QueryBuilder::for(OpenedCounter::class)
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
        ->where('status', 'open')
        ->paginate(10);

        return Inertia::render('ReceiveProcess/CloseCounter',[
            'currentRoute' => Route::currentRouteName(),
            'opened_counters' => $opened_counters
        ]);
    }

    // public function store()
    // {
    //     auth()->user()->hasPermission('manage close counter') ?: abort(403);

    //     $validate = request()->validate([
    //         'collection_center_id' => 'required|exists:collection_centers,id',
    //         'counter_id' => 'required|exists:counters,id',
    //         'user_id' => 'required|exists:users,id',
    //         'date' => 'required|date',
    //         'cash_balance' => 'required',
    //     ]);

    //     DB::beginTransaction();

    //     try {

    //         # check cash balance if equilvalent to float cash

    //         $history_counters = HistoryCounter::create([
    //             'collection_center_id' => $validate['collection_center_id'],
    //             'counter_id' => $validate['counter_id'],
    //             'user_id' => $validate['user_id'],
    //             'date' => $validate['date'],
    //             'type' => 'admin closing counter',
    //         ]);

    //         $counter_opened = OpenedCounter::where('collection_center_id', $validate['collection_center_id'])->where('counter_id', $validate['counter_id'])->where('date', $validate['date'])->first();

    //         $counter_opened->update([
    //             'status' => 'close',
    //         ]);

    //         DB::commit();

    //         activity()->performedOn($history_counters)->causedBy(auth()->user())->log("Penutupan Kaunter berjaya ditambah");

    //         return redirect()->back()->with('success', 'Proses berjaya!');

    //     } catch (\Exception $e) {

    //         DB::rollBack();

    //         return redirect()->back()->with('error', 'Proses gagal!')->withInput();
    //     }
    // }

    // public function update(HistoryCounter $history_counter)
    // {
    //     auth()->user()->hasPermission('manage close counter') ?: abort(403);

    //     $validate = request()->validate([
    //         'collection_center_id' => 'required|exists:collection_centers,id',
    //         'counter_id' => 'required|exists:counters,id',
    //         'user_id' => 'required|exists:users,id',
    //         'date' => 'required|date',
    //         'cash_balance' => 'required',
    //     ]);

    //     DB::beginTransaction();

    //     try {

    //         # check cash balance if equilvalent to float cash

    //         $history_counter->update([
    //             'collection_center_id' => $validate['collection_center_id'],
    //             'counter_id' => $validate['counter_id'],
    //             'user_id' => $validate['user_id'],
    //             'date' => $validate['date'],
    //             'type' => 'admin closing counter',
    //         ]);

    //         DB::commit();

    //         activity()->performedOn($history_counter)->causedBy(auth()->user())->log("Penutupan Kaunter berjaya dikemaskini");

    //         return redirect()->back()->with('success', 'Proses berjaya!');

    //     } catch (\Exception $e) {

    //         DB::rollBack();

    //         return redirect()->back()->with('error', 'Proses gagal!')->withInput();
    //     }
    // }

    // public function destroy(HistoryCounter $history_counter)
    // {
    //     auth()->user()->hasPermission('manage close counter') ?: abort(403);

    //     DB::beginTransaction();
    
    //     try {
    //         $history_counter->delete();
    
    //         DB::commit();
    
    //         activity()->performedOn($history_counter)->causedBy(auth()->user())->log("Penutupan Kaunter berjaya dipadam");
    
    //         return redirect()->back()->with('success', 'Proses berjaya!');
    
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    
    //         return redirect()->back()->with('error', 'Proses gagal!')->withInput();
    //     }
    // }
}
