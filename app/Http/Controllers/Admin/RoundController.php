<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Bolao\Actions\AbrirRodada;
use App\Domain\Bolao\Actions\CancelarRodada;
use App\Domain\Bolao\Actions\CriarRodada;
use App\Domain\Bolao\Actions\EncerrarRodada;
use App\Domain\Bolao\Data\RodadaData;
use App\Domain\Bolao\Enums\BetStatus;
use App\Domain\Bolao\Enums\NoWinnerPolicy;
use App\Domain\Bolao\Enums\RoundStatus;
use App\Domain\Bolao\Exceptions\BolaoException;
use App\Domain\Bolao\Services\RankingService;
use App\Domain\Bolao\Services\RateioService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MotivoRequest;
use App\Http\Requests\Admin\StoreRoundRequest;
use App\Models\Round;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoundController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Rounds/Index', [
            'rodadas' => Round::query()
                ->latest('id')
                ->get()
                ->map(fn (Round $round): array => [
                    'uuid' => $round->uuid,
                    'nome' => $round->name,
                    'status' => $round->status->value,
                    'statusLabel' => $round->status->label(),
                    'inicio' => $round->starts_on->toDateString(),
                    'valorCents' => $round->bet_amount_cents,
                    'apostasPagas' => $round->bets()->where('status', BetStatus::Paid)->count(),
                    'sorteios' => $round->draws()->count(),
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Rounds/Create');
    }

    public function store(StoreRoundRequest $request, CriarRodada $criarRodada): RedirectResponse
    {
        $round = $criarRodada->handle(new RodadaData(
            name: $request->string('name')->toString(),
            startsOn: CarbonImmutable::parse($request->string('starts_on')->toString()),
            betAmountCents: (int) $request->integer('bet_amount_cents'),
            betsCloseAt: $request->filled('bets_close_at')
                ? CarbonImmutable::parse($request->string('bets_close_at')->toString())
                : null,
            pctMain: $request->integer('pct_main'),
            pctSecond: $request->integer('pct_second'),
            pctAdmin: $request->integer('pct_admin'),
            maxDraws: $request->integer('max_draws'),
            maxBetsPerPerson: $request->integer('max_bets_per_person'),
            minPaidBets: $request->integer('min_paid_bets'),
            noWinnerPolicy: NoWinnerPolicy::from($request->string('no_winner_policy')->toString()),
            rolloverInCents: (int) $request->integer('rollover_in_cents'),
        ), $request->user());

        return redirect()
            ->route('admin.rodadas.show', $round)
            ->with('sucesso', "Rodada \"{$round->name}\" criada como rascunho.");
    }

    public function show(Round $round, RankingService $ranking, RateioService $rateio): Response
    {
        return Inertia::render('Admin/Rounds/Show', [
            'rodada' => [
                'uuid' => $round->uuid,
                'nome' => $round->name,
                'status' => $round->status->value,
                'statusLabel' => $round->status->label(),
                'inicio' => $round->starts_on->toDateString(),
                'encerramentoApostas' => $round->bets_close_at->toIso8601String(),
                'valorCents' => $round->bet_amount_cents,
                'pctMain' => $round->pct_main,
                'pctSecond' => $round->pct_second,
                'pctAdmin' => $round->pct_admin,
                'maxSorteios' => $round->max_draws,
                'politicaSemVencedor' => $round->no_winner_policy->label(),
                'rolloverCents' => $round->rollover_in_cents,
                'poteCents' => $rateio->poteCents($round),
                'apostasPagas' => $round->bets()->where('status', BetStatus::Paid)->count(),
                'apostasPendentes' => $round->bets()->where('status', BetStatus::AwaitingPayment)->count(),
            ],
            'sorteios' => $round->draws()
                ->orderByDesc('sequence')
                ->get()
                ->map(fn ($draw): array => [
                    'id' => $draw->id,
                    'concurso' => $draw->contest_number,
                    'data' => $draw->drawn_on->toDateString(),
                    'dezenas' => $draw->numbers,
                    'sequencia' => $draw->sequence,
                    'corrigidoEm' => $draw->corrected_at?->toIso8601String(),
                    'motivoCorrecao' => $draw->correction_reason,
                ]),
            'ranking' => array_map(
                fn ($item): array => $item->toArray(),
                $ranking->ranking($round),
            ),
            'payouts' => $round->payouts()
                ->with('bet.bettor')
                ->get()
                ->map(fn ($payout): array => [
                    'id' => $payout->id,
                    'categoria' => $payout->category->label(),
                    'nome' => $payout->bet->bettor->name,
                    'valorCents' => $payout->amount_cents,
                    'pagoEm' => $payout->paid_at?->toIso8601String(),
                    'observacoes' => $payout->notes,
                ]),
        ]);
    }

    public function abrir(Round $round, Request $request, AbrirRodada $abrirRodada): RedirectResponse
    {
        try {
            $abrirRodada->handle($round, $request->user());
        } catch (BolaoException $e) {
            return back()->with('erro', $e->getMessage());
        }

        return back()->with('sucesso', 'Rodada aberta: apostas liberadas.');
    }

    public function cancelar(MotivoRequest $request, Round $round, CancelarRodada $cancelarRodada): RedirectResponse
    {
        try {
            $cancelarRodada->handle($round, $request->string('motivo')->toString(), $request->user());
        } catch (BolaoException $e) {
            return back()->with('erro', $e->getMessage());
        }

        return back()->with('sucesso', 'Rodada cancelada.');
    }

    public function encerrar(Round $round, Request $request, EncerrarRodada $encerrarRodada): RedirectResponse
    {
        if ($round->status !== RoundStatus::Running) {
            return back()->with('erro', 'Só rodadas em andamento podem ser encerradas manualmente.');
        }

        $encerrarRodada->handle($round, null, $request->user());

        return back()->with('sucesso', 'Rodada encerrada e prêmios calculados.');
    }
}
