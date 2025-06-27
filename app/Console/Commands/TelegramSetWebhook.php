<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class TelegramSetWebhook extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'telegram:webhook:set';


    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Register Telegram webhook with Laravel endpoint';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $token = '7908424134:AAEd5c82O2jCP0zV-f9X3nCG26ZYpaonB84';
        $webhookUrl = 'https://firemas.dvyrpt.com/telegram/webhook';

        $response = Http::post("https://api.telegram.org/bot{$token}/setWebhook", [
            'url' => $webhookUrl,
        ]);

        $this->info('📡 Webhook Set Response: ' . $response->body());
    }
}
