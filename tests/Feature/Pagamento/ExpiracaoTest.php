<?php

use App\Domain\Bolao\Enums\BetStatus;
use App\Models\Bet;
use App\Models\Payment;
use App\Models\Round;

test('aposta com QR vencido expira e registra o log', function () {
    $round = Round::factory()->aberta()->create();
    $bet = Bet::factory()->for($round)->create();
    Payment::query()->create([
        'bet_id' => $bet->id,
        'provider' => 'mercado_pago',
        'provider_payment_id' => '777',
        'amount_cents' => $bet->amount_cents,
        'status' => 'pending',
        'expires_at' => now()->subMinutes(5),
    ]);

    $this->artisan('bolao:expirar-apostas')->assertSuccessful();

    expect($bet->refresh()->status)->toBe(BetStatus::Expired)
        ->and($bet->statusLogs()->where('to_status', 'expired')->count())->toBe(1);
});

test('aposta com QR ainda válido não expira', function () {
    $round = Round::factory()->aberta()->create();
    $bet = Bet::factory()->for($round)->create();
    Payment::query()->create([
        'bet_id' => $bet->id,
        'provider' => 'mercado_pago',
        'provider_payment_id' => '778',
        'amount_cents' => $bet->amount_cents,
        'status' => 'pending',
        'expires_at' => now()->addMinutes(10),
    ]);

    $this->artisan('bolao:expirar-apostas')->assertSuccessful();

    expect($bet->refresh()->status)->toBe(BetStatus::AwaitingPayment);
});
