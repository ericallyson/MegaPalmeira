<?php

namespace App\Domain\Bolao\Actions;

use App\Domain\Bolao\Data\SorteioData;
use App\Domain\Bolao\Enums\BetStatus;
use App\Domain\Bolao\Events\RankingAtualizado;
use App\Domain\Bolao\Events\SorteioPublicado;
use App\Domain\Bolao\Exceptions\NumerosDoSorteioInvalidos;
use App\Domain\Bolao\Exceptions\RodadaNaoAceitaSorteios;
use App\Domain\Bolao\Services\ApuracaoService;
use App\Models\Draw;
use App\Models\Round;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PublicarSorteio
{
    public function __construct(
        private readonly ApuracaoService $apuracao,
        private readonly EncerrarRodada $encerrarRodada,
    ) {}

    public function handle(Round $round, SorteioData $data, ?User $actor = null): Draw
    {
        $this->validateNumbers($data->numbers);

        return DB::transaction(function () use ($round, $data, $actor): Draw {
            /** @var Round $round */
            $round = Round::query()->whereKey($round->id)->lockForUpdate()->firstOrFail();

            $existing = $round->draws()
                ->where('contest_number', $data->contestNumber)
                ->first();

            if ($existing !== null) {
                return $existing;
            }

            if (! $round->status->acceptsDraws()) {
                throw RodadaNaoAceitaSorteios::porStatus($round->status);
            }

            // max_draws = 0 significa sem limite: joga até alguém fechar 10
            if ($round->max_draws > 0 && $round->draws()->count() >= $round->max_draws) {
                throw RodadaNaoAceitaSorteios::limiteAtingido($round->max_draws);
            }

            $numbers = $data->numbers;
            sort($numbers);

            /** @var Draw $draw */
            $draw = $round->draws()->create([
                'contest_number' => $data->contestNumber,
                'drawn_on' => $data->drawnOn->toDateString(),
                'numbers' => $numbers,
                'sequence' => ((int) $round->draws()->max('sequence')) + 1,
                'published_at' => now(),
                'created_by' => $actor?->id,
            ]);

            $this->apuracao->apurar($round, $draw);

            $someoneCompleted = $round->bets()
                ->where('status', BetStatus::Paid)
                ->where('completed_at_draw_id', $draw->id)
                ->exists();

            if ($someoneCompleted) {
                $this->encerrarRodada->handle($round, $draw, $actor);
            } elseif ($round->max_draws > 0 && $round->draws()->count() >= $round->max_draws) {
                $this->encerrarRodada->handle($round, null, $actor);
            }

            SorteioPublicado::dispatch($round, $draw);
            RankingAtualizado::dispatch($round);

            return $draw;
        });
    }

    /**
     * @param  list<int>  $numbers
     */
    private function validateNumbers(array $numbers): void
    {
        $valid = count($numbers) === 6
            && count(array_unique($numbers)) === 6
            && collect($numbers)->every(fn (int $n): bool => $n >= 1 && $n <= 60);

        if (! $valid) {
            throw NumerosDoSorteioInvalidos::make();
        }
    }
}
