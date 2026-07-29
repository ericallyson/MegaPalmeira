<?php

namespace App\Http\Controllers\Public;

use App\Domain\Bolao\Enums\BetStatus;
use App\Domain\Bolao\Enums\RoundStatus;
use App\Domain\Bolao\Services\RankingService;
use App\Domain\Bolao\Services\RateioService;
use App\Http\Controllers\Controller;
use App\Models\Round;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * A home é o acompanhamento da rodada atual: aberta ou em andamento;
     * na falta delas, a última encerrada.
     */
    public function __invoke(RankingService $rankingService, RateioService $rateio): Response
    {
        $round = Round::query()
            ->whereIn('status', [RoundStatus::Open, RoundStatus::Running])
            ->latest('id')
            ->first()
            ?? Round::query()
                ->where('status', RoundStatus::Closed)
                ->latest('closed_at')
                ->first();

        if ($round === null) {
            return Inertia::render('Public/Home', [
                'rodada' => null,
                'sorteios' => [],
                'ranking' => [],
                'ganhadores' => [],
            ]);
        }

        $pote = $rateio->poteCents($round);

        /** @var list<array<string, mixed>> $ranking */
        $ranking = Cache::remember(
            "rodada:{$round->id}:ranking",
            now()->addMinutes(10),
            fn (): array => array_map(
                fn ($item): array => $item->toArray(),
                $rankingService->ranking($round),
            ),
        );

        return Inertia::render('Public/Home', [
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
                ->map(fn ($draw): array => [
                    'id' => $draw->id,
                    'concurso' => $draw->contest_number,
                    'data' => $draw->drawn_on->toDateString(),
                    'dezenas' => $draw->numbers,
                    'corrigidoEm' => $draw->corrected_at?->toIso8601String(),
                    'motivoCorrecao' => $draw->correction_reason,
                ])
                ->all(),
            'ranking' => $ranking,
            'ganhadores' => $round->payouts()
                ->with('bet.bettor')
                ->get()
                ->map(fn ($payout): array => [
                    'categoria' => $payout->category->label(),
                    'nome' => str($payout->bet->bettor->name)->trim()->explode(' ')->first(),
                    'valorCents' => $payout->amount_cents,
                ])
                ->all(),
        ]);
    }
}
