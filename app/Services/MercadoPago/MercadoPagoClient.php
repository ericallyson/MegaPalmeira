<?php

namespace App\Services\MercadoPago;

use App\Models\Bet;
use App\Models\Payment;
use App\Settings\SettingsRepository;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

class MercadoPagoClient
{
    public function __construct(private readonly SettingsRepository $settings)
    {
    }

    /**
     * Cria uma cobrança PIX para a aposta. O valor vem sempre do
     * servidor (amount_cents da aposta) e a expiração é o menor entre
     * 30 minutos e o encerramento das apostas da rodada.
     */
    public function criarPagamentoPix(Bet $bet): Payment
    {
        $round = $bet->round()->firstOrFail();
        $bettor = $bet->bettor()->firstOrFail();

        $expiresAt = CarbonImmutable::now()
            ->addMinutes(30)
            ->min(CarbonImmutable::parse($round->bets_close_at));

        $nameParts = str($bettor->name)->trim()->explode(' ')->filter()->values();

        $response = $this->request()
            ->withHeaders(['X-Idempotency-Key' => $bet->uuid])
            ->post('/v1/payments', [
                'transaction_amount' => round($bet->amount_cents / 100, 2),
                'description' => "MegaPalmeira — {$round->name}",
                'payment_method_id' => 'pix',
                'external_reference' => $bet->uuid,
                'notification_url' => $this->settings->mercadoPago()['notification_url'] ?: null,
                'date_of_expiration' => $expiresAt->format('Y-m-d\TH:i:s.vP'),
                'payer' => [
                    'email' => $bettor->email ?: "{$bet->uuid}@apostador.megapalmeira.com.br",
                    'first_name' => (string) $nameParts->first(),
                    'last_name' => (string) ($nameParts->count() > 1 ? $nameParts->last() : ''),
                ],
            ])
            ->throw()
            ->json();

        $transactionData = data_get($response, 'point_of_interaction.transaction_data', []);

        return Payment::query()->create([
            'bet_id' => $bet->id,
            'provider' => 'mercado_pago',
            'provider_payment_id' => (string) data_get($response, 'id'),
            'amount_cents' => $bet->amount_cents,
            'status' => (string) data_get($response, 'status', 'pending'),
            'qr_code' => data_get($transactionData, 'qr_code'),
            'qr_code_base64' => data_get($transactionData, 'qr_code_base64'),
            'ticket_url' => data_get($transactionData, 'ticket_url'),
            'expires_at' => $expiresAt,
            'payload' => $response,
        ]);
    }

    /**
     * Consulta o estado real do pagamento na API. É a única fonte de
     * verdade para confirmação — payload de webhook nunca é confiado.
     *
     * @return array<string, mixed>
     */
    public function consultarPagamento(string $providerPaymentId): array
    {
        return $this->request()
            ->get("/v1/payments/{$providerPaymentId}")
            ->throw()
            ->json();
    }

    private function request(): PendingRequest
    {
        $mp = $this->settings->mercadoPago();

        return Http::baseUrl($mp['base_url'])
            ->withToken($mp['access_token'])
            ->acceptJson()
            ->timeout(15);
    }
}
