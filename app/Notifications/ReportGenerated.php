<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReportGenerated extends Notification
{
    use Queueable;

    protected $record;
    /**
     * Create a new notification instance.
     */
    public function __construct($record)
    {
        $this->record = $record;
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
            'title'       => 'Laporan Slip Deposit Bank telah dijana oleh sistem',
            'message'     => "Laporan Slip Deposit Bank #{$this->record->id} telah dijana oleh sistem untuk {$this->record->user->name}. Sila kemaskini maklumat Slip Deposit Bank.",
            'record_id'   => $this->record->id,
            'url'         => route('report.index'),
            'created_by'  => $this->record->created_by ?? 'Unknown',
            'timestamp'   => now()->toDateTimeString(),
        ];
    }
}
