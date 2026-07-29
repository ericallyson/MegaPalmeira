<?php

namespace App\Domain\Bolao\Actions;

use App\Domain\Bolao\Enums\RoundStatus;
use App\Domain\Bolao\Exceptions\MotivoObrigatorio;
use App\Domain\Bolao\Exceptions\RodadaNaoAceitaSorteios;
use App\Models\Round;
use App\Models\User;

class CancelarRodada
{
    public function handle(Round $round, string $reason, User $actor): Round
    {
        if (trim($reason) === '') {
            throw MotivoObrigatorio::make('cancelar uma rodada');
        }

        if ($round->status === RoundStatus::Closed) {
            throw RodadaNaoAceitaSorteios::porStatus($round->status);
        }

        $round->update([
            'status' => RoundStatus::Canceled,
            'closed_at' => now(),
        ]);

        activity()
            ->causedBy($actor)
            ->performedOn($round)
            ->withProperties(['motivo' => trim($reason)])
            ->log('rodada_cancelada');

        return $round;
    }
}
