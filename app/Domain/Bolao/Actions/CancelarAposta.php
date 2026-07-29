<?php

namespace App\Domain\Bolao\Actions;

use App\Domain\Bolao\Enums\BetStatus;
use App\Domain\Bolao\Exceptions\MotivoObrigatorio;
use App\Models\Bet;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CancelarAposta
{
    public function handle(Bet $bet, string $reason, User $actor, BetStatus $to = BetStatus::Canceled): Bet
    {
        if (trim($reason) === '') {
            throw MotivoObrigatorio::make('cancelar ou estornar uma aposta');
        }

        return DB::transaction(function () use ($bet, $reason, $actor, $to): Bet {
            $fromStatus = $bet->status;

            $bet->update(['status' => $to]);

            // Cartela fora de jogo não mantém pontuação nem bolas acesas.
            $bet->betNumbers()->update(['matched_draw_id' => null]);
            $bet->forceFill(['hits_count' => 0, 'completed_at_draw_id' => null])->save();

            $bet->statusLogs()->create([
                'from_status' => $fromStatus->value,
                'to_status' => $to->value,
                'reason' => trim($reason),
                'actor_type' => 'user',
                'actor_id' => $actor->id,
            ]);

            return $bet->refresh();
        });
    }
}
