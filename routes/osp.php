<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OspController;

Route::middleware(['auth', 'verified', 'password.age'])->group(function () {
    Route::prefix('/osp')->name('osp.')->group(function () {

        Route::get('/', [OspController::class, 'viewConfiguration'])->name('index');

        Route::post('/config', [OspController::class, 'config'])->name('config');

        Route::delete('/config/{osp_config}', [OspController::class, 'destroyConfig'])->name('destroy-config');

        Route::post('/import', [OspController::class, 'import'])->name('import');

        Route::post('/plmis', [OspController::class, 'plmis'])->name('plmis');

        Route::post('/saga', [OspController::class, 'saga'])->name('saga');

        Route::delete('/import/{osp_import}', [OspController::class, 'deleteImport'])->name('delete-import');

        Route::delete('/{osp}', [OspController::class, 'deleteOsp'])->name('delete-osp');

        Route::put('/{osp}', [OspController::class, 'updateOsp'])->name('update-osp');

        Route::get('/print', [OspController::class, 'printOsp'])->name('print-osp');

        Route::post('/ready-to-be-upload', [OspController::class, 'readyToBeUpload'])->name('ready-to-be-upload');

        Route::post('/end-osp-process', [OspController::class, 'endOspProcess'])->name('end-osp-process');

        Route::post('/update-osp-receipt', [OspController::class, 'updateOspReceipt'])->name('update-osp-receipt');
    });
});