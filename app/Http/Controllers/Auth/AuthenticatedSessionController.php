<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = \App\Models\User::where('email', $request->email)->first();

        if ($user) {
            // Mark old sessions as kicked (but don't delete them yet)
            DB::table('sessions')
                ->where('user_id', $user->id)
                ->update(['kicked' => true]);
        }

        // Proceed with login
        if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            return back()->withErrors(['email' => __('auth.failed')]);
        }

        $request->session()->regenerate();

        // Set user_id and kicked = false on the new session
        DB::table('sessions')
            ->where('id', Session::getId())
            ->update([
                'user_id' => Auth::id(),
                'kicked' => false,
            ]);
    
        # Redirect cashier to select branch
        if(Auth::user()->role->name == 'cashier') {
            return redirect()->intended(RouteServiceProvider::SELECT_COUNTER);
        }

        # Redirect admin to dashboard
        if(Auth::user()->role->name == 'auditor') {
            return to_route('report.index');
        }

        return redirect()->intended(RouteServiceProvider::HOME);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
