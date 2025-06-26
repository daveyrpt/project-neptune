<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Logout;

class LogSuccessfulLogout
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Logout $event)
    {
        activity('logout')
            ->causedBy($event->user)
            ->log('User logged out');

        // Optional: Clear the login flag if you’re using it
        session()->forget('login_logged');
    }
}
