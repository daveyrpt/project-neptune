<?php

namespace App\Http\Controllers;

use App\Models\AdvancePaymentRequest;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

class AdvancePaymentRequestController extends Controller
{
    public function index()
    {
        auth()->user()->hasPermission('read advance payment request') ?: abort(403);

        return Inertia::render('AdvancePayment/Request', [
            'currentRoute' => Route::currentRouteName(),
        ]);
    }

    public function store()
    {  
        // auth()->user()->hasPermission('create advance payment request') ?: abort(403);

        $validate = request()->validate([
            'system' => 'required|in:PRS,PAS,LISO,LIST,NBL',
            'account_number' => 'required',
            'identity_number' => 'required',
            'customer_name' => 'required',
        ],[
            'system.required' => 'Sistem perlu diisi',
            'account_number.required' => 'No Akaun/No. Lesen perlu diisi',
            'identity_number.required' => 'ID Pelanggan perlu diisi',
            'customer_name.required' => 'Nama Pelanggan ini perlu diisi',
        ]);

        DB::beginTransaction();

        try {

            $advancePaymentRequest = AdvancePaymentRequest::create($validate);

            $customer = Customer::create([
                'system' => $validate['system'],
                'name' => $validate['customer_name'],
                'account_number' => $validate['account_number'],
                'identity_number' => $validate['identity_number'],
            ]);

            DB::commit();

            activity('create')->performedOn($advancePaymentRequest)->causedBy(auth()->user())->log('Bayaran Pendahuluan baru telah ditambah');

            if(request('route') == 'osp-open-item') {
                return back()->with('success', 'Proses berjaya!');
            }

            return to_route('receipt.create')->with('success', 'Proses berjaya!');

        } catch (\Exception $e) {

            DB::rollBack();
            dd($e);
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }

    }
}
