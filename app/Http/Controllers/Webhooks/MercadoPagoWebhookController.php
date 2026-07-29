<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessarWebhookMercadoPago;
use App\Models\PaymentWebhookEvent;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MercadoPagoWebhookController extends Controller
{
    /**
     * Valida a assinatura, persiste o evento (unique em
     * provider_event_id garante idempotência), responde 200 imediato
     * e delega o processamento para a fila.
     */
    public function __invoke(Request $request): JsonResponse
    {
        if (! $this->signatureIsValid($request)) {
            return response()->json(['message' => 'Assinatura inválida.'], 401);
        }

        $eventId = (string) ($request->input('id') ?? $request->header('x-request-id'));

        if ($eventId === '') {
            return response()->json(['message' => 'Evento sem identificador.'], 422);
        }

        try {
            $event = PaymentWebhookEvent::query()->create([
                'provider' => 'mercado_pago',
                'provider_event_id' => $eventId,
                'type' => (string) ($request->input('type') ?? $request->query('type', '')),
                'payload' => $request->all(),
            ]);
        } catch (UniqueConstraintViolationException) {
            return response()->json(['message' => 'Evento já recebido.']);
        }

        ProcessarWebhookMercadoPago::dispatch($event->id);

        return response()->json(['message' => 'ok']);
    }

    private function signatureIsValid(Request $request): bool
    {
        $secret = (string) config('services.mercado_pago.webhook_secret');
        $signature = (string) $request->header('x-signature', '');

        if ($secret === '' || $signature === '') {
            return false;
        }

        $parts = collect(explode(',', $signature))
            ->mapWithKeys(function (string $part): array {
                [$key, $value] = array_pad(explode('=', trim($part), 2), 2, '');

                return [$key => $value];
            });

        $ts = (string) $parts->get('ts', '');
        $hash = (string) $parts->get('v1', '');

        if ($ts === '' || $hash === '') {
            return false;
        }

        $dataId = strtolower((string) $request->query('data_id', (string) $request->query('data.id', '')));
        $requestId = (string) $request->header('x-request-id', '');

        $manifest = "id:{$dataId};request-id:{$requestId};ts:{$ts};";

        return hash_equals(hash_hmac('sha256', $manifest, $secret), $hash);
    }
}
