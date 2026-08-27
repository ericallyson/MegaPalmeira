<?php

namespace App\Http\Controllers\Public;

use App\Domain\Bolao\Actions\DarBaixaManual;
use App\Domain\Bolao\Enums\BetStatus;
use App\Domain\Bolao\Exceptions\BolaoException;
use App\Http\Controllers\Controller;
use App\Models\Bet;
use App\Models\Round;
use App\Models\Seller;
use App\Support\PhoneMask;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Portal do vendedor: login com slug + senha. Ele vê apenas as apostas
 * feitas pelo seu link, por rodada, com a comissão sobre as pagas, e pode
 * dar baixa manual nas que ainda aguardam pagamento.
 */
class SellerPortalController extends Controller
{
    private const SESSION_KEY = 'seller_auth_id';

    public function showLogin(Request $request): Response|RedirectResponse
    {
        if ($this->seller($request) !== null) {
            return redirect()->route('vendedor.painel');
        }

        return Inertia::render('Public/VendedorLogin');
    }

    public function login(Request $request): RedirectResponse
    {
        $request->validate(
            [
                'slug' => ['required', 'string'],
                'senha' => ['required', 'string'],
            ],
            [
                'slug.required' => 'Informe seu usuário (slug).',
                'senha.required' => 'Informe sua senha.',
            ],
        );

        $seller = Seller::query()
            ->where('slug', $request->string('slug')->toString())
            ->first();

        if ($seller === null || ! Hash::check($request->string('senha')->toString(), $seller->password)) {
            throw ValidationException::withMessages([
                'slug' => 'Usuário ou senha não conferem.',
            ]);
        }

        $request->session()->put(self::SESSION_KEY, $seller->id);

        return redirect()->route('vendedor.painel');
    }

    public function logout(Request $request): RedirectResponse
    {
        $request->session()->forget(self::SESSION_KEY);

        return redirect()->route('vendedor.entrar');
    }

    public function painel(Request $request): Response|RedirectResponse
    {
        $seller = $this->seller($request);

        if ($seller === null) {
            return redirect()->route('vendedor.entrar');
        }

        $rodadas = Round::query()
            ->whereHas('bets', fn ($query) => $query->where('seller_id', $seller->id))
            ->latest('id')
            ->get(['id', 'uuid', 'name']);

        $rodadaAtual = $request->filled('rodada')
            ? $rodadas->firstWhere('uuid', $request->string('rodada')->toString())
            : $rodadas->first();

        $apostas = collect();
        $resumo = [
            'apostas' => 0,
            'pagas' => 0,
            'arrecadacaoPagasCents' => 0,
            'comissaoCents' => 0,
        ];

        if ($rodadaAtual !== null) {
            $bets = Bet::query()
                ->where('round_id', $rodadaAtual->id)
                ->where('seller_id', $seller->id)
                ->with('bettor')
                ->orderBy('created_at')
                ->get();

            $arrecadacaoPagas = (int) $bets
                ->where('status', BetStatus::Paid)
                ->sum('amount_cents');

            $resumo = [
                'apostas' => $bets->count(),
                'pagas' => $bets->where('status', BetStatus::Paid)->count(),
                'arrecadacaoPagasCents' => $arrecadacaoPagas,
                'comissaoCents' => intdiv($arrecadacaoPagas * $seller->commission_pct, 100),
            ];

            $apostas = $bets->map(fn (Bet $bet): array => [
                'uuid' => $bet->uuid,
                'nome' => $bet->bettor->name,
                'telefone' => PhoneMask::mask($bet->bettor->phone),
                'dezenas' => $bet->numbers,
                'valorCents' => $bet->amount_cents,
                'status' => $bet->status->value,
                'statusLabel' => $bet->status->label(),
                'metodo' => $bet->paid_method?->label(),
                'pontos' => $bet->hits_count,
                'pagaEm' => $bet->paid_at?->toIso8601String(),
                'podeDarBaixa' => in_array($bet->status, [BetStatus::AwaitingPayment, BetStatus::Expired], true),
            ])->values();
        }

        return Inertia::render('Public/VendedorPainel', [
            'vendedor' => [
                'nome' => $seller->name,
                'slug' => $seller->slug,
                'comissaoPct' => $seller->commission_pct,
                'link' => route('vendedor.link', $seller->slug),
                'grupoUrl' => $seller->group_url,
            ],
            'rodadas' => $rodadas->map(fn (Round $r): array => [
                'uuid' => $r->uuid,
                'nome' => $r->name,
            ])->values(),
            'rodadaAtual' => $rodadaAtual?->uuid,
            'resumo' => $resumo,
            'apostas' => $apostas,
        ]);
    }

    public function darBaixa(Request $request, Bet $bet, DarBaixaManual $darBaixa): RedirectResponse
    {
        $seller = $this->seller($request);

        if ($seller === null) {
            return redirect()->route('vendedor.entrar');
        }

        // Um vendedor só dá baixa nas apostas do próprio link.
        if ($bet->seller_id !== $seller->id) {
            abort(403);
        }

        $request->validate(
            ['motivo' => ['required', 'string', 'max:255']],
            ['motivo.required' => 'Descreva o motivo da baixa (ex.: pagou em dinheiro).'],
        );

        if (! in_array($bet->status, [BetStatus::AwaitingPayment, BetStatus::Expired], true)) {
            return back()->with('erro', 'Só é possível dar baixa em apostas aguardando pagamento.');
        }

        try {
            $darBaixa->handle($bet, $request->string('motivo')->toString(), $seller);
        } catch (BolaoException $e) {
            return back()->with('erro', $e->getMessage());
        }

        return back()->with('sucesso', "Baixa registrada para {$bet->bettor->name}.");
    }

    private function seller(Request $request): ?Seller
    {
        $id = $request->session()->get(self::SESSION_KEY);

        return $id === null ? null : Seller::query()->find($id);
    }
}
