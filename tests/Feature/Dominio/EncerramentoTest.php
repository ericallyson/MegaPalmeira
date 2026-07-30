<?php

use App\Domain\Bolao\Enums\NoWinnerPolicy;
use App\Domain\Bolao\Enums\PayoutCategory;
use App\Domain\Bolao\Enums\RoundStatus;
use App\Domain\Bolao\Exceptions\RodadaNaoAceitaSorteios;
use App\Models\Bet;
use App\Models\Round;

test('rodada encerra no sorteio em que alguém atinge 10 pontos e recusa novos sorteios', function () {
    $round = Round::factory()->emAndamento()->create();
    $vencedora = Bet::factory()->paga()
        ->comNumeros([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        ->for($round)
        ->create();
    Bet::factory()->paga()->comNumeros([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])->for($round)->create();

    publicarSorteio($round, [1, 2, 3, 4, 5, 6]);
    expect($round->refresh()->status)->toBe(RoundStatus::Running);

    $decisivo = publicarSorteio($round, [7, 8, 9, 10, 59, 60]);

    expect($round->refresh()->status)->toBe(RoundStatus::Closed)
        ->and($round->closed_at)->not->toBeNull()
        ->and($vencedora->refresh()->hits_count)->toBe(10)
        ->and($vencedora->completed_at_draw_id)->toBe($decisivo->id);

    publicarSorteio($round, [21, 22, 23, 24, 25, 26]);
})->throws(RodadaNaoAceitaSorteios::class);

test('sem limite de sorteios (default), a rodada segue aberta até alguém fechar 10', function () {
    $round = Round::factory()->emAndamento()->create(['max_draws' => 0]);
    Bet::factory()->paga()->comNumeros([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])->for($round)->create();

    // 20 sorteios sem ninguém fechar: nada encerra
    $dezenas = [[11, 12, 13, 14, 15, 16], [17, 18, 19, 20, 21, 22], [23, 24, 25, 26, 27, 28]];
    for ($i = 0; $i < 20; $i++) {
        publicarSorteio($round, $dezenas[$i % 3], concurso: 3000 + $i);
    }

    expect($round->refresh()->status)->toBe(RoundStatus::Running)
        ->and($round->draws()->count())->toBe(20);

    // aí alguém fecha: encerra na hora
    publicarSorteio($round, [1, 2, 3, 4, 5, 6], concurso: 3100);
    publicarSorteio($round, [7, 8, 9, 10, 59, 60], concurso: 3101);

    expect($round->refresh()->status)->toBe(RoundStatus::Closed);
});

test('limite de sorteios sem vencedor com highest_score premia a maior pontuação', function () {
    $round = Round::factory()->emAndamento()->create(['max_draws' => 2]);
    $lider = Bet::factory()->paga()
        ->comNumeros([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        ->for($round)
        ->create();
    Bet::factory()->paga()->comNumeros([1, 2, 51, 52, 53, 54, 55, 56, 57, 58])->for($round)->create();

    publicarSorteio($round, [1, 2, 3, 4, 5, 6]);
    publicarSorteio($round, [7, 8, 41, 42, 43, 44]);

    $round->refresh();
    expect($round->status)->toBe(RoundStatus::Closed);

    $mainPayout = $round->payouts()->where('category', PayoutCategory::Main)->first();
    expect($mainPayout)->not->toBeNull()
        ->and($mainPayout->bet_id)->toBe($lider->id);
});

test('limite de sorteios sem vencedor com rollover não paga o prêmio principal', function () {
    $round = Round::factory()->emAndamento()->create([
        'max_draws' => 1,
        'no_winner_policy' => NoWinnerPolicy::Rollover,
    ]);
    Bet::factory()->paga()->comNumeros([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])->for($round)->create();
    Bet::factory()->paga()->comNumeros([1, 2, 51, 52, 53, 54, 55, 56, 57, 58])->for($round)->create();

    publicarSorteio($round, [1, 2, 3, 40, 41, 42]);

    $round->refresh();
    expect($round->status)->toBe(RoundStatus::Closed)
        ->and($round->payouts()->where('category', PayoutCategory::Main)->count())->toBe(0)
        ->and($round->payouts()->where('category', PayoutCategory::Second)->count())->toBe(1);
});

test('N ganhadores no mesmo sorteio dividem o prêmio principal', function () {
    $round = Round::factory()->emAndamento()->create();
    $numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    $ganhadoras = Bet::factory()->count(2)->paga()->comNumeros($numbers)->for($round)->create();
    Bet::factory()->paga()->comNumeros([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])->for($round)->create();

    publicarSorteio($round, [1, 2, 3, 4, 5, 6]);
    publicarSorteio($round, [7, 8, 9, 10, 59, 60]);

    $round->refresh();
    $mainPayouts = $round->payouts()->where('category', PayoutCategory::Main)->get();

    // pote 3 × 2000 = 6000 → prêmio principal 70% = 4200 → 2100 para cada
    expect($mainPayouts)->toHaveCount(2)
        ->and($mainPayouts->pluck('bet_id')->sort()->values()->all())
        ->toBe($ganhadoras->pluck('id')->sort()->values()->all())
        ->and($mainPayouts->pluck('amount_cents')->unique()->all())->toBe([2100]);
});
