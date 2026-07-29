<?php

namespace App\Domain\Bolao\Services;

use App\Domain\Bolao\Data\RateioResultado;
use App\Domain\Bolao\Enums\BetStatus;
use App\Models\Round;

class RateioService
{
    /**
     * Pote = soma das apostas pagas + valor herdado da rodada anterior.
     */
    public function poteCents(Round $round): int
    {
        $paid = (int) $round->bets()
            ->where('status', BetStatus::Paid)
            ->sum('amount_cents');

        return $paid + $round->rollover_in_cents;
    }

    /**
     * Divide o pote. Tudo em centavos inteiros; toda sobra de qualquer
     * divisão vai para a administração. Com $payMain = false (política
     * rollover), o prêmio principal inteiro sai como rolloverOutCents.
     *
     * Invariante: cotas pagas + administração + rollover de saída == pote.
     */
    public function ratear(
        Round $round,
        int $mainWinners,
        int $secondWinners,
        bool $payMain = true,
    ): RateioResultado {
        $pote = $this->poteCents($round);

        $premioPrincipal = intdiv($pote * $round->pct_main, 100);
        $premioSegundo = intdiv($pote * $round->pct_second, 100);

        $cotaPrincipal = ($payMain && $mainWinners > 0)
            ? intdiv($premioPrincipal, $mainWinners)
            : 0;
        $cotaSegundo = $secondWinners > 0
            ? intdiv($premioSegundo, $secondWinners)
            : 0;

        $rolloverOut = $payMain ? 0 : $premioPrincipal;

        $administracao = $pote
            - ($cotaPrincipal * $mainWinners)
            - ($cotaSegundo * $secondWinners)
            - $rolloverOut;

        return new RateioResultado(
            poteCents: $pote,
            premioPrincipalCents: $premioPrincipal,
            cotaPrincipalCents: $cotaPrincipal,
            ganhadoresPrincipal: $payMain ? $mainWinners : 0,
            premioSegundoCents: $premioSegundo,
            cotaSegundoCents: $cotaSegundo,
            ganhadoresSegundo: $secondWinners,
            administracaoCents: $administracao,
            rolloverOutCents: $rolloverOut,
        );
    }
}
