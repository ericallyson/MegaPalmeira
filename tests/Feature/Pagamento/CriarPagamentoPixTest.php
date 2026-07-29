<?php

use App\Models\Bet;
use App\Models\Round;
use App\Services\MercadoPago\MercadoPagoClient;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    config([
        'services.mercado_pago.access_token' => 'token-teste',
        'services.mercado_pago.webhook_secret' => 'segredo-teste',
    ]);
});

function fakeMpPaymentCreated(): void
{
    Http::fake([
        'api.mercadopago.com/v1/payments' => Http::response([
            'id' => 987654321,
            'status' => 'pending',
            'point_of_interaction' => [
                'transaction_data' => [
                    'qr_code' => 'pix-copia-e-cola-fake',
                    'qr_code_base64' => base64_encode('qr-fake'),
                    'ticket_url' => 'https://mp.test/ticket/987654321',
                ],
            ],
        ], 201),
    ]);
}

test('cria pagamento PIX com chave de idempotência igual ao uuid da aposta', function () {
    fakeMpPaymentCreated();
    $round = Round::factory()->aberta()->create();
    $bet = Bet::factory()->for($round)->create();

    $payment = app(MercadoPagoClient::class)->criarPagamentoPix($bet);

    expect($payment->provider_payment_id)->toBe('987654321')
        ->and($payment->qr_code)->toBe('pix-copia-e-cola-fake')
        ->and($payment->amount_cents)->toBe($bet->amount_cents)
        ->and($payment->status)->toBe('pending');

    Http::assertSent(function ($request) use ($bet): bool {
        return $request->url() === 'https://api.mercadopago.com/v1/payments'
            && $request->header('X-Idempotency-Key')[0] === $bet->uuid
            && $request['payment_method_id'] === 'pix'
            && $request['external_reference'] === $bet->uuid;
    });
});

test('expiração do QR é o menor entre 30 minutos e o encerramento das apostas', function () {
    fakeMpPaymentCreated();

    // encerra em 10 minutos: o QR não pode viver mais que isso
    $round = Round::factory()->aberta()->create(['bets_close_at' => now()->addMinutes(10)]);
    $bet = Bet::factory()->for($round)->create();

    $payment = app(MercadoPagoClient::class)->criarPagamentoPix($bet);

    expect($payment->expires_at->timestamp)->toBe($round->bets_close_at->timestamp);

    // encerra amanhã: vale o teto de 30 minutos
    $round2 = Round::factory()->create(['bets_close_at' => now()->addDay(), 'status' => 'open']);
    $bet2 = Bet::factory()->for($round2)->create();

    $payment2 = app(MercadoPagoClient::class)->criarPagamentoPix($bet2);

    expect($payment2->expires_at->timestamp)
        ->toBeGreaterThan(now()->addMinutes(29)->timestamp)
        ->toBeLessThanOrEqual(now()->addMinutes(30)->timestamp);
});

test('valor enviado ao provider vem do servidor, nunca do cliente', function () {
    fakeMpPaymentCreated();
    $round = Round::factory()->aberta()->create(['bet_amount_cents' => 3550]);
    $bet = Bet::factory()->for($round)->create(['amount_cents' => 3550]);

    app(MercadoPagoClient::class)->criarPagamentoPix($bet);

    Http::assertSent(fn ($request): bool => $request['transaction_amount'] === 35.5);
});
