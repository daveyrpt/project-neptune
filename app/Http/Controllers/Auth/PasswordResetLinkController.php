<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // Find user
        $user = User::where('email', $request->email)->first();
        // If user not found, throw default error
        if (!$user) {
            throw ValidationException::withMessages([
                'email' => [trans(Password::INVALID_USER)],
            ]);
        }

        // Only allow certain roles
        $allowedRoles = ['admin', 'supervisor', 'counter_supervisor'];

        
        // ❗ Restrict forgot password to specific roles only
        if (!in_array($user->role->name ?? '', $allowedRoles)) {
            throw ValidationException::withMessages([
                'email' => ['Your account is not allowed to reset the password.'],
            ]);
        }

        // Proceed with sending the reset link
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status == Password::RESET_LINK_SENT) {
            return back()->with('status', __($status));
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }
}
