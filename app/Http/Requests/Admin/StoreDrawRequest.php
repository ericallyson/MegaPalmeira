<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreDrawRequest extends FormRequest
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
            'contest_number' => ['required', 'integer', 'min:1'],
            'drawn_on' => ['required', 'date'],
            'numbers' => ['required', 'array', 'size:6'],
            'numbers.*' => ['required', 'integer', 'between:1,60', 'distinct'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'numbers.size' => 'Informe as 6 dezenas do concurso.',
            'numbers.*.between' => 'As dezenas precisam estar entre 1 e 60.',
            'numbers.*.distinct' => 'Há dezena repetida no sorteio.',
        ];
    }
}
