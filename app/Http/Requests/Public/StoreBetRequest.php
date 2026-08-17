<?php

namespace App\Http\Requests\Public;

use App\Rules\ValidBetNumbers;
use Illuminate\Foundation\Http\FormRequest;

class StoreBetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nome' => ['required', 'string', 'min:3', 'max:100'],
            'celular' => ['required', 'string', 'regex:/^\D*(\d\D*){10,13}$/'],
            'data_nascimento' => [
                'required', 'date',
                'before_or_equal:'.now()->subYears(18)->toDateString(),
                'after:'.now()->subYears(120)->toDateString(),
            ],
            'email' => ['nullable', 'email', 'max:150'],
            'numbers' => ['required', new ValidBetNumbers],
            'aceite_maioridade' => ['accepted'],
            'aceite_regulamento' => ['accepted'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nome.required' => 'Informe seu nome para continuar.',
            'celular.required' => 'Informe seu celular com DDD para continuar.',
            'celular.regex' => 'Esse celular não parece válido. Use DDD + número, como (82) 99123-4589.',
            'data_nascimento.required' => 'Informe sua data de nascimento — ela é sua senha para acessar suas apostas.',
            'data_nascimento.before_or_equal' => 'Você precisa ter 18 anos ou mais para apostar.',
            'data_nascimento.after' => 'Confira a data de nascimento.',
            'aceite_maioridade.accepted' => 'Você precisa confirmar que tem 18 anos ou mais.',
            'aceite_regulamento.accepted' => 'Você precisa aceitar o regulamento para apostar.',
        ];
    }
}
