<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
            'avatar' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
            'password' => ['nullable', 'string', 'min:8', 'regex:/[a-z]/', 'regex:/[A-Z]/', 'regex:/[0-9]/', 'regex:/[@$!%*#?&]/'],
        ];
    }

    public function messages():array
    {
        return [
            'avatar.max' => 'Saiz fail melebihi 2MB',
            'password.regex' => 'Kata laluan mestilah mengandungi setidaknya satu huruf besar, satu huruf kecil, satu nombor dan satu simbol.',
            'password.min' => 'Kata laluan mestilah mengandungi minimal 8 pangkal.',
        ];
    }
}
