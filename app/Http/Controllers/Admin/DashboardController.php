<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Bolao\Enums\BetStatus;
use App\Domain\Bolao\Enums\RoundStatus;
use App\Domain\Bolao\Services\RateioService;
use App\Http\Controllers\Controller;
use App\Models\Round;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(RateioService $rateio): Response
    {
        $round = Round::query()
            ->whereIn('status', [RoundStatus::Open, RoundStatus::Running])
            ->latest('id')
            ->first();

        return Inertia::render('Admin/Dashboard', [
            'rodada' => $round === null ? null : [
                'uuid' => $round->uuid,
                'nome' => $round->name,
                'status' => $round->status->value,
                'statusLabel' => $round->status->label(),
                'poteCents' => $rateio->poteCents($round),
                'premioPrincipalCents' => intdiv($rateio->poteCents($round) * $round->pct_main, 100),
                'apostasPagas' => $round->bets()->where('status', BetStatus::Paid)->count(),
                'apostasPendentes' => $round->bets()->where('status', BetStatus::AwaitingPayment)->count(),
                'apostasForaDoPrazo' => $round->bets()->where('status', BetStatus::PaidLate)->count(),
                'sorteios' => $round->draws()->count(),
                'maxSorteios' => $round->max_draws,
                'encerramentoApostas' => $round->bets_close_at->toIso8601String(),
            ],
            'ultimaEncerrada' => Round::query()
                ->where('status', RoundStatus::Closed)
                ->latest('closed_at')
                ->value('name'),
        ]);
    }
}
