<?php

namespace App\Support;

class PhoneMask
{
    /**
     * Mantém o DDD, os 2 primeiros dígitos após o DDD e os 2 últimos.
     * O resto vira "x": (82) 99xxx-xx89.
     */
    public static function mask(string $phone): string
    {
        $digits = preg_replace('/\D+/', '', $phone) ?? '';

        if (str_starts_with($digits, '55') && strlen($digits) >= 12) {
            $digits = substr($digits, 2);
        }

        $ddd = substr($digits, 0, 2);
        $local = substr($digits, 2);
        $length = strlen($local);

        $masked = substr($local, 0, 2)
            .str_repeat('x', max(0, $length - 4))
            .substr($local, -2);

        $splitAt = $length - 4;
        $formatted = substr($masked, 0, $splitAt).'-'.substr($masked, $splitAt);

        return "({$ddd}) {$formatted}";
    }
}
