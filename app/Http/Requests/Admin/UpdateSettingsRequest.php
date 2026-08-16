<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('administrar-bolao') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'mp_base_url' => ['required', 'url', 'max:255'],
            'mp_notification_url' => ['nullable', 'url', 'max:255'],
            // Segredos são opcionais: em branco = mantém o valor atual.
            'mp_access_token' => ['nullable', 'string', 'max:500'],
            'mp_webhook_secret' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'mp_base_url.required' => 'Informe a URL base da API do Mercado Pago.',
            'mp_base_url.url' => 'A URL base precisa ser uma URL válida.',
            'mp_notification_url.url' => 'A URL de notificação precisa ser uma URL válida.',
        ];
    }
}
