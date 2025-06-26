<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SystemController;

Route::middleware(['auth', 'verified', 'password.age'])->group(function () {
    Route::prefix('/system')->name('system.')->group(function () {

        Route::get('/configuration', [SystemController::class, 'configuration'])->name('configuration'); 

        Route::post('/configuration', [SystemController::class, 'updateConfiguration'])->name('configuration.update');

        Route::get('/code-maintenance/receipt', [SystemController::class, 'viewReceiptSetting'])->name('code-maintenance.receipt.index'); 

        Route::post('/code-maintenance/receipt', [SystemController::class, 'storeReceiptSetting'])->name('code-maintenance.receipt.store');

        Route::put('/code-maintenance/receipt/{type}/{id}', [SystemController::class, 'updateReceiptSetting'])->name('code-maintenance.receipt.update'); 

        Route::delete('/code-maintenance/receipt/{type}/{id}', [SystemController::class, 'destroyReceiptSetting'])->name('code-maintenance.receipt.destroy');

        Route::get('/code-maintenance/century-financial', [SystemController::class, 'viewCenturyFinancial'])->name('code-maintenance.century-financial.index'); 

        Route::post('/code-maintenance/century-financial', [SystemController::class, 'storeCenturyFinancial'])->name('code-maintenance.century-financial.store'); 

        Route::put('/code-maintenance/century-financial/{type}/{id}', [SystemController::class, 'updateCenturyFinancial'])->name('code-maintenance.century-financial.update'); 

        Route::delete('/code-maintenance/century-financial/{type}/{id}', [SystemController::class, 'destroyCenturyFinancial'])->name('code-maintenance.century-financial.destroy'); 

        Route::get('/edit-receipt-number', [SystemController::class, 'editReceiptNumber'])->name('edit-receipt-number.index'); 

        Route::post('/edit-receipt-number', [SystemController::class, 'updateReceiptNumber'])->name('edit-receipt-number.update');
    });
});