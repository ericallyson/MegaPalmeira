<?php

use App\Domain\Bolao\Enums\BetStatus;
use App\Models\Bet;
use App\Models\Round;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;

beforeEach(function () {
    config([
        'services.mercado_pago.access_token' => 'token-teste',
        'services.mercado_pago.webhook_secret' => 'segredo-teste',
    ]);
    RateLimiter::clear('apostas');

    Http::fake([
        'api.mercadopago.com/v1/payments' => Http::response([
            'id' => 12345,
            'status' => 'pending',
            'point_of_interaction' => [
                'transaction_data' => [
                    'qr_code' => 'copia-e-cola',
                    'qr_code_base64' => base64_encode('qr'),
                    'ticket_url' => 'https://mp.test/t',
                ],
            ],
        ], 201),
    ]);
});

function payloadAposta(array $overrides = []): array
{
    return array_merge([
        'nome' => 'Rafael Silva',
        'celular' => '(82) 99123-4589',
        'email' => null,
        'numbers' => [1, 5, 8, 12, 19, 25, 33, 47, 51, 60],
        'aceite_maioridade' => true,
        'aceite_regulamento' => true,
    ], $overrides);
}

test('apostar cria a aposta com QR PIX e redireciona para o checkout', function () {
    Round::factory()->aberta()->create(['bets_close_at' => now()->addDay(), 'bet_amount_cents' => 2000]);

    $response = $this->post('/apostas', payloadAposta());

    $bet = Bet::query()->firstOrFail();
    $response->assertRedirect(route('apostas.checkout', $bet));

    expect($bet->status)->toBe(BetStatus::AwaitingPayment)
        ->and($bet->amount_cents)->toBe(2000)
        ->and($bet->payments()->count())->toBe(1)
        ->and($bet->payments()->first()->qr_code)->toBe('copia-e-cola');
});

test('depois do encerramento o endpoint responde 422 e nada é criado', function () {
    Round::factory()->aberta()->create(['bets_close_at' => now()->subMinute()]);

    $this->postJson('/apostas', payloadAposta())->assertStatus(422);

    expect(Bet::count())->toBe(0);
});

test('rate limit: a sexta tentativa no mesmo minuto leva 429', function () {
    Round::factory()->aberta()->create(['bets_close_at' => now()->addDay()]);

    for ($i = 0; $i < 5; $i++) {
        $this->postJson('/apostas', payloadAposta(['numbers' => [1, 2, 3]]))->assertStatus(422);
    }

    $this->postJson('/apostas', payloadAposta())->assertStatus(429);
});

test('status da aposta responde JSON e entrega o link assinado quando paga', function () {
    $round = Round::factory()->aberta()->create(['bets_close_at' => now()->addDay()]);
    $bet = Bet::factory()->for($round)->create();

    $this->getJson("/apostas/{$bet->uuid}/status")
        ->assertOk()
        ->assertJson(['status' => 'awaiting_payment', 'linkCartelas' => null]);

    $bet->update(['status' => BetStatus::Paid, 'paid_at' => now()]);

    $link = $this->getJson("/apostas/{$bet->uuid}/status")->assertOk()->json('linkCartelas');

    expect($link)->toContain('/minhas-cartelas/')
        ->and($link)->toContain('signature=');
});

test('minhas cartelas exige URL assinada e não expõe telefone completo', function () {
    $round = Round::factory()->aberta()->create();
    $bet = Bet::factory()->paga()->for($round)->create();
    $bettor = $bet->bettor;

    $this->get("/minhas-cartelas/{$bettor->uuid}")->assertForbidden();

    $signed = URL::temporarySignedRoute('apostador.cartelas', now()->addDay(), ['bettor' => $bettor->uuid]);
    $content = $this->get($signed)->assertOk()->getContent();

    expect($content)->not->toContain(substr($bettor->phone, 6, 5));
});

test('checkout mostra o QR da aposta', function () {
    Round::factory()->aberta()->create(['bets_close_at' => now()->addDay()]);
    $this->post('/apostas', payloadAposta());
    $bet = Bet::query()->firstOrFail();

    $this->get("/apostas/{$bet->uuid}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Public/Checkout')
            ->where('pagamento.qrCode', 'copia-e-cola')
            ->where('aposta.status', 'awaiting_payment'));
});
