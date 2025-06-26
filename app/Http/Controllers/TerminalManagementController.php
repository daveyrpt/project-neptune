<?php

namespace App\Http\Controllers;

use App\Models\CollectionCenter;
use App\Models\Counter;
use App\Models\TerminalManagement;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

class TerminalManagementController extends Controller
{

    public function index()
    {
        auth()->user()->hasPermission('read terminal management') ?: abort(403);

        $terminal_managements = QueryBuilder::for(TerminalManagement::class)
        ->allowedFilters([
            AllowedFilter::callback('search', function ($query, $value) {
                $valueLower = strtolower($value);
                $query->select('terminal_managements.*')
                    ->where(function ($q) use ($value, $valueLower) {
                        $q->where('terminal_managements.receipt_date', 'like', "%{$value}%");
                        if ($valueLower === 'y') {
                            $q->orWhere('counter_status', 'active');
                        } elseif ($valueLower === 'n') {
                            $q->orWhere('counter_status', 'non_active');
                        }
                    });
                    
            }),
            AllowedFilter::callback('collection_center_id', function ($query, $value) {
                $query->select('terminal_managements.*')
                    ->join('counters', 'terminal_managements.counter_id', '=', 'counters.id')
                    ->where('counters.collection_center_id', $value);
            }),
            AllowedFilter::callback('counter_id', function ($query, $value) {
                $query->where('counter_id', $value);
            }),
        ])
        ->with('latestChange.causer', 'firstChange.causer', 'latestReceipt')
        ->paginate(10);



        return Inertia::render('ReceiveProcess/TerminalController', [
            'currentRoute' => Route::currentRouteName(),
            'terminal_managements' => $terminal_managements,
            'users' => User::all(),
            'collection_centers' => CollectionCenter::with('counters')->get(),
            'counters' => Counter::all(),
        ]);
    }

    public function store()
    {
        auth()->user()->hasPermission('create terminal management') ?: abort(403);

        $validate = request()->validate([
            
        ]);

        DB::beginTransaction();

        try {

            DB::commit();

            activity()->performedOn()->causedBy(auth()->user())->log('');

            return redirect()->back()->with('success', 'Proses berjaya!');

        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
        
    }

    public function update()
    {
        auth()->user()->hasPermission('update terminal management') ?: abort(403);

        $validate = request()->validate([
            
        ]);

        DB::beginTransaction();

        try {

            DB::commit();

            activity()->performedOn()->causedBy(auth()->user())->log('');

            return redirect()->back()->with('success', 'Proses berjaya!');

        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function destroy(TerminalManagement $terminal_management)
    {
        auth()->user()->hasPermission('delete terminal management') ?: abort(403);

        DB::beginTransaction();
    
        try {
            $terminal_management->delete();
    
            DB::commit();
    
            activity()->performedOn($terminal_management)->causedBy(auth()->user())->log("Kawalan terminal berjaya dipadam");
    
            return redirect()->back()->with('success', 'Proses berjaya!');
    
        } catch (\Exception $e) {
            DB::rollBack();
    
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }
}
