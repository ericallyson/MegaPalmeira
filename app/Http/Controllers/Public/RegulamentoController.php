<?php

namespace App\Http\Controllers\Public;

use App\Domain\Bolao\Enums\RoundStatus;
use App\Http\Controllers\Controller;
use App\Models\Round;
use Inertia\Inertia;
use Inertia\Response;

class RegulamentoController extends Controller
{
    public function __invoke(): Response
    {
        $round = Round::query()
            ->whereIn('status', [RoundStatus::Open, RoundStatus::Running])
            ->latest('id')
            ->first();

        return Inertia::render('Public/Regulamento', [
            'versao' => $round === null ? '1.0' : $round->rules_version,
            'rodada' => $round === null ? null : [
                'nome' => $round->name,
                'pctMain' => $round->pct_main,
                'pctSecond' => $round->pct_second,
                'pctAdmin' => $round->pct_admin,
                'maxSorteios' => $round->max_draws,
                'maxCartelasPorPessoa' => $round->max_bets_per_person,
                'politicaSemVencedor' => $round->no_winner_policy->value,
            ],
        ]);
    }
}
