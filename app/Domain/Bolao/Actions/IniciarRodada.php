<?php

namespace App\Domain\Bolao\Actions;

use App\Domain\Bolao\Enums\RoundStatus;
use App\Models\Round;

class IniciarRodada
{
    /**
     * Aberta vira "em andamento" quando o prazo de apostas já passou.
     * Fallback do comando agendado, para não depender do cron em produção.
     */
    public function handle(Round $round): bool
    {
        if ($round->status !== RoundStatus::Open) {
            return false;
        }

        if ($round->bets_close_at->isFuture()) {
            return false;
        }

        $round->update(['status' => RoundStatus::Running]);

        return true;
    }
}
