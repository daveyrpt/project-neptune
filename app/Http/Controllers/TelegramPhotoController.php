<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TelegramPhotoController extends Controller
{
    public function show($fileId)
    {
        $token = '7908424134:AAEd5c82O2jCP0zV-f9X3nCG26ZYpaonB84';

        // Step 1: Get file path
        $response = Http::get("https://api.telegram.org/bot{$token}/getFile", [
            'file_id' => $fileId,
        ]);

        $result = $response->json('result');

        if (!$result || !isset($result['file_path'])) {
            abort(404, 'File not found');
        }

        // Step 2: Redirect to actual file URL
        $filePath = $result['file_path'];
        return redirect("https://api.telegram.org/file/bot{$token}/{$filePath}");
    }
}
