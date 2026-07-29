<?php

namespace App\Console\Commands;

use App\Domain\Bolao\Enums\BetStatus;
use App\Models\Bet;
use Illuminate\Console\Command;

class ExpirarApostas extends Command
{
    protected $signature = 'bolao:expirar-apostas';

    protected $description = 'Expira apostas aguardando pagamento cujo QR já venceu';

    public function handle(): int
    {
        $bets = Bet::query()
            ->where('status', BetStatus::AwaitingPayment)
            ->whereHas('payments', fn ($query) => $query->where('expires_at', '<', now()))
            ->whereDoesntHave('payments', fn ($query) => $query->where('expires_at', '>=', now()))
            ->get();

        foreach ($bets as $bet) {
            $bet->update(['status' => BetStatus::Expired]);

            $bet->statusLogs()->create([
                'from_status' => BetStatus::AwaitingPayment->value,
                'to_status' => BetStatus::Expired->value,
                'reason' => 'QR PIX expirou sem pagamento',
                'actor_type' => 'system',
                'actor_id' => null,
            ]);
        }

        if ($bets->isNotEmpty()) {
            $this->info("{$bets->count()} aposta(s) expirada(s).");
        }

        return self::SUCCESS;
    }
}
