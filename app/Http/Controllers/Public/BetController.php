<?php

namespace App\Http\Controllers\Public;

use App\Domain\Bolao\Actions\RegistrarAposta;
use App\Domain\Bolao\Data\ApostaData;
use App\Domain\Bolao\Enums\BetStatus;
use App\Domain\Bolao\Enums\RoundStatus;
use App\Domain\Bolao\Exceptions\ApostasEncerradas;
use App\Domain\Bolao\Exceptions\LimiteDeCartelasExcedido;
use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreBetRequest;
use App\Models\Bet;
use App\Models\Round;
use App\Services\MercadoPago\MercadoPagoClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class BetController extends Controller
{
    public function create(): Response|RedirectResponse
    {
        $round = $this->openRound();

        if ($round === null) {
            return redirect()
                ->route('home')
                ->with('erro', 'As apostas não estão abertas no momento.');
        }

        return Inertia::render('Public/Apostar', [
            'rodada' => [
                'nome' => $round->name,
                'valorCents' => $round->bet_amount_cents,
                'encerramentoApostas' => $round->bets_close_at->toIso8601String(),
                'maxCartelasPorPessoa' => $round->max_bets_per_person,
                'versaoRegulamento' => $round->rules_version,
            ],
        ]);
    }

    public function store(StoreBetRequest $request, RegistrarAposta $registrar, MercadoPagoClient $mercadoPago): RedirectResponse
    {
        $round = $this->openRound();

        if ($round === null) {
            throw ValidationException::withMessages([
                'numbers' => 'As apostas desta rodada já foram encerradas.',
            ]);
        }

        try {
            $bet = $registrar->handle($round, new ApostaData(
                bettorName: $request->string('nome')->toString(),
                bettorPhone: $request->string('celular')->toString(),
                numbers: array_map(intval(...), $request->array('numbers')),
                acceptedIp: (string) $request->ip(),
                bettorEmail: $request->filled('email') ? $request->string('email')->toString() : null,
            ));
        } catch (ApostasEncerradas|LimiteDeCartelasExcedido $e) {
            throw ValidationException::withMessages(['numbers' => $e->getMessage()]);
        }

        try {
            $mercadoPago->criarPagamentoPix($bet);
        } catch (Throwable $e) {
            Log::error('Falha ao criar pagamento PIX', ['bet' => $bet->uuid, 'error' => $e->getMessage()]);
        }

        return redirect()->route('apostas.checkout', $bet);
    }

    public function checkout(Bet $bet): Response
    {
        $round = $bet->round()->firstOrFail();
        $payment = $bet->payments()->latest('id')->first();

        return Inertia::render('Public/Checkout', [
            'aposta' => [
                'uuid' => $bet->uuid,
                'dezenas' => $bet->numbers,
                'valorCents' => $bet->amount_cents,
                'status' => $bet->status->value,
                'statusLabel' => $bet->status->label(),
            ],
            'rodada' => ['nome' => $round->name],
            'pagamento' => $payment === null ? null : [
                'qrCode' => $payment->qr_code,
                'qrCodeBase64' => $payment->qr_code_base64,
                'ticketUrl' => $payment->ticket_url,
                'expiraEm' => $payment->expires_at?->toIso8601String(),
            ],
            'linkCartelas' => $bet->status === BetStatus::Paid ? $this->signedLink($bet) : null,
        ]);
    }

    public function status(Bet $bet): JsonResponse
    {
        return response()->json([
            'status' => $bet->status->value,
            'statusLabel' => $bet->status->label(),
            'linkCartelas' => $bet->status === BetStatus::Paid ? $this->signedLink($bet) : null,
        ]);
    }

    /**
     * Regenera o QR quando o anterior venceu sem pagamento.
     */
    public function regenerarQr(Bet $bet, MercadoPagoClient $mercadoPago): RedirectResponse
    {
        $round = $bet->round()->firstOrFail();

        $expirado = in_array($bet->status, [BetStatus::AwaitingPayment, BetStatus::Expired], true)
            && ! $bet->payments()->where('expires_at', '>', now())->exists();

        if (! $expirado || ! $round->status->acceptsBets() || now()->isAfter($round->bets_close_at)) {
            return redirect()->route('apostas.checkout', $bet);
        }

        if ($bet->status === BetStatus::Expired) {
            $bet->update(['status' => BetStatus::AwaitingPayment]);
            $bet->statusLogs()->create([
                'from_status' => BetStatus::Expired->value,
                'to_status' => BetStatus::AwaitingPayment->value,
                'reason' => 'Novo QR PIX gerado pelo apostador',
                'actor_type' => 'bettor',
                'actor_id' => null,
            ]);
        }

        try {
            $mercadoPago->criarPagamentoPix($bet->refresh());
        } catch (Throwable $e) {
            Log::error('Falha ao regenerar QR PIX', ['bet' => $bet->uuid, 'error' => $e->getMessage()]);

            return redirect()
                ->route('apostas.checkout', $bet)
                ->with('erro', 'Não conseguimos gerar o QR agora. Tente de novo em instantes.');
        }

        return redirect()->route('apostas.checkout', $bet);
    }

    private function openRound(): ?Round
    {
        return Round::query()
            ->where('status', RoundStatus::Open)
            ->where('bets_close_at', '>', now())
            ->latest('id')
            ->first();
    }

    private function signedLink(Bet $bet): string
    {
        return URL::temporarySignedRoute(
            'apostador.cartelas',
            now()->addDays(90),
            ['bettor' => $bet->bettor()->firstOrFail()->uuid],
        );
    }
}
