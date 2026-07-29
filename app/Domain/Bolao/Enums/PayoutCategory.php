<?php

namespace App\Domain\Bolao\Enums;

enum PayoutCategory: string
{
    case Main = 'main';
    case Second = 'second';

    public function label(): string
    {
        return match ($this) {
            self::Main => 'Prêmio principal',
            self::Second => '2º lugar',
        };
    }
}
