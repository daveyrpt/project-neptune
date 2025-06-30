<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class TelegramWebhookController extends Controller
{
    public function handle(Request $request)
    {
        Log::info('🔔 Telegram webhook hit');

        try {
            $data = $request->all();
            Log::info('📥 Raw incoming data: ' . json_encode($data, JSON_PRETTY_PRINT));

            $message = $data['message'] ?? null;

            if (!$message) {
                Log::warning('⚠️ No "message" field in payload.');
                return response()->json(['ok' => false, 'message' => 'No message']);
            }

            $chatId = $message['chat']['id'] ?? null;
            $text = $message['text'] ?? null;
            $location = $message['location'] ?? null;
            $contact = $message['contact'] ?? null;

            Log::info("👤 Chat ID: {$chatId}");

            // 1️⃣ Handle contact sharing (phone number)
            if ($contact) {
                $phone = $contact['phone_number'] ?? null;
                $userId = $contact['user_id'] ?? null;
                $firstName = $contact['first_name'] ?? 'Unknown';

                Log::info("📞 Received phone number: {$phone} from {$firstName} (ID: {$userId})");

                // Optionally store in DB or cache
                Cache::put("phone_{$chatId}", $phone, 3600);

                return response()->json(['ok' => true, 'message' => 'Phone number received']);
            }

            // 2️⃣ Handle /start command — ask for phone number
            if ($text === '/start') {
                $this->askForPhoneNumber($chatId);
                return response()->json(['ok' => true, 'message' => 'Phone number request sent']);
            }

            // 3️⃣ Store text message for pairing
            if ($text && !$location) {
                Log::info("💬 Storing text message for chat {$chatId}: {$text}");
                Cache::put("incident_draft_text_{$chatId}", $text, 300); // 5 min cache
            }

            // 4️⃣ Store incident if location is sent
            if ($location) {
                Log::info("📍 Location received: lat={$location['latitude']}, lon={$location['longitude']}");

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

    private function askForPhoneNumber($chatId)
    {
        $token = '7908424134:AAEd5c82O2jCP0zV-f9X3nCG26ZYpaonB84';

        $response = Http::post("https://api.telegram.org/bot{$token}/sendMessage", [
            'chat_id' => $chatId,
            'text' => 'Sila tekan butang di bawah untuk berkongsi nombor telefon anda:',
            'reply_markup' => [
                'keyboard' => [
                    [
                        [
                            'text' => '📞 Kongsi nombor telefon',
                            'request_contact' => true,
                        ],
                    ],
                ],
                'resize_keyboard' => true,
                'one_time_keyboard' => true,
            ],
        ]);

        Log::info('📨 Phone request keyboard sent: ' . $response->body());
    }
}
