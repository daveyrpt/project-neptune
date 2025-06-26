<?php

namespace App\Http\Controllers;

use App\Models\Counter;
use App\Models\OpenedCounter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class OpenCounterController extends Controller
{
    public function index()
    {
        auth()->user()->hasPermission('manage open counter') ?: abort(403);

        $opened_counters = QueryBuilder::for(OpenedCounter::class)
        ->allowedFilters([
            AllowedFilter::callback('search', function ($query, $value) {
                $query->select('opened_counters.*')
                    ->where(function ($query) use ($value) {
                        $query->where('code', 'LIKE', '%' . $value . '%')
                            ->orWhere('remark', 'LIKE', '%' . $value . '%');
                    });
            })
        ])
        ->with('latestChange.causer', 'firstChange.causer')
        ->where('status', OpenedCounter::STATUS_OPEN_BY_ADMIN)
        ->paginate(10);
    
        return Inertia::render('ReceiveProcess/StartingDate', [
            'currentRoute' => Route::currentRouteName(),
            'openedCounters' => $opened_counters
        ]);
    }

    public function store()
    {
        auth()->user()->hasPermission('manage open counter') ?: abort(403);

        $validate = request()->validate([
            'date' => 'required|date',
            'collection_center_id' => 'required|exists:collection_centers,id',
        ]);

        DB::beginTransaction();

        try {

            # Get AlL Counter Bind To Collection Center
            $counters = Counter::where('collection_center_id', $validate['collection_center_id'])->get();

            # Check if counter exist
            if ($counters->isEmpty()) {
                return response()->json(['error' => 'Not a single counter found'], 404);
            }

            # Loop Through All Counter
            foreach ($counters as $counter) {
                $counter_opened = OpenedCounter::create([
                    'opened_at' => $validate['date'],
                    'collection_center_id' => $validate['collection_center_id'],
                    'counter_id' => $counter->id,
                    'user_id' => auth()->user()->id,
                    'status' => OpenedCounter::STATUS_OPEN_BY_ADMIN
                ]); 
            }

            DB::commit();

            activity('create')->performedOn($counter_opened)->causedBy(auth()->user())->log("Tarikh Permulaan Hari berjaya ditambah");

            return redirect()->back()->with('success', 'Proses berjaya!');

        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function update(OpenedCounter $counter_opened)
    {
        auth()->user()->hasPermission('manage open counter') ?: abort(403);

        $validate = request()->validate([
            'date' => 'required|date',
            'collection_center_id' => 'required|exists:collection_centers,id',
        ]);

        DB::beginTransaction();

        try {
            
            $validate['status'] = 'open';

            $counter_opened->update($validate);

            DB::commit();

            activity('update')->performedOn($counter_opened)->causedBy(auth()->user())->log("Tarikh Permulaan Hari berjaya dikemaskini");

            return redirect()->back()->with('success', 'Proses berjaya!');

        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function destroy(OpenedCounter $counter_opened)
    {
        auth()->user()->hasPermission('manage open counter') ?: abort(403);

        DB::beginTransaction();
    
        try {
            $counter_opened->delete();
    
            DB::commit();
    
            activity('delete')->performedOn($counter_opened)->causedBy(auth()->user())->log("Tarikh Permulaan Hari berjaya dipadam");
    
            return redirect()->back()->with('success', 'Proses berjaya!');
    
        } catch (\Exception $e) {
            DB::rollBack();
    
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }
}
