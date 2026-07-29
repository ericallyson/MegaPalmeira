<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidBetNumbers implements ValidationRule
{
    public const COUNT = 10;

    public const MIN = 1;

    public const MAX = 60;

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_array($value)) {
            $fail('Escolha as dezenas da cartela para continuar.');

            return;
        }

        foreach ($value as $number) {
            if (! is_int($number) && ! (is_string($number) && ctype_digit($number))) {
                $fail('Há um valor que não é uma dezena válida. Escolha números de 1 a 60.');

                return;
            }
        }

        $numbers = array_map(intval(...), $value);

        foreach ($numbers as $number) {
            if ($number < self::MIN || $number > self::MAX) {
                $fail('As dezenas precisam estar entre 1 e 60.');

                return;
            }
        }

        if (count($numbers) !== count(array_unique($numbers))) {
            $fail('Há dezena repetida. Cada dezena só pode aparecer uma vez.');

            return;
        }

        $count = count($numbers);

        if ($count < self::COUNT) {
            $missing = self::COUNT - $count;
            $fail($missing === 1
                ? 'Falta 1 número. Escolha 10 para continuar.'
                : "Faltam {$missing} números. Escolha 10 para continuar.");

            return;
        }

        if ($count > self::COUNT) {
            $fail("Você escolheu {$count} números. Escolha exatamente 10.");
        }
    }
}
