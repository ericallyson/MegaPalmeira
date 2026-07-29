<?php

namespace App\Console\Commands;

use App\Domain\Bolao\Enums\RoundStatus;
use App\Models\Round;
use Illuminate\Console\Command;

class TransicionarRodadas extends Command
{
    protected $signature = 'bolao:transicionar-rodadas';

    protected $description = 'Move rodadas abertas para "em andamento" quando o prazo de apostas termina';

    public function handle(): int
    {
        $transitioned = Round::query()
            ->where('status', RoundStatus::Open)
            ->where('bets_close_at', '<=', now())
            ->update(['status' => RoundStatus::Running]);

        if ($transitioned > 0) {
            $this->info("{$transitioned} rodada(s) movida(s) para \"em andamento\".");
        }

        return self::SUCCESS;
    }
}
