<?php

namespace App\Console\Commands;

use App\Domain\Bolao\Actions\ConfirmarPagamento;
use App\Domain\Bolao\Enums\BetStatus;
use App\Models\Payment;
use App\Services\MercadoPago\MercadoPagoClient;
use Carbon\CarbonImmutable;
use Illuminate\Console\Command;
use Throwable;

class ReconciliarPagamentos extends Command
{
    protected $signature = 'bolao:reconciliar-pagamentos';

    protected $description = 'Consulta no provider as apostas aguardando pagamento com QR ativo — cobre webhook perdido';

    public function handle(MercadoPagoClient $client, ConfirmarPagamento $confirmar): int
    {
        $payments = Payment::query()
            ->whereNotNull('provider_payment_id')
            ->where('expires_at', '>', now())
            ->whereHas('bet', fn ($query) => $query->where('status', BetStatus::AwaitingPayment))
            ->get();

        foreach ($payments as $payment) {
            try {
                $data = $client->consultarPagamento((string) $payment->provider_payment_id);
                $status = (string) data_get($data, 'status');

                $payment->update(['status' => $status, 'payload' => $data]);

                if ($status === 'approved') {
                    $approvedAt = CarbonImmutable::parse(
                        (string) data_get($data, 'date_approved', now()->toIso8601String()),
                    );

                    $payment->update(['paid_at' => $approvedAt]);
                    $confirmar->handle($payment->bet()->firstOrFail(), $approvedAt);

                    $this->info("Aposta {$payment->bet_id} confirmada via reconciliação.");
                }
            } catch (Throwable $e) {
                $this->warn("Pagamento {$payment->provider_payment_id}: {$e->getMessage()}");
            }
        }

        return self::SUCCESS;
    }
}
