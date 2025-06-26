<?php

use App\Http\Controllers\CloseCounterController;
use App\Http\Controllers\OpenCounterController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'password.age'])->group(function () {
    Route::prefix('/counter')->name('counter.')->group(function () {

        Route::get('/open', [OpenCounterController::class, 'index'])->name('open.index'); # tarikh permulaan hari page

        Route::post('/open', [OpenCounterController::class, 'store'])->name('open.store');

        Route::put('/open/{id}', [OpenCounterController::class, 'update'])->name('open.update');

        Route::delete('/open/{id}', [OpenCounterController::class, 'destroy'])->name('open.destroy');

        Route::get('/close', [CloseCounterController::class, 'index'])->name('close.index');

        Route::post('/close', [CloseCounterController::class, 'store'])->name('close.store');

        Route::put('/close/{id}', [CloseCounterController::class, 'update'])->name('close.update');

        Route::delete('/close/{id}', [CloseCounterController::class, 'destroy'])->name('close.destroy');
    });
});

