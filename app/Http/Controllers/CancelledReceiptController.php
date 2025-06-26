<?php

namespace App\Http\Controllers;

use App\Models\CollectionCenter;
use App\Models\Counter;
use App\Models\Receipt;
use App\Models\CancelledReceipt;
use App\Models\Role;
use App\Models\User;
use App\Notifications\ReceiptCancelRequest;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class CancelledReceiptController extends Controller
{
    public function index()
    {
        auth()->user()->hasPermission('read receipt cancel') ?: abort(403);

        $cancelled_receipts = QueryBuilder::for(CancelledReceipt::class)
        ->allowedFilters([
            AllowedFilter::callback('search', function ($query, $value) {
                $query->select('cancelled_receipts.*')
                    ->where(function ($query) use ($value) {
                        $query->where('current_receipt_number', 'LIKE', '%' . $value . '%')
                            ->orWhere('new_receipt_number', 'LIKE', '%' . $value . '%')
                            ->orWhere('reason_by_cashier', 'LIKE', '%' . $value . '%')
                            ->orWhereHas('user', fn($q) => $q->where('name', 'like', '%' . $value . '%'));
                    });
            }),
            AllowedFilter::callback('collection_center_id', function ($query, $value) {
                $query->where('cancelled_receipts.collection_center_id', $value);
            }),
            AllowedFilter::callback('counter_id', function ($query, $value) {
                $query->where('counter_id', $value);
            }),
            AllowedFilter::callback('status', function ($query, $value) {
                $query->where('status', $value);
            }),
            AllowedFilter::callback('start_date', function ($query, $value) {
                $date = Carbon::createFromFormat('d-m-Y', $value)->format('Y-m-d');
                $query->whereDate('receipt_date', '>=', $date);
            }),
            AllowedFilter::callback(
                'end_date',
                function ($query, $value) {
                    $date = Carbon::createFromFormat('d-m-Y', $value)->format('Y-m-d');
                    $query->whereDate('receipt_date', '<=', $date);
                }
            )
        ])
        ->with('latestChange.causer', 'firstChange.causer')
        ->orderBy('created_at', 'desc')
        ->paginate(10);

        return Inertia::render('ReceiveProcess/CancelRequest/Index', [
            'currentRoute' => Route::currentRouteName(),
            'cancelled_receipts' => $cancelled_receipts,
            'users' => User::all(),
            'collection_centers' => CollectionCenter::with('counters')->get(),
            'counters' => Counter::all(),
        ]);
    }

    public function view(CancelledReceipt $cancelledReceipt)
    {
        auth()->user()->hasPermission('read receipt cancel request form') ?: abort(403);

        return Inertia::render('ReceiveProcess/CancelRequest/Show',[
            'currentRoute' => Route::currentRouteName(),
            'cancelledReceipt' => $cancelledReceipt
        ]);
    }

    public function update(Receipt $receipt )
    {
        auth()->user()->hasPermission('update receipt cancel request form') ?: abort(403);

        $validate = request()->validate([
            'description' => 'required|string|max:255',
        ]);
        

        DB::beginTransaction();

        try {

            $receipt->update($validate);
            $receipt->update([
                'status' => Receipt::STATUS_CANCEL_REQUEST
            ]);


            DB::commit();

            activity()->performedOn($receipt)->causedBy(auth()->user())->log("Maklumat Pembatalan Resit baru telah dikemaskini");

            return redirect()->back()->with('success', 'Proses berjaya!');

        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function approve(CancelledReceipt $cancelledReceipt)
    {
        auth()->user()->hasPermission('update receipt cancel request form') ?: abort(403);
    
        $validate = request()->validate([
            'receipt_number' => 'required|exists:receipts,receipt_number',
        ]);

        DB::beginTransaction();

        try {

            # Check if new receipt number already keyin by cashier
            # If exists replaced old receipt number with new one
            if ($cancelledReceipt->new_receipt_number != null) {
                $validate['new_receipt_number'] = $cancelledReceipt->new_receipt_number;

                $receipt_to_be_updated = Receipt::where('receipt_number', $validate['new_receipt_number'])->first();

                if ($receipt_to_be_updated == null) {
                    return redirect()->back()->with('error', 'Resit lama tidak wujud!');
                }

                $receipt_to_be_updated->update([
                    'receipt_number' => $validate['new_receipt_number'],
                    'status' => Receipt::STATUS_REPLACED
                ]);
            } 
            
            $cancelledReceipt->receipt->update([
                'status' => Receipt::STATUS_CANCELLED
            ]);

            $cancelledReceipt->update([
                'status' => CancelledReceipt::STATUS_APPROVED
            ]);

            DB::commit();

            activity()->performedOn($cancelledReceipt)->causedBy(auth()->user())->log("Pembatalan Resit baru telah disahkan");

            return to_route('receipt.cancel.index')->with('success', 'Proses berjaya!');

        } catch (\Exception $e) {

            DB::rollBack();
            dd($e);
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function reject(CancelledReceipt $cancelledReceipt)
    {
        auth()->user()->hasPermission('update receipt cancel request form') ?: abort(403);
     
        $validate = request()->validate([
            'receipt_number' => 'required|exists:receipts,receipt_number',
            'reject_reason' => 'required'
        ]);

        DB::beginTransaction();

        try {

            $cancelledReceipt->update([
                'reason_by_admin' => $validate['reject_reason'],
                'status' => CancelledReceipt::STATUS_REJECTED
            ]);

            $cancelledReceipt->receipt->update([
                'status' => Receipt::STATUS_GENERATED
            ]);

            DB::commit();

            activity()->performedOn($cancelledReceipt)->causedBy(auth()->user())->log("Pembatalan Resit baru telah ditolak");

            return to_route('receipt.cancel.index')->with('success', 'Proses berjaya!');

        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function request(Receipt $receipt)
    {
        auth()->user()->hasPermission('request cancel receipt') ?: abort(403);
    
        $validate = request()->validate([
            'receipt_id' => 'required|exists:receipts,id',
            'current_receipt_number' => 'required|exists:receipts,receipt_number',
            'new_receipt_number' => 'nullable|exists:receipts,receipt_number',
            'reason_by_cashier' => 'required'
        ],
        [
            'current_receipt_number.exists' => 'Resit lama tidak wujud',
            'new_receipt_number.exists' => 'Resit baru tidak wujud'
        ]);

        DB::beginTransaction();

        try {
            
            $receipt = Receipt::findOrFail($validate['receipt_id']);

            $receipt->update([
                'status' => Receipt::STATUS_CANCEL_REQUEST
            ]);

            // if(isset($validate['new_receipt_number'])) {
            //     $receipt->update([
            //         'receipt_number' => $validate['new_receipt_number']
            //     ]);
            // }

            $validate['collection_center_id'] = $receipt->collection_center_id;
            $validate['counter_id'] = $receipt->counter_id;
            $validate['user_id'] = auth()->user()->id;
            $validate['receipt_date'] = Carbon::now();
            $validate['status'] = CancelledReceipt::STATUS_REQUESTED;

            $cancelledReceipt = CancelledReceipt::create($validate);

            User::notifyRole([Role::NAME_SUPERVISOR, Role::NAME_COUNTER_SUPERVISOR], new ReceiptCancelRequest($receipt));

            DB::commit();

            activity()->performedOn($cancelledReceipt)->causedBy(auth()->user())->log("Pembatalan Resit baru telah ditambah");

            return redirect()->back()->with('success', 'Proses berjaya!');

        } catch (\Exception $e) {

            DB::rollBack();
            dd($e);
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }

    }
}
