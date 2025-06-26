<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReceiptCancelRequest extends Notification
{
    use Queueable;

    protected $receipt;
    /**
     * Create a new notification instance.
     */
    public function __construct($receipt)
    {
        $this->receipt = $receipt;
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
            'title'       => 'Permohonan Batal Resit',
            'message'     => "Permohonan Batal Resit #{$this->receipt->id} telah dimohon oleh {$this->receipt->user->name}.",
            'receipt_id'  => $this->receipt->id,
            'url'         => route('receipt.cancel.index'),
            'created_by'  => $this->receipt->created_by ?? 'Unknown',
            'timestamp'   => now()->toDateTimeString(),
        ];
    }
}
