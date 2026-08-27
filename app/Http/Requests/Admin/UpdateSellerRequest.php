<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSellerRequest extends FormRequest
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
        $sellerId = $this->route('seller')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'slug' => [
                'required', 'string', 'max:100',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('sellers', 'slug')->ignore($sellerId),
            ],
            'commission_pct' => ['required', 'integer', 'between:0,100'],
            'group_url' => ['nullable', 'url', 'max:255'],
            'password' => ['nullable', 'string', 'min:6', 'confirmed'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'slug.regex' => 'O slug deve ter só letras minúsculas, números e hífens (ex.: joao-silva).',
            'slug.unique' => 'Já existe um vendedor com esse slug.',
            'password.confirmed' => 'A confirmação da senha não confere.',
            'password.min' => 'A senha deve ter ao menos 6 caracteres.',
        ];
    }
}
