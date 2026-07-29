<?php

namespace App\Domain\Bolao\Actions;

use App\Domain\Bolao\Data\RateioResultado;
use App\Domain\Bolao\Enums\NoWinnerPolicy;
use App\Domain\Bolao\Enums\PayoutCategory;
use App\Domain\Bolao\Enums\RoundStatus;
use App\Domain\Bolao\Events\RodadaEncerrada;
use App\Domain\Bolao\Services\RankingService;
use App\Domain\Bolao\Services\RateioService;
use App\Models\Bet;
use App\Models\Draw;
use App\Models\Round;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class EncerrarRodada
{
    public function __construct(
        private readonly RankingService $ranking,
        private readonly RateioService $rateio,
    ) {}

    /**
     * Encerra a rodada e registra os payouts. Com $closingDraw, o
     * encerramento veio de cartelas que fecharam 10 naquele sorteio;
     * sem ele, o limite de sorteios foi atingido e vale a
     * no_winner_policy da rodada.
     */
    public function handle(Round $round, ?Draw $closingDraw = null, ?User $actor = null): RateioResultado
    {
        return DB::transaction(function () use ($round, $closingDraw): RateioResultado {
            $ordered = $this->ranking->orderedBets($round);

            /** @var \Illuminate\Support\Collection<int, Bet> $mainWinners */
            $mainWinners = $ordered->filter(fn (Bet $bet): bool => $bet->hits_count === 10)->values();

            $payMain = true;

            if ($mainWinners->isEmpty()) {
                if ($round->no_winner_policy === NoWinnerPolicy::HighestScore) {
                    $mainWinners = $ordered->take(1)->values();
                } else {
                    $payMain = false;
                }
            }

            $winnerIds = $mainWinners->pluck('id');
            $second = $ordered->reject(fn (Bet $bet): bool => $winnerIds->contains($bet->id))->first();

            $resultado = $this->rateio->ratear(
                $round,
                $mainWinners->count(),
                $second !== null ? 1 : 0,
                $payMain,
            );

            if ($payMain) {
                foreach ($mainWinners as $winner) {
                    $round->payouts()->create([
                        'bet_id' => $winner->id,
                        'category' => PayoutCategory::Main,
                        'position' => 1,
                        'amount_cents' => $resultado->cotaPrincipalCents,
                    ]);
                }
            }

            if ($second !== null && $resultado->cotaSegundoCents > 0) {
                $round->payouts()->create([
                    'bet_id' => $second->id,
                    'category' => PayoutCategory::Second,
                    'position' => 2,
                    'amount_cents' => $resultado->cotaSegundoCents,
                ]);
            }

            $round->update([
                'status' => RoundStatus::Closed,
                'closed_at' => now(),
            ]);

            RodadaEncerrada::dispatch($round);

            return $resultado;
        });
    }
}
