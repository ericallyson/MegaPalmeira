<?php

use App\Domain\Bolao\Actions\CorrigirSorteio;
use App\Domain\Bolao\Exceptions\MotivoObrigatorio;
use App\Models\Bet;
use App\Models\Round;
use App\Models\User;

test('correção de sorteio recalcula a rodada inteira', function () {
    $round = Round::factory()->emAndamento()->create();
    $bet = Bet::factory()->paga()
        ->comNumeros([5, 10, 15, 20, 25, 30, 35, 40, 45, 50])
        ->for($round)
        ->create();

    $draw1 = publicarSorteio($round, [5, 10, 15, 2, 3, 4]);
    $draw2 = publicarSorteio($round, [20, 25, 1, 6, 7, 8]);
    expect($bet->refresh()->hits_count)->toBe(5);

    // o admin errou: o concurso 1 na verdade não teve o 15, teve o 30
    app(CorrigirSorteio::class)->handle(
        $draw1,
        [5, 10, 30, 2, 3, 4],
        'Dezena digitada errada: era 30, não 15',
        User::factory()->admin()->create(),
    );

    expect($bet->refresh()->hits_count)->toBe(5)
        ->and($bet->betNumbers()->where('number', 15)->value('matched_draw_id'))->toBeNull()
        ->and($bet->betNumbers()->where('number', 30)->value('matched_draw_id'))->toBe($draw1->id)
        ->and($bet->betNumbers()->where('number', 20)->value('matched_draw_id'))->toBe($draw2->id)
        ->and($draw1->refresh()->corrected_at)->not->toBeNull()
        ->and($draw1->correction_reason)->toBe('Dezena digitada errada: era 30, não 15');
});

test('correção sem motivo é rejeitada', function () {
    $round = Round::factory()->emAndamento()->create();
    $draw = publicarSorteio($round, [5, 10, 15, 2, 3, 4]);

    app(CorrigirSorteio::class)->handle($draw, [5, 10, 30, 2, 3, 4], '  ', User::factory()->admin()->create());
})->throws(MotivoObrigatorio::class);
