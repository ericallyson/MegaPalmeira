<?php

namespace App\Domain\Bolao\Services;

use App\Domain\Bolao\Data\RankingItemData;
use App\Domain\Bolao\Enums\BetStatus;
use App\Models\Bet;
use App\Models\Round;
use App\Support\PhoneMask;
use Illuminate\Support\Collection;

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
        // O "último ponto conquistado" vem de uma subquery escalar
        // correlacionada, em vez de join + GROUP BY: assim não dependemos
        // de o servidor reconhecer a dependência funcional da PK
        // (ONLY_FULL_GROUP_BY estrito no MySQL/MariaDB de produção).
        $ultimoPonto = 'COALESCE((select max(bn.matched_draw_id) from bet_numbers as bn '
            .'where bn.bet_id = bets.id and bn.matched_draw_id is not null), 18446744073709551615)';

        return Bet::query()
            ->where('bets.round_id', $round->id)
            ->where('bets.status', BetStatus::Paid)
            ->join('bettors', 'bettors.id', '=', 'bets.bettor_id')
            ->orderByDesc('bets.hits_count')
            ->orderByRaw($ultimoPonto.' ASC')
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
