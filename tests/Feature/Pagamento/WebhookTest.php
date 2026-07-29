<?php

use App\Domain\Bolao\Enums\BetStatus;
use App\Models\Bet;
use App\Models\Payment;
use App\Models\PaymentWebhookEvent;
use App\Models\Round;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    config(['services.mercado_pago.webhook_secret' => 'segredo-teste']);
    config(['services.mercado_pago.access_token' => 'token-teste']);
});

function webhookHeaders(string $dataId, string $eventId): array
{
    $ts = time();
    $requestId = "req-{$eventId}";
    $manifest = "id:{$dataId};request-id:{$requestId};ts:{$ts};";
    $hash = hash_hmac('sha256', $manifest, 'segredo-teste');

    return [
        'x-signature' => "ts={$ts},v1={$hash}",
        'x-request-id' => $requestId,
    ];
}

function webhookBody(string $dataId, string $eventId): array
{
    return [
        'id' => $eventId,
        'type' => 'payment',
        'action' => 'payment.updated',
        'data' => ['id' => $dataId],
    ];
}

function apostaComPagamento(string $providerPaymentId): Bet
{
    $round = Round::factory()->aberta()->create(['bets_close_at' => now()->addHour()]);
    $bet = Bet::factory()->for($round)->create();

    Payment::query()->create([
        'bet_id' => $bet->id,
        'provider' => 'mercado_pago',
        'provider_payment_id' => $providerPaymentId,
        'amount_cents' => $bet->amount_cents,
        'status' => 'pending',
        'expires_at' => now()->addMinutes(30),
    ]);

    return $bet;
}

test('webhook com assinatura inválida retorna 401 e não altera nada', function () {
    $bet = apostaComPagamento('111');

    $this->postJson(
        '/webhooks/mercadopago?data.id=111&type=payment',
        webhookBody('111', 'evt-1'),
        ['x-signature' => 'ts=1,v1=assinatura-falsa', 'x-request-id' => 'req-evt-1'],
    )->assertStatus(401);

    expect(PaymentWebhookEvent::count())->toBe(0)
        ->and($bet->refresh()->status)->toBe(BetStatus::AwaitingPayment);
});

test('webhook válido confirma a aposta re-consultando a API', function () {
    Http::fake([
        'api.mercadopago.com/v1/payments/111' => Http::response([
            'id' => 111,
            'status' => 'approved',
            'date_approved' => now()->toIso8601String(),
        ]),
    ]);

    $bet = apostaComPagamento('111');

    $this->postJson(
        '/webhooks/mercadopago?data.id=111&type=payment',
        webhookBody('111', 'evt-2'),
        webhookHeaders('111', 'evt-2'),
    )->assertOk();

    expect($bet->refresh()->status)->toBe(BetStatus::Paid)
        ->and(PaymentWebhookEvent::first()->processed_at)->not->toBeNull()
        ->and($bet->payments()->first()->status)->toBe('approved');
});

test('webhook duplicado processa uma única vez', function () {
    Http::fake([
        'api.mercadopago.com/v1/payments/111' => Http::response([
            'id' => 111,
            'status' => 'approved',
            'date_approved' => now()->toIso8601String(),
        ]),
    ]);

    $bet = apostaComPagamento('111');

    $this->postJson('/webhooks/mercadopago?data.id=111&type=payment', webhookBody('111', 'evt-3'), webhookHeaders('111', 'evt-3'))->assertOk();
    $this->postJson('/webhooks/mercadopago?data.id=111&type=payment', webhookBody('111', 'evt-3'), webhookHeaders('111', 'evt-3'))->assertOk();

    expect(PaymentWebhookEvent::count())->toBe(1)
        ->and($bet->refresh()->statusLogs()->where('to_status', 'paid')->count())->toBe(1);

    Http::assertSentCount(1);
});

test('payload adulterado é ignorado: só o status da API vale', function () {
    // o corpo do webhook jura que foi aprovado, mas a API diz "pending"
    Http::fake([
        'api.mercadopago.com/v1/payments/111' => Http::response([
            'id' => 111,
            'status' => 'pending',
        ]),
    ]);

    $bet = apostaComPagamento('111');

    $body = webhookBody('111', 'evt-4');
    $body['status'] = 'approved';
    $body['data']['status'] = 'approved';

    $this->postJson('/webhooks/mercadopago?data.id=111&type=payment', $body, webhookHeaders('111', 'evt-4'))->assertOk();

    expect($bet->refresh()->status)->toBe(BetStatus::AwaitingPayment)
        ->and(PaymentWebhookEvent::first()->processed_at)->not->toBeNull();
});
