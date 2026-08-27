<?php

namespace App\Domain\Bolao\Actions;

use App\Domain\Bolao\Enums\BetStatus;
use App\Domain\Bolao\Enums\PaidMethod;
use App\Domain\Bolao\Events\RankingAtualizado;
use App\Domain\Bolao\Exceptions\MotivoObrigatorio;
use App\Domain\Bolao\Services\ApuracaoService;
use App\Models\Bet;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DarBaixaManual
{
    public function __construct(
        private readonly ApuracaoService $apuracao,
    ) {}

    public function handle(Bet $bet, string $reason, User|Seller $actor): Bet
    {
        if (trim($reason) === '') {
            throw MotivoObrigatorio::make('dar baixa manual numa aposta');
        }

        $actorType = $actor instanceof Seller ? 'seller' : 'user';

        return DB::transaction(function () use ($bet, $reason, $actor, $actorType): Bet {
            $fromStatus = $bet->status;

            $bet->update([
                'status' => BetStatus::Paid,
                'paid_at' => now(),
                'paid_method' => PaidMethod::Manual,
            ]);

            $bet->statusLogs()->create([
                'from_status' => $fromStatus->value,
                'to_status' => BetStatus::Paid->value,
                'reason' => trim($reason),
                'actor_type' => $actorType,
                'actor_id' => $actor->id,
            ]);

            // A cartela pode ter entrado depois de sorteios já publicados:
            // reapura só ela contra o histórico da rodada.
            $this->apuracao->apurarAposta($bet);

            RankingAtualizado::dispatch($bet->round()->firstOrFail());

            return $bet->refresh();
        });
    }
}
