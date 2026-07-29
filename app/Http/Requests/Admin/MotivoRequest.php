<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class MotivoRequest extends FormRequest
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
            'motivo' => ['required', 'string', 'min:5', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'motivo.required' => 'Informe o motivo. Ele fica registrado na auditoria.',
            'motivo.min' => 'Descreva o motivo com pelo menos 5 caracteres.',
        ];
    }
}
