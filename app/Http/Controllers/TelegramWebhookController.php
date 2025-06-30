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
        $photos = $message['photo'] ?? null;

        // 1. Text
        if ($text) {
            Log::info("💬 Received text: {$text}");
            Cache::put("text_{$chatId}", $text, 600);
            if ($username) {
                Cache::put("username_{$chatId}", $username, 600);
            }
            $this->askForPhoneLocationPhoto($chatId);
        }

        // 2. Contact
        if ($contact) {
            $phone = $contact['phone_number'] ?? null;
            $firstName = $contact['first_name'] ?? '';
            $lastName = $contact['last_name'] ?? '';
            $fullName = trim("$firstName $lastName");
            Log::info("📞 Received phone: {$phone} from {$fullName}");

            Cache::put("phone_{$chatId}", $phone, 600);
            Cache::put("name_{$chatId}", $fullName, 600);
        }

        // 3. Location
        if ($location) {
            Log::info("📍 Received location: lat={$location['latitude']}, lon={$location['longitude']}");
            Cache::put("lat_{$chatId}", $location['latitude'], 600);
            Cache::put("lng_{$chatId}", $location['longitude'], 600);
        }

        // 4. Photo
        if ($photos) {
            $largestPhoto = end($photos);
            $fileId = $largestPhoto['file_id'];
            Log::info("📸 Received photo file_id: {$fileId}");
            Cache::put("photo_{$chatId}", $fileId, 600);
        }

        // 🔁 Always check if we can now save the incident
        $this->checkIfReadyToSave($chatId);

        return response()->json(['ok' => true]);

    } catch (\Throwable $e) {
        Log::error('❌ Error: ' . $e->getMessage(), [
            'trace' => $e->getTraceAsString(),
        ]);
        return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
    }
}

private function checkIfReadyToSave($chatId)
{
    $text = Cache::get("text_{$chatId}");
    $phone = Cache::get("phone_{$chatId}");
    $name = Cache::get("name_{$chatId}");
    $username = Cache::get("username_{$chatId}");
    $lat = Cache::get("lat_{$chatId}");
    $lng = Cache::get("lng_{$chatId}");
    $fileId = Cache::get("photo_{$chatId}");

    if ($text && $phone && $lat && $lng && $fileId) {
        Log::info("✅ All data present. Saving incident...");

        $incident = new Incident();
        $incident->source = 'telegram';
        $incident->message = $text;
        $incident->chat_id = $chatId;
        $incident->contact_number = $phone;
        $incident->name = $name ?? '';
        $incident->username = $username ?? null;
        $incident->latitude = $lat;
        $incident->longitude = $lng;
        $incident->photo_file_id = $fileId;
        $incident->status = 'baru';
        $incident->save();

        $this->sendTelegramMessage($chatId, '✅ Terima kasih! Maklumat dan gambar anda telah diterima oleh Balai Bomba Kota Kinabalu.');

        // 🧹 Clean up
        foreach (['text', 'phone', 'name', 'username', 'lat', 'lng', 'photo'] as $key) {
            Cache::forget("{$key}_{$chatId}");
        }

        Log::info("🗂️ Incident saved and cache cleared.");
    } else {
        $missing = [];
        if (!$phone) $missing[] = 'nombor telefon';
        if (!$lat || !$lng) $missing[] = 'lokasi';
        if (!$fileId) $missing[] = 'gambar';

        Log::info("⏳ Waiting for more data... (Missing: " . implode(', ', $missing) . ")");

        $this->sendTelegramMessage($chatId, 'Sila kongsi ' . implode(' dan ', $missing) . ' untuk melengkapkan laporan.');
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

private function askForPhoneLocationPhoto($chatId)
{
    $token = config('services.telegram.token'); // store token in config
    Http::post("https://api.telegram.org/bot{$token}/sendMessage", [
        'chat_id' => $chatId,
        'text' => 'Sila kongsi nombor telefon, lokasi, dan gambar berkaitan insiden.',
        'reply_markup' => [
            'keyboard' => [
                [['text' => '📞 Kongsi Nombor Telefon', 'request_contact' => true]],
                [['text' => '📍 Kongsi Lokasi', 'request_location' => true]],
            ],
            'resize_keyboard' => true,
            'one_time_keyboard' => true,
        ],
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
