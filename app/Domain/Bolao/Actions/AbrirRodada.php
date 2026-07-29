<?php

namespace App\Domain\Bolao\Actions;

use App\Domain\Bolao\Enums\RoundStatus;
use App\Domain\Bolao\Exceptions\RodadaJaAtiva;
use App\Models\Round;
use App\Models\User;

class AbrirRodada
{
    /**
     * Rascunho vira aberta. Só uma rodada aberta ou em andamento por vez.
     */
    public function handle(Round $round, ?User $actor = null): Round
    {
        $active = Round::query()
            ->whereIn('status', [RoundStatus::Open, RoundStatus::Running])
            ->whereKeyNot($round->id)
            ->exists();

        if ($active) {
            throw RodadaJaAtiva::make();
        }

        if ($round->status !== RoundStatus::Draft) {
            throw RodadaJaAtiva::naoERascunho($round->status);
        }

        $round->update(['status' => RoundStatus::Open]);

        return $round;
    }
}
