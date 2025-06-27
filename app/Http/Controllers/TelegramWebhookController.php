<?php

namespace App\Http\Controllers;

use App\Models\Incident;
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

        Log::info('🔔 Telegram webhook hit');

        try {
            $data = $request->all();
            Log::info('📥 Raw incoming data:', $data);

            $message = $data['message'] ?? null;

            if (!$message) {
                Log::warning('⚠️ No "message" field in payload.');
                return response()->json(['ok' => false, 'message' => 'No message']);
            }

            $text = $message['text'] ?? '[no text]';
            $chatId = $message['chat']['id'] ?? null;
            $location = $message['location'] ?? null;

            Log::info("🧾 Parsed message: {$text}");
            Log::info("👤 Chat ID: {$chatId}");
            if ($location) {
                Log::info("📍 Location: lat={$location['latitude']}, lon={$location['longitude']}");
            }

            $incident = new Incident();
            $incident->source = 'telegram';
            $incident->message = $text;
            $incident->chat_id = $chatId;
            $incident->latitude = $location['latitude'] ?? null;
            $incident->longitude = $location['longitude'] ?? null;
            $incident->status = 'baru';
            $incident->save();

            Log::info("✅ Incident saved. ID: {$incident->id}");
            return response()->json(['ok' => true]);
        } catch (\Throwable $e) {
            Log::error('❌ Error processing Telegram webhook: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
