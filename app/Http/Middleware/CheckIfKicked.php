<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CheckIfKicked
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
    if (auth()->check()) {
        $sessionId = Session::getId();
        $isKicked = DB::table('sessions')
            ->where('id', $sessionId)
            ->value('kicked');

        if ($isKicked) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->with('error', 'You were logged out because your account was accessed from another device.');
        }
    }

        return $next($request);
    }
}
