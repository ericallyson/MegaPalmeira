<?php

use App\Domain\Bolao\Actions\PublicarSorteio;
use App\Domain\Bolao\Data\SorteioData;
use App\Models\Draw;
use App\Models\Round;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature');

/**
 * Publica um sorteio numa rodada, com concurso sequencial automático.
 *
 * @param  list<int>  $dezenas
 */
function publicarSorteio(Round $round, array $dezenas, ?int $concurso = null): Draw
{
    $ultimo = $round->draws()->max('contest_number') ?? 2800;

    return app(PublicarSorteio::class)->handle(
        $round,
        new SorteioData(
            contestNumber: $concurso ?? $ultimo + 1,
            drawnOn: CarbonImmutable::now(),
            numbers: $dezenas,
        ),
    );
}
