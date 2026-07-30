<?php

namespace App\Http\Controllers\Public;

use App\Domain\Bolao\Enums\RoundStatus;
use App\Domain\Bolao\Services\SnapshotService;
use App\Http\Controllers\Controller;
use App\Models\Round;
use Illuminate\Http\JsonResponse;

class RankingApiController extends Controller
{
    /**
     * Fallback de polling quando o WebSocket não conecta:
     * o placar nunca fica mudo.
     */
    public function __invoke(SnapshotService $snapshot): JsonResponse
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
            return response()->json(['rodada' => null]);
        }

        return response()->json($snapshot->publicSnapshot($round));
    }
}
