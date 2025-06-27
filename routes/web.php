<?php

use App\Http\Controllers\AdvancePaymentRequestController;
use App\Http\Controllers\CashierManagementController;
use App\Http\Controllers\CashReceiptBreakdownController;
use App\Http\Controllers\CenturyFinancialController;
use App\Http\Controllers\CounterController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DummyController;
use App\Http\Controllers\FloatCashController;
use App\Http\Controllers\IntegrationController;
use App\Http\Controllers\OspController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\SystemController;
use App\Http\Controllers\TelegramWebhookController;
use App\Http\Controllers\TerminalManagementController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Browsershot\Browsershot;
use App\Http\Controllers\Auth\KeycloakCustomController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
Route::post('/telegram/webhook', [TelegramWebhookController::class, 'handle']);
// Route::redirect('/', 'login');
Route::get('/auth/callback', [KeycloakCustomController::class, 'handleCallback']);

    Route::get('/dashboard', [DashboardController::class, 'dashboard'])
        ->middleware(['auth', 'verified', 'password.age'])
        ->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])
        ->middleware(['auth', 'verified'])
        ->name('profile.edit');

    Route::post('/profile', [ProfileController::class, 'update'])
        ->middleware(['auth', 'verified'])
        ->name('profile.update');

    Route::put('/user/{user}', [UserController::class, 'update'])
        ->middleware(['auth', 'verified'])
        ->name('user.update');

    Route::middleware(['auth', 'verified', 'password.age'])->group(function () {
    // Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    // Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin Routes
    Route::get('/user', [UserController::class, 'index'])->name('user.index');

    Route::get('/user/print', [UserController::class, 'print'])->name('user.print');

    Route::post('/user', [UserController::class, 'store'])->name('user.store');

    Route::put('/user/{user}', [UserController::class, 'update'])->name('user.update');

    Route::delete('/user/{user}', [UserController::class, 'destroy'])->name('user.destroy');

    Route::get('/integration', [IntegrationController::class, 'index'])->name('integration.index');

    Route::post('/integration', [IntegrationController::class, 'store'])->name('integration.store');

    Route::get('/cashier-management', [CashierManagementController::class, 'index'])->name('cashier-management.index'); # kawalan juruwang

    Route::post('/cashier-management', [CashierManagementController::class, 'store'])->name('cashier-management.store');

    Route::put('/cashier-management', [CashierManagementController::class, 'update'])->name('cashier-management.update');

    Route::delete('/cashier-management', [CashierManagementController::class, 'destroy'])->name('cashier-management.destroy');

    Route::get('/century-financial', [CenturyFinancialController::class, 'index'])->name('century-financial.index');

    Route::get('/terminal-management', [TerminalManagementController::class, 'index'])->name('terminal-management.index');

    // Cashier Routes
    Route::get('/counter-and-collection-center', [UserController::class, 'counterAndCollectionCenter'])->name('counter-and-collection-center.index');
    Route::post('/counter-and-collection-center', [UserController::class, 'storeCounterAndCollectionCenter'])->name('counter-and-collection-center.store');

    Route::post('/open-floating-cash', [UserController::class, 'openFloatingCash'])->name('open-floating-cash');

    Route::get('/advance-payment-request', [AdvancePaymentRequestController::class, 'index'])->name('advance-payment-request.index');
    Route::post('/advance-payment-request', [AdvancePaymentRequestController::class, 'store'])->name('advance-payment-request.store');

    Route::get('/customer', [CustomerController::class, 'index'])->name('customer.index');
    Route::get('/customer/{customer}', [CustomerController::class, 'view'])->name('customer.view');
    Route::post('/customer', [CustomerController::class, 'store'])->name('customer.store');
    Route::put('/customer/{customer}', [CustomerController::class, 'update'])->name('customer.update');
    Route::delete('/customer/{customer}', [CustomerController::class, 'destroy'])->name('customer.destroy');
    
    Route::get('/cash-receipt-breakdown/form', [CashReceiptBreakdownController::class, 'form'])->name('cash-receipt-breakdown.form');
    Route::get('/cash-receipt-breakdown', [CashReceiptBreakdownController::class, 'index'])->name('cash-receipt-breakdown.index');
    Route::post('/cash-receipt-breakdown', [CashReceiptBreakdownController::class, 'store'])->name('cash-receipt-breakdown.store');
    Route::get('/cash-receipt-breakdown/print/{cashReceiptBreakdown}', [CashReceiptBreakdownController::class, 'print'])->name('cash-receipt-breakdown.print');

     Route::get('/starting-day', [SystemController::class, 'startingDay'])->name('system.starting-day');

    Route::get('/report', [ReportController::class, 'index'])->name('report.index');
    Route::get('/report/{report}', [ReportController::class, 'customReport'])->name('report.custom-report');
    Route::put('/report/{bankDepositSlip}', [ReportController::class, 'update'])->name('report.update');
    Route::get('/report/print/bank-deposit-slip/{type}', [ReportController::class, 'printBankDepositSlip'])->name('report.print.bank-deposit-slip');
    Route::get('/report/show/bank-deposit-slip/{bankDepositSlip}', [ReportController::class, 'show'])->name('report.show');

    Route::get('/report/audit-rol/print/{receipt}', [ReportController::class, 'printAuditRol'])->name('report.print.audit-rol');
    Route::get('/report/cs16/print/{receipt}', [ReportController::class, 'printCS16'])->name('report.print.cs16');
    Route::get('/report/audit-trail/print', [ReportController::class, 'printAuditTrail'])->name('report.print.audit-trail');

    Route::get('/report/cs17/print', [ReportController::class, 'printCS17'])->name('report.print.cs17');
    Route::get('/report/print-default/{type}', [ReportController::class, 'printDefaultReport'])->name('report.print-default');

    Route::get('/float-cash', [FloatCashController::class, 'index'])->name('float-cash.index');
    Route::get('/float-cash/request-form', [FloatCashController::class, 'requestForm'])->name('float-cash.request-form');
    Route::post('/float-cash', [FloatCashController::class, 'store'])->name('float-cash.store');
    Route::post('/float-cash/{float_cash_request}/approve', [FloatCashController::class, 'approve'])->name('float-cash.approve');
    Route::post('/float-cash/{float_cash_request}/reject', [FloatCashController::class, 'reject'])->name('float-cash.reject');

    Route::get('/searchAccountNumber', [CustomerController::class, 'searchAccountNumber'])->name('customer.search');

    Route::get('/notifications/markAllAsRead',[UserController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');
    // Developer Routes
    Route::get('/role-permission', [RolePermissionController::class, 'index'])->name('role-permission.index');
    Route::post('/role-permission', [RolePermissionController::class, 'update'])->name('role-permission.update');

        Route::get('/hydrant', [ReportController::class, 'hydrant'])->name('report.hydrant');
        Route::get('/station', [ReportController::class, 'station'])->name('report.station');
        Route::get('/police', [ReportController::class, 'police'])->name('report.police');
        Route::get('/ambulance', [ReportController::class, 'ambulance'])->name('report.ambulance');
        Route::get('/list', [ReportController::class, 'list'])->name('report.list');
        Route::get('/incidents/{id}/pdf', [ReportController::class, 'downloadPdf'])->name('incidents.pdf');
        Route::get('/audit', [ReportController::class, 'audit'])->name('report.audit');
        Route::get('/audit/pdf', [ReportController::class, 'auditPrint'])->name('report.auditPrint');

        

});


Route::get('/test-pdf', function () {


    // $browsershot = Browsershot::html(
    //             view('receipt', [
    //             ])->render(),
    //         )
    //         ->setScreenshotType('pdf')
    //         ->margins(10, 10, 10, 10)
    //         ->format('A4')
    //         ->noSandbox()
    //         ->showBrowserHeaderAndFooter()

    return view('receipt', [
        'cashier' => 'ABD RAHMAN MUSTAFA (18) PL1',
        'date' => now()->format('d/m/Y h:i:s A'),
        'payer' => 'SYARIKAT SERI NOR HOLDINGS SDN BHD',
        'account_number' => '222',
        'payment_type' => 'TUNAI',
        'payment_code' => '18101',
        'amount' => 25.00,
        'amount_words' => 'DUA PULUH LIMA RINGGIT SAHAJA'
    ]);
});
require __DIR__ . '/auth.php';
require __DIR__ . '/receipt.php';
require __DIR__ . '/system.php';
require __DIR__ . '/counter.php';
require __DIR__ . '/osp.php';