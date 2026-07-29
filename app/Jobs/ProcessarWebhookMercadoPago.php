<?php

namespace App\Jobs;

use App\Domain\Bolao\Actions\ConfirmarPagamento;
use App\Models\Payment;
use App\Models\PaymentWebhookEvent;
use App\Services\MercadoPago\MercadoPagoClient;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

class ProcessarWebhookMercadoPago implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(
        public int $webhookEventId,
    ) {
        $this->onQueue('payments');
    }

    public function handle(MercadoPagoClient $client, ConfirmarPagamento $confirmar): void
    {
        $event = PaymentWebhookEvent::query()->find($this->webhookEventId);

        if ($event === null || $event->processed_at !== null) {
            return;
        }

        try {
            $providerPaymentId = (string) data_get($event->payload, 'data.id');

            if ($providerPaymentId === '' || $event->type !== 'payment') {
                $event->update(['processed_at' => now()]);

                return;
            }

            // Nunca confia no payload do webhook: re-consulta a API.
            $data = $client->consultarPagamento($providerPaymentId);
            $status = (string) data_get($data, 'status');

            $payment = Payment::query()
                ->where('provider_payment_id', $providerPaymentId)
                ->first();

            if ($payment !== null) {
                $payment->update([
                    'status' => $status,
                    'payload' => $data,
                    'paid_at' => $status === 'approved'
                        ? CarbonImmutable::parse((string) data_get($data, 'date_approved', now()->toIso8601String()))
                        : null,
                ]);

                if ($status === 'approved') {
                    $confirmar->handle(
                        $payment->bet()->firstOrFail(),
                        CarbonImmutable::parse((string) data_get($data, 'date_approved', now()->toIso8601String())),
                    );
                }
            }

            $event->update(['processed_at' => now(), 'error' => null]);
        } catch (Throwable $e) {
            $event->update(['error' => $e->getMessage()]);

            throw $e;
        }
    }
}
