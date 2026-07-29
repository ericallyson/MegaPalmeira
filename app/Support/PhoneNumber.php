<?php

namespace App\Support;

class PhoneNumber
{
    /**
     * Normaliza um telefone brasileiro digitado livremente para E.164.
     * "(82) 99123-4589" → "+5582991234589".
     */
    public static function e164(string $phone): string
    {
        $digits = preg_replace('/\D+/', '', $phone) ?? '';

        if (str_starts_with($digits, '55') && strlen($digits) >= 12) {
            return "+{$digits}";
        }

        return "+55{$digits}";
    }
}
