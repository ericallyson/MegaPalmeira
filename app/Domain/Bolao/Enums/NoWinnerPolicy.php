<?php

namespace App\Domain\Bolao\Enums;

enum NoWinnerPolicy: string
{
    case HighestScore = 'highest_score';
    case Rollover = 'rollover';

    public function label(): string
    {
        return match ($this) {
            self::HighestScore => 'Paga a maior pontuação',
            self::Rollover => 'Acumula para a próxima rodada',
        };
    }
}
