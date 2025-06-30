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
            $username = $message['from']['username'] ?? null;

            Log::info("👤 Chat ID: {$chatId}");

            $photos = $message['photo'] ?? null;

            if ($photos) {
                $largestPhoto = end($photos);
                $fileId = $largestPhoto['file_id'];
                Cache::put("photo_{$chatId}", $fileId, 3600);
                Log::info("📸 Cached photo file_id: {$fileId}");
            }

            // 1️⃣ Handle shared contact (phone number)
            if ($contact) {
                $phone = $contact['phone_number'] ?? null;
                $userId = $contact['user_id'] ?? null;
                $firstName = $contact['first_name'] ?? '';
                $lastName = $contact['last_name'] ?? '';
                $fullName = trim("{$firstName} {$lastName}");
                $username = $message['from']['username'] ?? null;

                Log::info("📞 Received phone: {$phone} from {$fullName} (ID: {$userId}, @{$username})");

                // Store both phone and name in cache
                Cache::put("phone_{$chatId}", $phone, 3600);
                Cache::put("name_{$chatId}", $fullName, 3600);
                Cache::put("username_{$chatId}", $username, 3600);

                return response()->json(['ok' => true, 'message' => 'Phone number received']);
            }

            // 2️⃣ Handle shared location
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
                    $incident->contact_number = Cache::get("phone_{$chatId}");
                    $incident->name = Cache::get("name_{$chatId}", '');
                    $incident->username = Cache::get("username_{$chatId}");
                    $incident->photo_file_id = Cache::get("photo_{$chatId}");

                    $incident->save();

                    Cache::forget("incident_draft_text_{$chatId}");

                    Log::info("✅ Incident saved. ID: {$incident->id}");

                    $this->sendTelegramMessage($chatId, '✅ Terima Kasih! Maklumat anda telah diterima oleh Balai Bomba Kota Kinabalu.');

                    Cache::forget("incident_draft_text_{$chatId}");
                    Cache::forget("phone_{$chatId}");
                    Cache::forget("name_{$chatId}");
                    Cache::forget("username_{$chatId}");
                } else {
                    Log::info("📍 Location received, but no text message cached yet for chat {$chatId}");
                }

                return response()->json(['ok' => true, 'message' => 'Location processed']);
            }

            // 3️⃣ Handle any incoming text
            if ($text) {
                Log::info("💬 Received text: {$text}");
                Cache::put("incident_draft_text_{$chatId}", $text, 300); // 5 min\
                $username = $message['from']['username'] ?? null;
                if ($username) {
                    Log::info("📛 Storing username: @{$username}");
                    Cache::put("username_{$chatId}", $username, 3600);
                }
                // 👇 Immediately ask for phone & location
                $this->askForPhoneAndLocation($chatId);
            }

            return response()->json(['ok' => true]);
        } catch (\Throwable $e) {
            Log::error('❌ Error processing Telegram webhook: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    private function askForPhoneAndLocation($chatId)
    {
        $token = '7908424134:AAEd5c82O2jCP0zV-f9X3nCG26ZYpaonB84';

        Http::post("https://api.telegram.org/bot{$token}/sendMessage", [
            'chat_id' => $chatId,
            'text' => "Sila kongsi maklumat berikut untuk laporan:\n\n📞 Nombor Telefon\n📍 Lokasi\n📷 Gambar kejadian (jika ada)",
            'reply_markup' => [
                'keyboard' => [
                    [
                        ['text' => '📞 Kongsi Nombor Telefon', 'request_contact' => true],
                    ],
                    [
                        ['text' => '📍 Kongsi Lokasi', 'request_location' => true],
                    ],
                    [
                        ['text' => '📷 Hantar Gambar Kejadian'],
                    ]
                ],
                'resize_keyboard' => true,
                'one_time_keyboard' => false,
            ],
        ]);
    }

    private function sendTelegramMessage($chatId, $message)
    {
        $token = '7908424134:AAEd5c82O2jCP0zV-f9X3nCG26ZYpaonB84';

        $response = Http::post("https://api.telegram.org/bot{$token}/sendMessage", [
            'chat_id' => $chatId,
            'text' => $message,
        ]);

        Log::info("📤 Sent confirmation message to {$chatId}: {$response->body()}");
    }

    
}
