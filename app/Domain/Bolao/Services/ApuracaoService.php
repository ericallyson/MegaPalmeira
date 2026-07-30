<?php

namespace App\Domain\Bolao\Services;

use App\Domain\Bolao\Data\PreviaSorteioData;
use App\Domain\Bolao\Enums\BetStatus;
use App\Models\Bet;
use App\Models\Draw;
use App\Models\Round;
use Illuminate\Support\Facades\DB;

class ApuracaoService
{
    /**
     * Acende as bolas do sorteio nas cartelas pagas da rodada.
     * Dezena já acesa (matched_draw_id preenchido) nunca é remarcada,
     * o que torna a apuração idempotente e a pontuação monotônica.
     */
    public function apurar(Round $round, Draw $draw): void
    {
        DB::table('bet_numbers')
            ->join('bets', 'bets.id', '=', 'bet_numbers.bet_id')
            ->where('bets.round_id', $round->id)
            ->where('bets.status', BetStatus::Paid->value)
            ->whereIn('bet_numbers.number', $draw->numbers)
            ->whereNull('bet_numbers.matched_draw_id')
            ->update(['bet_numbers.matched_draw_id' => $draw->id]);

        $this->recontarHits($round);

        DB::table('bets')
            ->where('round_id', $round->id)
            ->where('status', BetStatus::Paid->value)
            ->where('hits_count', 10)
            ->whereNull('completed_at_draw_id')
            ->update(['completed_at_draw_id' => $draw->id]);
    }

    /**
     * Reapura uma única cartela contra todos os sorteios já publicados,
     * na ordem de sequence. Usada quando uma aposta vira "paga" depois
     * de sorteios já lançados (baixa manual, reconciliação).
     */
    public function apurarAposta(Bet $bet): void
    {
        $draws = $bet->round()->firstOrFail()->draws()->orderBy('sequence')->get();

        foreach ($draws as $draw) {
            DB::table('bet_numbers')
                ->where('bet_id', $bet->id)
                ->whereIn('number', $draw->numbers)
                ->whereNull('matched_draw_id')
                ->update(['matched_draw_id' => $draw->id]);
        }

        $hits = $bet->betNumbers()->whereNotNull('matched_draw_id')->count();

        $bet->forceFill([
            'hits_count' => $hits,
            'completed_at_draw_id' => $hits === 10
                ? $bet->betNumbers()->max('matched_draw_id')
                : null,
        ])->save();
    }

    /**
     * Simula o impacto de um sorteio sem persistir nada.
     *
     * @param  list<int>  $numbers
     */
    public function previa(Round $round, array $numbers, RateioService $rateio): PreviaSorteioData
    {
        $novosAcertos = DB::table('bet_numbers')
            ->join('bets', 'bets.id', '=', 'bet_numbers.bet_id')
            ->where('bets.round_id', $round->id)
            ->where('bets.status', BetStatus::Paid->value)
            ->whereIn('bet_numbers.number', $numbers)
            ->whereNull('bet_numbers.matched_draw_id')
            ->groupBy('bet_numbers.bet_id', 'bets.hits_count')
            ->select('bet_numbers.bet_id', 'bets.hits_count', DB::raw('COUNT(*) as novos'))
            ->get();

        $chegamADez = $novosAcertos->filter(
            fn (object $row): bool => (int) $row->hits_count + (int) $row->novos >= 10,
        )->count();

        $seraEncerrada = $chegamADez > 0
            || ($round->max_draws > 0 && $round->draws()->count() + 1 >= $round->max_draws);

        $poteCents = $rateio->poteCents($round);
        $premioPrincipal = intdiv($poteCents * $round->pct_main, 100);

        return new PreviaSorteioData(
            cartelasQuePontuam: $novosAcertos->count(),
            cartelasQueChegamADez: $chegamADez,
            rodadaSeraEncerrada: $seraEncerrada,
            premioPrincipalCents: $premioPrincipal,
            cotaPorGanhadorCents: $chegamADez > 0 ? intdiv($premioPrincipal, $chegamADez) : $premioPrincipal,
        );
    }

    private function recontarHits(Round $round): void
    {
        DB::update(
            'UPDATE bets SET hits_count = (
                SELECT COUNT(*) FROM bet_numbers
                WHERE bet_numbers.bet_id = bets.id
                  AND bet_numbers.matched_draw_id IS NOT NULL
            ) WHERE bets.round_id = ? AND bets.status = ?',
            [$round->id, BetStatus::Paid->value],
        );
    }
}
