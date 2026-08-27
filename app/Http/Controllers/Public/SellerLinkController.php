<?php

namespace App\Http\Controllers\Public;

use App\Domain\Bolao\Enums\RoundStatus;
use App\Domain\Bolao\Services\SnapshotService;
use App\Http\Controllers\Controller;
use App\Models\Round;
use App\Models\Seller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Link do vendedor: mostra o mesmo acompanhamento da rodada (todos os
 * jogos, de todos os vendedores), mas troca o link do grupo pelo grupo
 * do vendedor e marca a sessão para atribuir a ele as apostas feitas a
 * partir daqui.
 */
class SellerLinkController extends Controller
{
    public function __invoke(Request $request, Seller $seller, SnapshotService $snapshot): Response
    {
        $request->session()->put('seller_link_id', $seller->id);

        $round = Round::query()
            ->whereIn('status', [RoundStatus::Open, RoundStatus::Running])
            ->latest('id')
            ->first()
            ?? Round::query()
                ->where('status', RoundStatus::Closed)
                ->latest('closed_at')
                ->first();

        $vendedor = [
            'nome' => $seller->name,
            'grupoUrl' => $seller->group_url,
        ];

        if ($round === null) {
            return Inertia::render('Public/Home', [
                'rodada' => null,
                'sorteios' => [],
                'ranking' => [],
                'ganhadores' => [],
                'vendedor' => $vendedor,
            ]);
        }

        $dados = $snapshot->publicSnapshot($round);

        // O grupo do vendedor tem prioridade sobre o grupo geral da rodada.
        if ($seller->group_url !== null) {
            $dados['rodada']['whatsappGroupUrl'] = $seller->group_url;
        }

        $dados['vendedor'] = $vendedor;

        return Inertia::render('Public/Home', $dados);
    }
}
