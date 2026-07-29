<?php

use App\Domain\Bolao\Actions\ConfirmarPagamento;
use App\Domain\Bolao\Enums\BetStatus;
use App\Domain\Bolao\Events\ApostaConfirmada;
use App\Domain\Bolao\Services\RankingService;
use App\Domain\Bolao\Services\RateioService;
use App\Models\Bet;
use App\Models\Round;
use Illuminate\Support\Facades\Event;

test('aposta aprovada 1 minuto após o encerramento fica paid_late, fora do pote e do ranking', function () {
    $round = Round::factory()->aberta()->create(['bets_close_at' => now()->subHour()]);
    $bet = Bet::factory()->for($round)->create();

    app(ConfirmarPagamento::class)->handle($bet, $round->bets_close_at->copy()->addMinute());

    expect($bet->refresh()->status)->toBe(BetStatus::PaidLate)
        ->and(app(RateioService::class)->poteCents($round))->toBe(0)
        ->and(app(RankingService::class)->orderedBets($round))->toHaveCount(0)
        ->and($bet->statusLogs()->where('to_status', 'paid_late')->count())->toBe(1);
});

test('aposta aprovada dentro do prazo fica paga e entra no pote', function () {
    Event::fake([ApostaConfirmada::class]);
    $round = Round::factory()->aberta()->create(['bets_close_at' => now()->addHour()]);
    $bet = Bet::factory()->for($round)->create(['amount_cents' => 2000]);

    app(ConfirmarPagamento::class)->handle($bet, now());

    expect($bet->refresh()->status)->toBe(BetStatus::Paid)
        ->and(app(RateioService::class)->poteCents($round))->toBe(2000);

    Event::assertDispatched(ApostaConfirmada::class);
});

test('confirmação é idempotente', function () {
    $round = Round::factory()->aberta()->create(['bets_close_at' => now()->addHour()]);
    $bet = Bet::factory()->for($round)->create();

    app(ConfirmarPagamento::class)->handle($bet, now());
    app(ConfirmarPagamento::class)->handle($bet->refresh(), now());

    expect($bet->refresh()->statusLogs()->where('to_status', 'paid')->count())->toBe(1);
});

test('aposta confirmada com atraso de processamento é apurada contra sorteios já publicados', function () {
    $round = Round::factory()->emAndamento()->create();
    Bet::factory()->paga()->comNumeros([41, 42, 43, 44, 45, 46, 47, 48, 49, 50])->for($round)->create();
    publicarSorteio($round, [1, 2, 3, 55, 56, 57]);

    // pagou às 17h59, mas o webhook só chegou depois do primeiro sorteio
    $atrasada = Bet::factory()->comNumeros([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])->for($round)->create();
    app(ConfirmarPagamento::class)->handle($atrasada, $round->bets_close_at->copy()->subMinute());

    expect($atrasada->refresh()->status)->toBe(BetStatus::Paid)
        ->and($atrasada->hits_count)->toBe(3);
});
