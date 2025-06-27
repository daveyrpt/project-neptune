<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TelegramWebhookController extends Controller
{
    public function handle(Request $request)
    {
        // $data = $request->all();
        // Log::info('Telegram webhook:', $data);

        // // Example: get text message
        // $message = $data['message'] ?? null;

        // if ($message) {
        //     $text = $message['text'] ?? '';
        //     $chatId = $message['chat']['id'];
        //     $location = $message['location'] ?? null;

        //     // Save to incidents table or log
        //     Log::info("User sent: $text");

        //     if ($location) {
        //         Log::info("Location: {$location['latitude']}, {$location['longitude']}");
        //     }
        // }

        // return response()->json(['ok' => true]);

        $data = $request->all();
        $message = $data['message'] ?? null;

        if ($message) {
            $text = $message['text'] ?? null;
            $chatId = $message['chat']['id'];
            $location = $message['location'] ?? null;

            $incident = new Incident();
            $incident->source = 'telegram';
            $incident->message = $text;
            $incident->chat_id = $chatId;
            $incident->latitude = $location['latitude'] ?? null;
            $incident->longitude = $location['longitude'] ?? null;
            $incident->status = 'baru';
            $incident->save();
        }

        return response()->json(['ok' => true]);
    }
}
