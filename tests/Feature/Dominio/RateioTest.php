<?php

use App\Domain\Bolao\Services\RateioService;
use App\Models\Bet;
use App\Models\Round;

function rodadaComPote(int $bets, int $amountCents, int $rolloverCents = 0): Round
{
    $round = Round::factory()->emAndamento()->create([
        'bet_amount_cents' => $amountCents,
        'rollover_in_cents' => $rolloverCents,
    ]);

    Bet::factory()->count($bets)->paga()->for($round)->create(['amount_cents' => $amountCents]);

    return $round;
}

test('rateio com 1 ganhador', function () {
    $round = rodadaComPote(3, 2000); // pote 6000

    $r = app(RateioService::class)->ratear($round, mainWinners: 1, secondWinners: 1);

    expect($r->poteCents)->toBe(6000)
        ->and($r->premioPrincipalCents)->toBe(4200)
        ->and($r->cotaPrincipalCents)->toBe(4200)
        ->and($r->cotaSegundoCents)->toBe(900)
        ->and($r->administracaoCents)->toBe(900)
        ->and($r->totalPagoCents() + $r->administracaoCents)->toBe(6000);
});

test('rateio com 2 ganhadores divide a cota igualmente', function () {
    $round = rodadaComPote(3, 2000);

    $r = app(RateioService::class)->ratear($round, mainWinners: 2, secondWinners: 1);

    expect($r->cotaPrincipalCents)->toBe(2100)
        ->and($r->totalPagoCents() + $r->administracaoCents)->toBe(6000);
});

test('rateio com 3 ganhadores manda a sobra de centavos para a administração', function () {
    $round = rodadaComPote(5, 2000); // pote 10000, principal 7000, 7000/3 = 2333 resto 1

    $r = app(RateioService::class)->ratear($round, mainWinners: 3, secondWinners: 1);

    expect($r->cotaPrincipalCents)->toBe(2333)
        ->and($r->administracaoCents)->toBe(10000 - (2333 * 3) - 1500)
        ->and($r->totalPagoCents() + $r->administracaoCents)->toBe(10000);
});

test('invariante fecha exata com valores primos e 3 ganhadores', function () {
    // 3 apostas de R$ 20,03 (primo) + 7 centavos herdados = pote 6016
    $round = rodadaComPote(3, 2003, rolloverCents: 7);

    $r = app(RateioService::class)->ratear($round, mainWinners: 3, secondWinners: 1);

    expect($r->poteCents)->toBe(6016)
        ->and($r->premioPrincipalCents)->toBe(4211)
        ->and($r->cotaPrincipalCents)->toBe(1403)
        ->and($r->cotaSegundoCents)->toBe(902)
        ->and($r->totalPagoCents())->toBe(1403 * 3 + 902)
        ->and($r->totalPagoCents() + $r->administracaoCents)->toBe(6016);
});

test('política rollover retira o prêmio principal do rateio e mantém a conta fechada', function () {
    $round = rodadaComPote(3, 2000); // pote 6000

    $r = app(RateioService::class)->ratear($round, mainWinners: 0, secondWinners: 1, payMain: false);

    expect($r->rolloverOutCents)->toBe(4200)
        ->and($r->cotaPrincipalCents)->toBe(0)
        ->and($r->cotaSegundoCents)->toBe(900)
        ->and($r->totalPagoCents() + $r->administracaoCents + $r->rolloverOutCents)->toBe(6000);
});

test('apostas não pagas ficam fora do pote', function () {
    $round = rodadaComPote(2, 2000);
    Bet::factory()->for($round)->create(['amount_cents' => 2000]); // aguardando pagamento

    expect(app(RateioService::class)->poteCents($round))->toBe(4000);
});

test('pote líquido é o bruto sem a comissão da administração', function () {
    // 3 × 2000 = 6000 bruto; comissão 15% → líquido 5100
    $round = rodadaComPote(3, 2000);

    expect(app(RateioService::class)->poteLiquidoCents($round))->toBe(5100);
});

test('com prêmio único, pote líquido é igual ao prêmio de 10 pontos', function () {
    // pct_main 100, sem 2º lugar e sem comissão → líquido == prêmio principal
    $round = Round::factory()->emAndamento()->create([
        'bet_amount_cents' => 1000,
        'pct_main' => 70,
        'pct_second' => 0,
        'pct_admin' => 30,
    ]);
    Bet::factory()->paga()->for($round)->create(['amount_cents' => 1000]);

    $rateio = app(RateioService::class);
    $premioPrincipal = intdiv($rateio->poteCents($round) * $round->pct_main, 100);

    expect($rateio->poteLiquidoCents($round))
        ->toBe(700)
        ->toBe($premioPrincipal);
});
