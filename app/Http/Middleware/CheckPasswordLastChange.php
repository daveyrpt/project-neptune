<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpFoundation\Response;

class CheckPasswordLastChange
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return $next($request);
        }

        // Allow the expired password route without interruption
        if (Route::currentRouteName() === 'profile.edit' || $request->is('/profile')) {
            return $next($request);
        }

        $user = Auth::user();
        $lastChanged = $user->password_changed_at ?? $user->created_at;

        if (now()->diffInDays($lastChanged) >= 90) {
            return redirect()->route('profile.edit')->with('error', 'Kata laluan perlu diubah setiap 90 hari');
        }

        return $next($request);
    }
}
