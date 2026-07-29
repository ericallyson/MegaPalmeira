<?php

namespace App\Domain\Bolao\Actions;

use App\Domain\Bolao\Events\RankingAtualizado;
use App\Domain\Bolao\Exceptions\MotivoObrigatorio;
use App\Domain\Bolao\Exceptions\NumerosDoSorteioInvalidos;
use App\Models\Draw;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CorrigirSorteio
{
    public function __construct(
        private readonly RecalcularRodada $recalcular,
    ) {}

    /**
     * @param  list<int>  $numbers
     */
    public function handle(Draw $draw, array $numbers, string $reason, User $actor): Draw
    {
        if (trim($reason) === '') {
            throw MotivoObrigatorio::make('corrigir um sorteio publicado');
        }

        $valid = count($numbers) === 6
            && count(array_unique($numbers)) === 6
            && collect($numbers)->every(fn (int $n): bool => $n >= 1 && $n <= 60);

        if (! $valid) {
            throw NumerosDoSorteioInvalidos::make();
        }

        sort($numbers);

        return DB::transaction(function () use ($draw, $numbers, $reason): Draw {
            $draw->update([
                'numbers' => $numbers,
                'corrected_at' => now(),
                'correction_reason' => trim($reason),
            ]);

            $round = $draw->round()->firstOrFail();

            $this->recalcular->handle($round);

            RankingAtualizado::dispatch($round);

            return $draw->refresh();
        });
    }
}
