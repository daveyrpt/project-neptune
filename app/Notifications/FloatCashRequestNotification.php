<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FloatCashRequestNotification extends Notification
{
    use Queueable;

    protected $float_cash_request;

    /**
     * Create a new notification instance.
     */
    public function __construct($float_cash_request)
    {
        $this->float_cash_request = $float_cash_request;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        if (config('notification.email_enabled')) {
            return ['mail', 'database'];
        }

        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->line('The introduction to the notification.')
                    ->action('Notification Action', url('/'))
                    ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title'       => 'Permohonan Wang Apungan',
            'message'     => "Permohonan Wang Apungan #{$this->float_cash_request->id} telah dimohon oleh {$this->float_cash_request->user->name}.",
            'float_cash_id'  => $this->float_cash_request->id,
            'url'         => route('float-cash.index'),
            'created_by'  => $this->float_cash_request->created_by ?? 'Unknown',
            'timestamp'   => now()->toDateTimeString(),
        ];
    }
}
