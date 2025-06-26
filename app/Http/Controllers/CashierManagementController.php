<?php

namespace App\Http\Controllers;

use App\Models\CashierManagement;
use App\Models\CollectionCenter;
use App\Models\Counter;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

class CashierManagementController extends Controller
{
    public function index()
    {
        auth()->user()->hasPermission('read cashier management') ?: abort(403);

        $cashier_managements = QueryBuilder::for(CashierManagement::class)
        ->allowedFilters([
            AllowedFilter::callback('search', function ($query, $value) {
                $valueLower = strtolower($value);

                $query->select('cashier_managements.*')
                    ->join('users', 'users.id', '=', 'cashier_managements.user_id')
                    ->where(function ($query) use ($value, $valueLower) {
                        $query->whereRaw('LOWER(users.name) LIKE ?', ["%{$valueLower}%"])
                            ->orWhereRaw('LOWER(cashier_managements.retail_money) LIKE ?', ["%{$valueLower}%"]);
                    });
            }),
            AllowedFilter::callback('collection_center_id', function ($query, $value) {
                $query->select('cashier_managements.*')
                ->where('cashier_managements.collection_center_id', $value);
            }),
            AllowedFilter::callback('counter_id', function ($query, $value) {
                $query->select('cashier_managements.*')
                ->where('cashier_managements.counter_id', $value);
            }),
        ])
        ->with('latestChange.causer', 'firstChange.causer')
        ->paginate(10);
        
        return Inertia::render('ReceiveProcess/CashierManagements', [
            'currentRoute' => Route::currentRouteName(),
            'cashier_managements' => $cashier_managements,
            'users' => User::all(),
            'collection_centers' => CollectionCenter::with('counters')->get(),
            'counters' => Counter::all(),
        ]);
    }

    public function store()
    {
        auth()->user()->hasPermission('store cashier management') ?: abort(403);

        $validate = request()->validate([
            'collection_center_id' => 'required|exists:collection_centers,id',
            'counter_id' => 'required|exists:counters,id',
            'user_id' => 'required|exists:users,id',
            'retail_money' => 'numeric',
            'max_cash' => 'numeric',
            'max_receipt' => 'numeric',
            'received_amount_in_cash' => 'numeric',
            'received_amount_in_cheque' => 'numeric',
            'received_amount_in_card_credit' => 'numeric',
            'received_amount_in_postage' => 'numeric',
            'received_amount_in_eft_si' => 'numeric',
            'received_amount_in_bank_draft' => 'numeric',
            'received_amount_in_bank_slip' => 'numeric',
        ]);

        DB::beginTransaction();

        try {

            $cashier_management = CashierManagement::create($validate);

            DB::commit();

            activity()->performedOn($cashier_management)->causedBy(auth()->user())->log("Kawalan juruwang telah ditambah");

            return redirect()->back()->with('success', 'Proses berjaya!');

        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function update(CashierManagement $cashier_management)
    {
        auth()->user()->hasPermission('update cashier management') ?: abort(403);

        $validate = request()->validate([
            'collection_center_id' => 'required|exists:collection_centers,id',
            'counter_id' => 'required|exists:counters,id',
            'user_id' => 'required|exists:users,id',
            'retail_money' => 'numeric',
            'max_cash' => 'numeric',
            'max_receipt' => 'numeric',
            'received_amount_in_cash' => 'numeric', 
            'received_amount_in_cheque' => 'numeric',
            'received_amount_in_card_credit' => 'numeric',
            'received_amount_in_postage' => 'numeric',
            'received_amount_in_eft_si' => 'numeric',
            'received_amount_in_bank_draft' => 'numeric',
            'received_amount_in_bank_slip' => 'numeric',
        ]);

        DB::beginTransaction();

        try {

            $cashier_management->update($validate);

            DB::commit();

            activity()->performedOn($cashier_management)->causedBy(auth()->user())->log("Kawalan juruwang telah diubah");

            return redirect()->back()->with('success', 'Proses berjaya!');

        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }

    }

    public function destroy(CashierManagement $cashier_management)
    {
        auth()->user()->hasPermission('delete cashier management') ?: abort(403);

        DB::beginTransaction();
    
        try {
            $cashier_management->delete();
    
            DB::commit();
    
            activity()->performedOn($cashier_management)->causedBy(auth()->user())->log("Kawalan juruwang berjaya dipadam");
    
            return redirect()->back()->with('success', 'Proses berjaya!');
    
        } catch (\Exception $e) {
            DB::rollBack();
    
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }
}
