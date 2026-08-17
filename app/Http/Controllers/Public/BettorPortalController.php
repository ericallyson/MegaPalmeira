<?php

namespace App\Http\Controllers\Public;

use App\Domain\Bolao\Enums\BetStatus;
use App\Http\Controllers\Controller;
use App\Models\Bet;
use App\Models\BetNumber;
use App\Models\Bettor;
use App\Support\PhoneMask;
use App\Support\PhoneNumber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Portal do apostador: login apenas com o telefone completo (sem senha).
 * O vínculo de sessão guarda o bettor_id; a partir daí ele vê suas
 * apostas — pagas e não pagas — e pode gerar um novo QR PIX no prazo.
 */
class BettorPortalController extends Controller
{
    private const SESSION_KEY = 'bettor_id';

    public function showLogin(Request $request): Response|RedirectResponse
    {
        if ($this->bettor($request) !== null) {
            return redirect()->route('apostador.portal');
        }

        return Inertia::render('Public/ApostadorLogin');
    }

    public function login(Request $request): RedirectResponse
    {
        $request->validate(
            ['celular' => ['required', 'string', 'regex:/^\D*(\d\D*){10,13}$/']],
            [
                'celular.required' => 'Informe seu celular com DDD para entrar.',
                'celular.regex' => 'Esse celular não parece válido. Use DDD + número, como (82) 99123-4589.',
            ],
        );

        $phone = PhoneNumber::e164($request->string('celular')->toString());

        $bettor = Bettor::query()->where('phone', $phone)->first();

        if ($bettor === null) {
            throw ValidationException::withMessages([
                'celular' => 'Não encontramos apostas para esse telefone.',
            ]);
        }

        $request->session()->put(self::SESSION_KEY, $bettor->id);

        return redirect()->route('apostador.portal');
    }

    public function logout(Request $request): RedirectResponse
    {
        $request->session()->forget(self::SESSION_KEY);

        return redirect()->route('apostador.login');
    }

    public function cartelas(Request $request): Response|RedirectResponse
    {
        $bettor = $this->bettor($request);

        if ($bettor === null) {
            return redirect()->route('apostador.login');
        }

        $bets = $bettor->bets()
            ->with(['round', 'betNumbers'])
            ->latest('id')
            ->get();

        $totalApostadoCents = (int) $bettor->bets()
            ->whereIn('status', [BetStatus::Paid, BetStatus::PaidLate])
            ->sum('amount_cents');

        return Inertia::render('Public/ApostadorPortal', [
            'apostador' => [
                'nome' => str($bettor->name)->trim()->explode(' ')->first(),
                'telefoneMascarado' => PhoneMask::mask($bettor->phone),
                'totalApostadoCents' => $totalApostadoCents,
            ],
            'cartelas' => $bets->map(fn (Bet $bet): array => [
                'uuid' => $bet->uuid,
                'rodada' => $bet->round->name,
                'status' => $bet->status->value,
                'statusLabel' => $bet->status->label(),
                'pontos' => $bet->hits_count,
                'valorCents' => $bet->amount_cents,
                'paga' => in_array($bet->status, [BetStatus::Paid, BetStatus::PaidLate], true),
                // Pode pagar/gerar novo QR se ainda está aguardando (ou
                // expirou) e a rodada segue aceitando apostas no prazo.
                'podePagar' => $this->podePagar($bet),
                'checkoutUrl' => route('apostas.checkout', $bet),
                'numeros' => $bet->betNumbers
                    ->sortBy('number')
                    ->values()
                    ->map(fn (BetNumber $n): array => [
                        'number' => $n->number,
                        'matchedDrawId' => $n->matched_draw_id,
                    ])
                    ->all(),
            ]),
        ]);
    }

    private function bettor(Request $request): ?Bettor
    {
        $id = $request->session()->get(self::SESSION_KEY);

        return $id === null ? null : Bettor::query()->find($id);
    }

    private function podePagar(Bet $bet): bool
    {
        if (! in_array($bet->status, [BetStatus::AwaitingPayment, BetStatus::Expired], true)) {
            return false;
        }

        $round = $bet->round;

        return $round->status->acceptsBets() && now()->isBefore($round->bets_close_at);
    }
}
