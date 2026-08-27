<?php

namespace App\Http\Controllers\Public;

use App\Domain\Bolao\Enums\RoundStatus;
use App\Domain\Bolao\Services\SnapshotService;
use App\Http\Controllers\Controller;
use App\Models\Round;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * A home é o acompanhamento da rodada atual: aberta ou em andamento;
     * na falta delas, a última encerrada.
     */
    public function __invoke(Request $request, SnapshotService $snapshot): Response
    {
        // A home geral zera o contexto de vendedor: o grupo volta a ser o
        // geral e novas apostas deixam de ser atribuídas a um vendedor.
        $request->session()->forget('seller_link_id');

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

        return Inertia::render('Public/Home', $snapshot->publicSnapshot($round));
    }
}
