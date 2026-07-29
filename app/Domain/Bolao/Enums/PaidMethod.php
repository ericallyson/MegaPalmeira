<?php

namespace App\Domain\Bolao\Enums;

enum PaidMethod: string
{
    case Pix = 'pix';
    case Manual = 'manual';

    public function label(): string
    {
        return match ($this) {
            self::Pix => 'PIX',
            self::Manual => 'Baixa manual',
        };
    }
}
