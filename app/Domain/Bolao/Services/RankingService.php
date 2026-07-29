<?php

namespace App\Domain\Bolao\Services;

use App\Domain\Bolao\Data\RankingItemData;
use App\Domain\Bolao\Enums\BetStatus;
use App\Models\Bet;
use App\Models\Round;
use App\Support\PhoneMask;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class RankingService
{
    /**
     * Cartelas pagas da rodada na ordem oficial de classificação:
     * 1. mais pontos; 2. último ponto conquistado no sorteio mais antigo;
     * 3. pagamento confirmado primeiro; 4. nome do apostador.
     *
     * @return Collection<int, Bet>
     */
    public function orderedBets(Round $round): Collection
    {
        return Bet::query()
            ->where('bets.round_id', $round->id)
            ->where('bets.status', BetStatus::Paid)
            ->join('bettors', 'bettors.id', '=', 'bets.bettor_id')
            ->leftJoin('bet_numbers as bn', function ($join): void {
                $join->on('bn.bet_id', '=', 'bets.id')->whereNotNull('bn.matched_draw_id');
            })
            ->groupBy('bets.id', 'bets.hits_count', 'bets.paid_at', 'bettors.name')
            ->orderByDesc('bets.hits_count')
            ->orderByRaw('COALESCE(MAX(bn.matched_draw_id), 18446744073709551615) ASC')
            ->orderBy('bets.paid_at')
            ->orderBy('bettors.name')
            ->select('bets.*')
            ->with(['bettor', 'betNumbers'])
            ->get();
    }

    /**
     * Ranking pronto para exibição pública: nome de exibição,
     * telefone mascarado e as 10 bolas com o sorteio que as acendeu.
     *
     * @return list<RankingItemData>
     */
    public function ranking(Round $round): array
    {
        $bets = $this->orderedBets($round);
        $displayNames = $this->displayNames($bets);

        return $bets->values()->map(function (Bet $bet, int $index) use ($displayNames): RankingItemData {
            return new RankingItemData(
                position: $index + 1,
                betUuid: $bet->uuid,
                displayName: $displayNames[$bet->id],
                maskedPhone: PhoneMask::mask($bet->bettor->phone),
                numbers: $bet->betNumbers
                    ->sortBy('number')
                    ->values()
                    ->map(fn ($n): array => [
                        'number' => $n->number,
                        'matchedDrawId' => $n->matched_draw_id,
                    ])
                    ->all(),
                hitsCount: $bet->hits_count,
            );
        })->all();
    }

    /**
     * Primeiro nome; com homônimos na rodada, primeiro nome + inicial
     * do sobrenome ("Rafael S.", "Rafael M.").
     *
     * @param  Collection<int, Bet>  $bets
     * @return array<int, string>
     */
    private function displayNames(Collection $bets): array
    {
        $firstNames = $bets->map(
            fn (Bet $bet): string => str($bet->bettor->name)->trim()->explode(' ')->first() ?? '',
        );

        $duplicated = $firstNames->countBy()->filter(fn (int $count): bool => $count > 1)->keys();

        return $bets->mapWithKeys(function (Bet $bet) use ($duplicated): array {
            $parts = str($bet->bettor->name)->trim()->explode(' ')->filter()->values();
            $first = $parts->first() ?? '';

            if ($duplicated->contains($first) && $parts->count() > 1) {
                $initial = mb_strtoupper(mb_substr((string) $parts->get(1), 0, 1));

                return [$bet->id => "{$first} {$initial}."];
            }

            return [$bet->id => $first];
        })->all();
    }
}
