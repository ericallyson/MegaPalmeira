<?php

namespace App\Domain\Bolao\Actions;

use App\Domain\Bolao\Services\ApuracaoService;
use App\Models\Round;
use Illuminate\Support\Facades\DB;

class RecalcularRodada
{
    public function __construct(
        private readonly ApuracaoService $apuracao,
    ) {}

    /**
     * Apaga todas as marcações da rodada e reapura sorteio a sorteio,
     * na ordem de sequence. Usada após correção de um sorteio publicado.
     */
    public function handle(Round $round): void
    {
        DB::transaction(function () use ($round): void {
            /** @var Round $round */
            $round = Round::query()->whereKey($round->id)->lockForUpdate()->firstOrFail();

            DB::table('bet_numbers')
                ->join('bets', 'bets.id', '=', 'bet_numbers.bet_id')
                ->where('bets.round_id', $round->id)
                ->update(['bet_numbers.matched_draw_id' => null]);

            DB::table('bets')
                ->where('round_id', $round->id)
                ->update(['hits_count' => 0, 'completed_at_draw_id' => null]);

            foreach ($round->draws()->orderBy('sequence')->get() as $draw) {
                $this->apuracao->apurar($round, $draw);
            }
        });
    }
}
