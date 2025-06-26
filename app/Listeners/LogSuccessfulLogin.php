<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Authenticated;

class LogSuccessfulLogin
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
    public function handle(Authenticated $event)
    {
        if (!session()->has('login_logged')) {
            activity('login')
                ->causedBy($event->user)
                ->log('User logged in');

            session(['login_logged' => true]); // flag it
        }
    }
}
