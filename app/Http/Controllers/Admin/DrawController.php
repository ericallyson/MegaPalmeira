<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Bolao\Actions\CorrigirSorteio;
use App\Domain\Bolao\Actions\PublicarSorteio;
use App\Domain\Bolao\Data\SorteioData;
use App\Domain\Bolao\Exceptions\BolaoException;
use App\Domain\Bolao\Services\ApuracaoService;
use App\Domain\Bolao\Services\RateioService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreDrawRequest;
use App\Models\Draw;
use App\Models\Round;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DrawController extends Controller
{
    /**
     * Prévia obrigatória: simula o impacto do sorteio sem persistir.
     */
    public function previa(
        StoreDrawRequest $request,
        Round $round,
        ApuracaoService $apuracao,
        RateioService $rateio,
    ): JsonResponse {
        /** @var list<int> $numbers */
        $numbers = array_map(intval(...), $request->array('numbers'));

        return response()->json(
            $apuracao->previa($round, $numbers, $rateio)->toArray(),
        );
    }

    public function store(StoreDrawRequest $request, Round $round, PublicarSorteio $publicar): RedirectResponse
    {
        /** @var list<int> $numbers */
        $numbers = array_map(intval(...), $request->array('numbers'));

        try {
            $draw = $publicar->handle($round, new SorteioData(
                contestNumber: $request->integer('contest_number'),
                drawnOn: CarbonImmutable::parse($request->string('drawn_on')->toString()),
                numbers: $numbers,
            ), $request->user());
        } catch (BolaoException $e) {
            return back()->with('erro', $e->getMessage());
        }

        return back()->with('sucesso', "Concurso {$draw->contest_number} publicado e apurado.");
    }

    public function corrigir(Request $request, Draw $draw, CorrigirSorteio $corrigir): RedirectResponse
    {
        $validated = $request->validate([
            'numbers' => ['required', 'array', 'size:6'],
            'numbers.*' => ['required', 'integer', 'between:1,60', 'distinct'],
            'motivo' => ['required', 'string', 'min:5', 'max:255'],
        ], [
            'motivo.required' => 'Informe o motivo da correção. Ele aparece na página pública.',
        ]);

        try {
            $corrigir->handle(
                $draw,
                array_map(intval(...), $validated['numbers']),
                $validated['motivo'],
                $request->user(),
            );
        } catch (BolaoException $e) {
            return back()->with('erro', $e->getMessage());
        }

        return back()->with('sucesso', "Concurso {$draw->contest_number} corrigido e rodada recalculada.");
    }
}
