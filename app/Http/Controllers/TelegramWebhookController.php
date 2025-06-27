<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class TelegramWebhookController extends Controller
{
    public function handle(Request $request)
    {
        Log::info('🔔 Telegram webhook hit');

        try {
            $data = $request->all();
            Log::info('📥 Raw incoming data:', $data);

            $message = $data['message'] ?? null;

            if (!$message) {
                Log::warning('⚠️ No "message" field in payload.');
                return response()->json(['ok' => false, 'message' => 'No message']);
            }

            $chatId = $message['chat']['id'] ?? null;
            $text = $message['text'] ?? null;
            $location = $message['location'] ?? null;

            Log::info("👤 Chat ID: {$chatId}");

            if ($text && !$location) {
                Log::info("💬 Storing text message for chat {$chatId}: {$text}");
                Cache::put("incident_draft_text_{$chatId}", $text, 300); // 5 min cache
            }

            if ($location) {
                Log::info("📍 Location: lat={$location['latitude']}, lon={$location['longitude']}");

                $cachedText = Cache::get("incident_draft_text_{$chatId}");

                if ($cachedText) {
                    Log::info("🧾 Found cached message: {$cachedText}");

                    $incident = new Incident();
                    $incident->source = 'telegram';
                    $incident->message = $cachedText;
                    $incident->chat_id = $chatId;
                    $incident->latitude = $location['latitude'];
                    $incident->longitude = $location['longitude'];
                    $incident->status = 'baru';
                    $incident->save();

                    Cache::forget("incident_draft_text_{$chatId}");

                    Log::info("✅ Incident saved. ID: {$incident->id}");
                } else {
                    Log::info("📍 Location received, but no text message cached yet for chat {$chatId}");
                }
            }

            return response()->json(['ok' => true]);
        } catch (\Throwable $e) {
            Log::error('❌ Error processing Telegram webhook: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
