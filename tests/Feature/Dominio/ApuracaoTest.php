<?php

use App\Domain\Bolao\Enums\BetStatus;
use App\Models\Bet;
use App\Models\Round;

test('pontuação é cumulativa ao longo de vários sorteios', function () {
    $round = Round::factory()->emAndamento()->create();
    $bet = Bet::factory()->paga()
        ->comNumeros([5, 10, 15, 20, 25, 30, 35, 40, 45, 50])
        ->for($round)
        ->create();

    $draw1 = publicarSorteio($round, [5, 10, 15, 2, 3, 4]);
    expect($bet->refresh()->hits_count)->toBe(3);

    $draw2 = publicarSorteio($round, [20, 25, 1, 6, 7, 8]);
    expect($bet->refresh()->hits_count)->toBe(5);

    $matched = $bet->betNumbers()->whereNotNull('matched_draw_id')->pluck('matched_draw_id', 'number');
    expect($matched[5])->toBe($draw1->id)
        ->and($matched[10])->toBe($draw1->id)
        ->and($matched[15])->toBe($draw1->id)
        ->and($matched[20])->toBe($draw2->id)
        ->and($matched[25])->toBe($draw2->id);
});

test('dezena repetida em concurso posterior não pontua duas vezes', function () {
    $round = Round::factory()->emAndamento()->create();
    $bet = Bet::factory()->paga()
        ->comNumeros([5, 10, 15, 20, 25, 30, 35, 40, 45, 50])
        ->for($round)
        ->create();

    $draw1 = publicarSorteio($round, [5, 10, 1, 2, 3, 4]);
    publicarSorteio($round, [5, 10, 6, 7, 8, 9]);

    expect($bet->refresh()->hits_count)->toBe(2)
        ->and($bet->betNumbers()->where('number', 5)->value('matched_draw_id'))->toBe($draw1->id);
});

test('publicar o mesmo concurso duas vezes não altera nada', function () {
    $round = Round::factory()->emAndamento()->create();
    $bet = Bet::factory()->paga()
        ->comNumeros([5, 10, 15, 20, 25, 30, 35, 40, 45, 50])
        ->for($round)
        ->create();

    $draw = publicarSorteio($round, [5, 10, 15, 2, 3, 4], concurso: 2850);
    $again = publicarSorteio($round, [5, 10, 15, 2, 3, 4], concurso: 2850);

    expect($again->id)->toBe($draw->id)
        ->and($round->draws()->count())->toBe(1)
        ->and($bet->refresh()->hits_count)->toBe(3);
});

test('apostas que não estão pagas não pontuam', function () {
    $round = Round::factory()->emAndamento()->create();
    $numbers = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

    $aguardando = Bet::factory()->comNumeros($numbers)->for($round)->create();
    $foraDoPrazo = Bet::factory()->comNumeros($numbers)->for($round)
        ->create(['status' => BetStatus::PaidLate, 'paid_at' => now()]);
    $paga = Bet::factory()->paga()->comNumeros($numbers)->for($round)->create();

    publicarSorteio($round, [5, 10, 15, 2, 3, 4]);

    expect($aguardando->refresh()->hits_count)->toBe(0)
        ->and($foraDoPrazo->refresh()->hits_count)->toBe(0)
        ->and($paga->refresh()->hits_count)->toBe(3);
});
