<?php

use App\Domain\Bolao\Actions\IniciarRodada;
use App\Domain\Bolao\Enums\RoundStatus;
use App\Models\Round;

test('rodada aberta com prazo vencido passa para em andamento', function () {
    $round = Round::factory()->aberta()->create([
        'starts_on' => now()->subDay()->startOfDay(),
        'bets_close_at' => now()->subHour(),
    ]);

    $mudou = app(IniciarRodada::class)->handle($round);

    expect($mudou)->toBeTrue()
        ->and($round->refresh()->status)->toBe(RoundStatus::Running);
});

test('rodada aberta com prazo futuro não muda de status', function () {
    $round = Round::factory()->aberta()->create();

    $mudou = app(IniciarRodada::class)->handle($round);

    expect($mudou)->toBeFalse()
        ->and($round->refresh()->status)->toBe(RoundStatus::Open);
});

test('rodada encerrada não volta para em andamento', function () {
    $round = Round::factory()->create([
        'status' => RoundStatus::Closed,
        'bets_close_at' => now()->subWeek(),
    ]);

    $mudou = app(IniciarRodada::class)->handle($round);

    expect($mudou)->toBeFalse()
        ->and($round->refresh()->status)->toBe(RoundStatus::Closed);
});

test('publicar sorteio em rodada aberta com prazo vencido inicia a rodada e publica', function () {
    $round = Round::factory()->aberta()->create([
        'starts_on' => now()->subDay()->startOfDay(),
        'bets_close_at' => now()->subHour(),
    ]);

    $draw = publicarSorteio($round, [5, 10, 15, 20, 25, 30]);

    expect($draw->exists)->toBeTrue()
        ->and($round->refresh()->status)->toBe(RoundStatus::Running);
});
