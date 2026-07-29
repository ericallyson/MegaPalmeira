<?php

namespace App\Http\Controllers\Public;

use App\Domain\Bolao\Enums\BetStatus;
use App\Http\Controllers\Controller;
use App\Models\Bet;
use App\Models\BetNumber;
use App\Models\Bettor;
use App\Support\PhoneMask;
use Inertia\Inertia;
use Inertia\Response;

class BettorController extends Controller
{
    /**
     * "Minhas cartelas": acessível só por URL assinada entregue na
     * confirmação do pagamento. Mostra também o total já apostado.
     */
    public function __invoke(Bettor $bettor): Response
    {
        $bets = $bettor->bets()
            ->with(['round', 'betNumbers'])
            ->latest('id')
            ->get();

        $totalApostadoCents = (int) $bettor->bets()
            ->whereIn('status', [BetStatus::Paid, BetStatus::PaidLate])
            ->sum('amount_cents');

        return Inertia::render('Public/MinhasCartelas', [
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
}
