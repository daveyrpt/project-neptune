<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class KeycloakCustomController extends Controller
{
    public function handleCallback()
    {
        info(request()->all());
        $code = request('code');

        if (!$code) {
            abort(403, 'No code from Keycloak');
        }

        $kc = config('keycloak-web');

        $response = Http::asForm()->post(
            rtrim($kc['base_url'], '/') . '/realms/' . $kc['realm'] . '/protocol/openid-connect/token',
            [
                'grant_type' => 'authorization_code',
                'client_id' => $kc['client_id'],
                'client_secret' => $kc['client_secret'],
                'redirect_uri' => $kc['redirect_uri'],
                'code' => $code,
            ]
        );

        if (!$response->ok()) {
            return abort(403, 'Invalid token response');
        }

        $tokenData = $response->json();
        $idToken = explode('.', $tokenData['id_token'])[1];
        $decoded = json_decode(base64_decode(strtr($idToken, '-_', '+/')), true);

        $email = $decoded['email'] ?? null;
        $name = $decoded['name'] ?? null;

        if (!$email) {
            abort(403, 'No email from token');
        }

        // ✅ Match only if google_email matches
        $user = User::where('google_email', $email)->first();

        if (!$user) {
            return redirect('/login')
                ->with('error', 'Maklumat kelayakan tidak sepadan dengan rekod kami.')
                ->withInput();
        }

        // Optional: update user name from Keycloak if needed
        // $user->update(['name' => $name]);

        // ✅ Login manually
        Auth::login($user);

        return redirect()->intended('/dashboard');
    }

}
