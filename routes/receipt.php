<?php

use App\Http\Controllers\CancelledReceiptController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReceiptController;

Route::middleware(['auth', 'verified', 'password.age'])->group(function () {
    Route::prefix('/receipt')->name('receipt.')->group(function () {
        Route::get('/pdf', [ReceiptController::class, 'pdf'])->name('pdf');
        Route::get('/', [ReceiptController::class, 'index'])->name('index'); # terimaan = receipt 
        
        Route::get('/create', [ReceiptController::class, 'create'])->name('create');

        Route::get('/{receipt}', [ReceiptController::class, 'view'])->name('view');

        Route::post('/', [ReceiptController::class, 'store'])->name('store');

        Route::get('/edit/{receipt}', [ReceiptController::class, 'edit'])->name('edit');

        Route::get('/edit/{receipt}', [ReceiptController::class, 'edit'])->name('edit');

        Route::put('/{receipt}', [ReceiptController::class, 'update'])->name('update');

        Route::get('/preview/{cancelledReceipt}', [ReceiptController::class, 'preview'])->name('preview');

        Route::get('/print/{receipt}', [ReceiptController::class, 'print'])->name('print');

        Route::get('/print-receipt/{receipt}', [ReceiptController::class, 'printReceipt'])->name('print-receipt');

        Route::get('/cancel/list', [CancelledReceiptController::class, 'index'])->name('cancel.index'); # senarai permohonan pembatalan resit ( example using table )

        Route::get('/cancel/request-form/{receipt}', [CancelledReceiptController::class, 'view'])->name('cancel.request-form.view'); # permohonan batal resit - lihat . use for edit, reject, approve

        Route::put('/cancel/request-form/{receipt}', [CancelledReceiptController::class, 'update'])->name('cancel.request-form.update');

        Route::post('/cancel/request-form/{cancelledReceipt}/approve', [CancelledReceiptController::class, 'approve'])->name('cancel.request-form.approve');

        Route::post('/cancel/request-form/{cancelledReceipt}/reject', [CancelledReceiptController::class, 'reject'])->name('cancel.request-form.reject');

        Route::post('/cancel/request-form', [CancelledReceiptController::class, 'request'])->name('cancel.request-form.store'); # cashier submit request to cancel

       
    });
});