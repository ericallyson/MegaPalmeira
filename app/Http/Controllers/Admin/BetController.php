<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Bolao\Actions\CancelarAposta;
use App\Domain\Bolao\Actions\DarBaixaManual;
use App\Domain\Bolao\Enums\BetStatus;
use App\Domain\Bolao\Exceptions\BolaoException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MotivoRequest;
use App\Models\Bet;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BetController extends Controller
{
    public function index(Request $request): Response
    {
        $bets = Bet::query()
            ->with(['bettor', 'round'])
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')->toString()))
            ->when($request->filled('busca'), function ($query) use ($request): void {
                $term = $request->string('busca')->toString();
                $query->whereHas('bettor', function ($sub) use ($term): void {
                    $sub->where('name', 'like', "%{$term}%")
                        ->orWhere('phone', 'like', '%'.preg_replace('/\D+/', '', $term).'%');
                });
            })
            ->when($request->filled('dezena'), function ($query) use ($request): void {
                $query->whereHas('betNumbers', fn ($sub) => $sub->where('number', $request->integer('dezena')));
            })
            ->latest('id')
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('Admin/Bets/Index', [
            'apostas' => $bets->through(fn (Bet $bet): array => [
                'uuid' => $bet->uuid,
                'nome' => $bet->bettor->name,
                'telefone' => $bet->bettor->phone,
                'rodada' => $bet->round->name,
                'dezenas' => $bet->numbers,
                'valorCents' => $bet->amount_cents,
                'status' => $bet->status->value,
                'statusLabel' => $bet->status->label(),
                'pontos' => $bet->hits_count,
                'pagaEm' => $bet->paid_at?->toIso8601String(),
            ]),
            'filtros' => $request->only(['status', 'busca', 'dezena']),
            'statusDisponiveis' => collect(BetStatus::cases())
                ->map(fn (BetStatus $status): array => [
                    'value' => $status->value,
                    'label' => $status->label(),
                ]),
        ]);
    }

    public function darBaixa(MotivoRequest $request, Bet $bet, DarBaixaManual $darBaixa): RedirectResponse
    {
        try {
            $darBaixa->handle($bet, $request->string('motivo')->toString(), $request->user());
        } catch (BolaoException $e) {
            return back()->with('erro', $e->getMessage());
        }

        return back()->with('sucesso', "Baixa manual registrada para {$bet->bettor->name}.");
    }

    public function cancelar(MotivoRequest $request, Bet $bet, CancelarAposta $cancelar): RedirectResponse
    {
        $to = $request->boolean('estorno') ? BetStatus::Refunded : BetStatus::Canceled;

        try {
            $cancelar->handle($bet, $request->string('motivo')->toString(), $request->user(), $to);
        } catch (BolaoException $e) {
            return back()->with('erro', $e->getMessage());
        }

        return back()->with(
            'sucesso',
            $to === BetStatus::Refunded ? 'Estorno registrado.' : 'Aposta cancelada.',
        );
    }
}
