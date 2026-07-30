<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Bolao\Enums\RoundStatus;
use App\Domain\Bolao\Services\RelatorioService;
use App\Http\Controllers\Controller;
use App\Models\Round;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class RelatorioController extends Controller
{
    public function show(Round $round, RelatorioService $service): Response|RedirectResponse
    {
        if (! in_array($round->status, [RoundStatus::Closed, RoundStatus::Canceled], true)) {
            return redirect()
                ->route('admin.rodadas.show', $round)
                ->with('erro', 'O relatório de fechamento só existe para rodadas encerradas ou canceladas.');
        }

        $relatorio = $service->gerar($round);

        return Inertia::render('Admin/Rounds/Relatorio', [
            'rodadaUuid' => $round->uuid,
            'relatorio' => $relatorio,
            'hash' => $service->hash($relatorio),
        ]);
    }

    public function csv(Round $round, RelatorioService $service): HttpResponse|RedirectResponse
    {
        if (! in_array($round->status, [RoundStatus::Closed, RoundStatus::Canceled], true)) {
            return redirect()
                ->route('admin.rodadas.show', $round)
                ->with('erro', 'O relatório de fechamento só existe para rodadas encerradas ou canceladas.');
        }

        $csv = $service->csv($service->gerar($round));

        return response("\u{FEFF}".$csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"relatorio-{$round->slug}.csv\"",
        ]);
    }
}
