<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

class CustomerController extends Controller
{
    public function index()
    {
        auth()->user()->hasPermission('read customer') ?: abort(403);

        $customers = Customer::get();

        return Inertia::render('',[
            'currentRoute' => Route::currentRouteName(),
            'customers' => $customers,
        ]);
    }

    public function view(Customer $customer)
    {
        auth()->user()->hasPermission('read customer') ?: abort(403);

        $customer = Customer::find($customer);

        return Inertia::render('',[
            'currentRoute' => Route::currentRouteName(),
            'customer' => $customer,
        ]);
    }

    public function store()
    {
        $validate = request()->validate([
            'system' => 'required|in:PRS,PAS,LIS Operatin, Lis Trading, UUK',
            'account_number' => 'required',
            'identity_number' => 'required',
            'name' => 'required',
        ]);

        DB::beginTransaction();

        try {

            $cusomters = Customer::create([
                'system' => $validate['system'],
                'account_number' => $validate['account_number'],
                'identity_number' => $validate['identity_number'],
                'name' => $validate['name'],
            ]);

            DB::commit();

            activity()->performedOn($cusomters)->causedBy(auth()->user())->log('Pendaftaran No. Akauan baru ditambah');

            return redirect()->back()->with('success', 'Proses berjaya!');

        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }

    }

    public function update(Customer $customer)
    {
        $validate = request()->validate([
            'system' => 'required|in:PRS,PAS,LIS Operatin, Lis Trading, UUK',
            'account_number' => 'required',
            'identity_number' => 'required',
            'name' => 'required',
        ]);

        DB::beginTransaction();

        try {

            $customer = Customer::findOrFail($customer);

            $customer->update([
                'system' => $validate['system'],
                'account_number' => $validate['account_number'],
                'identity_number' => $validate['identity_number'],
                'name' => $validate['name'],
            ]);

            DB::commit();

            activity()->performedOn($customer)->causedBy(auth()->user())->log('Maklumat No. Akaun telah dikemaskini');

            return redirect()->back()->with('success', 'Proses berjaya!');

        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }

    }

    public function destroy(Customer $customer)
    {
        DB::beginTransaction();
    
        try {
            $customer = Customer::findOrFail($customer);
    
            $customer->delete();
    
            DB::commit();
    
            activity()->performedOn($customer)->causedBy(auth()->user())->log('Maklumat No. Akaun telah dipadam');
    
            return response()->json(['message' => 'Customer deleted successfully'], 200);
    
        } catch (\Exception $e) {
            DB::rollBack();
    
            return response()->json(['error' => 'Failed to delete customer', 'message' => $e->getMessage()], 500);
        }
    }

    public function searchAccountNumber(Request $request) {
        $data = Customer::where('account_number', 'like', '%' . $request->account_number . '%')->get();

        return $data;
    }
    
}
