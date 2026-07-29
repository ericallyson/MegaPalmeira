<?php

namespace App\Domain\Bolao\Actions;

use App\Domain\Bolao\Enums\BetStatus;
use App\Domain\Bolao\Enums\PaidMethod;
use App\Domain\Bolao\Events\ApostaConfirmada;
use App\Domain\Bolao\Events\RankingAtualizado;
use App\Domain\Bolao\Services\ApuracaoService;
use App\Models\Bet;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;

class ConfirmarPagamento
{
    public function __construct(
        private readonly ApuracaoService $apuracao,
    ) {}

    /**
     * Marca a aposta como paga (ou paga fora do prazo, se a aprovação
     * veio depois do encerramento das apostas). Idempotente: aposta já
     * confirmada não é tocada de novo.
     */
    public function handle(Bet $bet, CarbonInterface $approvedAt, PaidMethod $method = PaidMethod::Pix): Bet
    {
        return DB::transaction(function () use ($bet, $approvedAt, $method): Bet {
            /** @var Bet $bet */
            $bet = Bet::query()->whereKey($bet->id)->lockForUpdate()->firstOrFail();

            if (in_array($bet->status, [BetStatus::Paid, BetStatus::PaidLate], true)) {
                return $bet;
            }

            $round = $bet->round()->firstOrFail();
            $late = $approvedAt->isAfter($round->bets_close_at);
            $to = $late ? BetStatus::PaidLate : BetStatus::Paid;
            $fromStatus = $bet->status;

            $bet->update([
                'status' => $to,
                'paid_at' => $approvedAt,
                'paid_method' => $method,
            ]);

            $bet->statusLogs()->create([
                'from_status' => $fromStatus->value,
                'to_status' => $to->value,
                'reason' => $late
                    ? 'Pagamento aprovado após o encerramento das apostas'
                    : 'Pagamento confirmado',
                'actor_type' => 'system',
                'actor_id' => null,
            ]);

            if (! $late) {
                // O webhook pode chegar depois de sorteios já publicados:
                // a cartela entra valendo e é apurada contra o histórico.
                $this->apuracao->apurarAposta($bet);

                RankingAtualizado::dispatch($round);
            }

            ApostaConfirmada::dispatch($bet);

            return $bet->refresh();
        });
    }
}
