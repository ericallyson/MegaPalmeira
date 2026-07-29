<?php

use App\Domain\Bolao\Enums\BetStatus;
use App\Models\Bet;
use App\Models\Payment;
use App\Models\Round;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    config(['services.mercado_pago.access_token' => 'token-teste']);
});

test('reconciliação confirma aposta cujo webhook nunca chegou', function () {
    Http::fake([
        'api.mercadopago.com/v1/payments/555' => Http::response([
            'id' => 555,
            'status' => 'approved',
            'date_approved' => now()->toIso8601String(),
        ]),
    ]);

    $round = Round::factory()->aberta()->create(['bets_close_at' => now()->addHour()]);
    $bet = Bet::factory()->for($round)->create();
    Payment::query()->create([
        'bet_id' => $bet->id,
        'provider' => 'mercado_pago',
        'provider_payment_id' => '555',
        'amount_cents' => $bet->amount_cents,
        'status' => 'pending',
        'expires_at' => now()->addMinutes(20),
    ]);

    $this->artisan('bolao:reconciliar-pagamentos')->assertSuccessful();

    expect($bet->refresh()->status)->toBe(BetStatus::Paid);
});

test('reconciliação não toca apostas com QR já vencido', function () {
    Http::fake();

    $round = Round::factory()->aberta()->create();
    $bet = Bet::factory()->for($round)->create();
    Payment::query()->create([
        'bet_id' => $bet->id,
        'provider' => 'mercado_pago',
        'provider_payment_id' => '556',
        'amount_cents' => $bet->amount_cents,
        'status' => 'pending',
        'expires_at' => now()->subMinute(),
    ]);

    $this->artisan('bolao:reconciliar-pagamentos')->assertSuccessful();

    Http::assertNothingSent();
    expect($bet->refresh()->status)->toBe(BetStatus::AwaitingPayment);
});
