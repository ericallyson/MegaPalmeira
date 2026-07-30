<?php

namespace App\Domain\Bolao\Services;

use App\Domain\Bolao\Enums\BetStatus;
use App\Models\Draw;
use App\Models\Payout;
use App\Models\Round;
use Illuminate\Support\Facades\Cache;

class SnapshotService
{
    public function __construct(
        private readonly RankingService $ranking,
        private readonly RateioService $rateio,
    ) {}

    /**
     * Retrato público completo da rodada: é o que a home renderiza,
     * o que o WebSocket transmite e o que o polling de fallback lê.
     * Nunca contém telefone sem máscara.
     *
     * @return array<string, mixed>
     */
    public function publicSnapshot(Round $round): array
    {
        $pote = $this->rateio->poteCents($round);

        return [
            'rodada' => [
                'uuid' => $round->uuid,
                'nome' => $round->name,
                'status' => $round->status->value,
                'statusLabel' => $round->status->label(),
                'poteCents' => $pote,
                'premioPrincipalCents' => intdiv($pote * $round->pct_main, 100),
                'valorCartelaCents' => $round->bet_amount_cents,
                'cartelasPagas' => $round->bets()->where('status', BetStatus::Paid)->count(),
                'encerramentoApostas' => $round->bets_close_at->toIso8601String(),
                'sorteiosPublicados' => $round->draws()->count(),
                'maxSorteios' => $round->max_draws,
                'rolloverCents' => $round->rollover_in_cents,
                'encerradaEm' => $round->closed_at?->toIso8601String(),
            ],
            'sorteios' => $round->draws()
                ->orderByDesc('sequence')
                ->get()
                ->map(fn (Draw $draw): array => [
                    'id' => $draw->id,
                    'concurso' => $draw->contest_number,
                    'data' => $draw->drawn_on->toDateString(),
                    'dezenas' => $draw->numbers,
                    'corrigidoEm' => $draw->corrected_at?->toIso8601String(),
                    'motivoCorrecao' => $draw->correction_reason,
                ])
                ->all(),
            'ranking' => $this->cachedRanking($round),
            'ganhadores' => $round->payouts()
                ->with('bet.bettor')
                ->get()
                ->map(fn (Payout $payout): array => [
                    'categoria' => $payout->category->label(),
                    'nome' => (string) str($payout->bet->bettor->name)->trim()->explode(' ')->first(),
                    'valorCents' => $payout->amount_cents,
                ])
                ->all(),
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function cachedRanking(Round $round): array
    {
        /** @var list<array<string, mixed>> */
        return Cache::remember(
            "rodada:{$round->id}:ranking",
            now()->addMinutes(10),
            fn (): array => array_map(
                fn ($item): array => $item->toArray(),
                $this->ranking->ranking($round),
            ),
        );
    }
}
