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

            $chatId   = $message['chat']['id'] ?? null;
            $from     = $message['from'] ?? [];
            $text     = $message['text'] ?? null;
            $location = $message['location'] ?? null;
            $contact  = $message['contact'] ?? null;
            $photos   = $message['photo'] ?? null;

            if (!$chatId) {
                Log::warning('⚠️ No chat_id found.');
                return response()->json(['ok' => false, 'message' => 'No chat ID']);
            }

            // Store username if present
            if (!empty($from['username'])) {
                Cache::put("username_{$chatId}", $from['username'], 3600);
                Log::info("📛 Cached username: @{$from['username']}");
            }

            // 1️⃣ Handle photo
            if ($photos) {
                $largestPhoto = end($photos);
                $fileId = $largestPhoto['file_id'];
                Cache::put("photo_{$chatId}", $fileId, 3600);
                Log::info("📸 Cached photo file_id: {$fileId}");
            }

            // 2️⃣ Handle contact (phone)
            if ($contact) {
                $phone = $contact['phone_number'] ?? null;
                $firstName = $contact['first_name'] ?? '';
                $lastName  = $contact['last_name'] ?? '';
                $fullName  = trim("$firstName $lastName");
                Cache::put("phone_{$chatId}", $phone, 3600);
                Cache::put("name_{$chatId}", $fullName, 3600);
                Log::info("📞 Cached phone: {$phone} from {$fullName}");
                return response()->json(['ok' => true, 'message' => 'Contact cached']);
            }

            // 3️⃣ Handle location
            if ($location) {
                Cache::put("lat_{$chatId}", $location['latitude'], 3600);
                Cache::put("lng_{$chatId}", $location['longitude'], 3600);
                Log::info("📍 Cached location: {$location['latitude']}, {$location['longitude']}");
                $this->attemptSaveIncident($chatId);
                return response()->json(['ok' => true, 'message' => 'Location cached']);
            }

            // 4️⃣ Handle text message
            if ($text) {
                Cache::put("text_{$chatId}", $text, 3600);
                Log::info("💬 Cached message: {$text}");

                // Prompt for other info
                $this->askForDetails($chatId);
                return response()->json(['ok' => true, 'message' => 'Text cached']);
            }

            return response()->json(['ok' => true, 'message' => 'Unhandled message type']);
        } catch (\Throwable $e) {
            Log::error('❌ Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    private function attemptSaveIncident($chatId)
    {
        $text  = Cache::get("text_{$chatId}");
        $lat   = Cache::get("lat_{$chatId}");
        $lng   = Cache::get("lng_{$chatId}");
        $phone = Cache::get("phone_{$chatId}");
        $name  = Cache::get("name_{$chatId}");
        $username = Cache::get("username_{$chatId}");
        $fileId   = Cache::get("photo_{$chatId}");

       if ($text && $lat && $lng && $phone && $fileId) { 
            $incident = new Incident();
            $incident->source = 'telegram';
            $incident->message = $text;
            $incident->chat_id = $chatId;
            $incident->latitude = $lat;
            $incident->longitude = $lng;
            $incident->status = 'baru';
            $incident->contact_number = $phone;
            $incident->name = $name;
            $incident->username = $username;
            $incident->photo_file_id = $fileId;
            $incident->save();

            Log::info("✅ Incident saved: ID {$incident->id}");

            // Cleanup
            foreach (['text', 'lat', 'lng', 'phone', 'name', 'username', 'photo'] as $key) {
                Cache::forget("{$key}_{$chatId}");
            }

            $this->sendTelegramMessage($chatId, '✅ Terima kasih! Laporan anda telah diterima.');
        } else {
            Log::info("⏳ Waiting for complete data. text: {$text}, lat: {$lat}, phone: {$phone}");
        }
    }

    private function askForDetails($chatId)
    {
        $token = '7908424134:AAEd5c82O2jCP0zV-f9X3nCG26ZYpaonB84';

        Http::post("https://api.telegram.org/bot{$token}/sendMessage", [
            'chat_id' => $chatId,
            'text' => '📷 Sila kongsi gambar, nombor telefon dan lokasi anda untuk melengkapkan laporan.',
            'reply_markup' => [
                'keyboard' => [
                    [
                        ['text' => '📞 Kongsi Nombor Telefon', 'request_contact' => true]
                    ],
                    [
                        ['text' => '📍 Kongsi Lokasi', 'request_location' => true]
                    ]
                ],
                'resize_keyboard' => true,
                'one_time_keyboard' => true,
            ]
        ]);
    }

    private function sendTelegramMessage($chatId, $message)
    {
        $token = '7908424134:AAEd5c82O2jCP0zV-f9X3nCG26ZYpaonB84';

        $res = Http::post("https://api.telegram.org/bot{$token}/sendMessage", [
            'chat_id' => $chatId,
            'text' => $message
        ]);

        Log::info("📤 Sent to {$chatId}: {$res->body()}");
    }

    
}
