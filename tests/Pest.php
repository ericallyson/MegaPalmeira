<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

pest()->extend(Tests\TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature');

/**
 * Publica um sorteio numa rodada, com concurso sequencial automático.
 *
 * @param  list<int>  $dezenas
 */
function publicarSorteio(App\Models\Round $round, array $dezenas, ?int $concurso = null): App\Models\Draw
{
    $ultimo = $round->draws()->max('contest_number') ?? 2800;

    return app(App\Domain\Bolao\Actions\PublicarSorteio::class)->handle(
        $round,
        new App\Domain\Bolao\Data\SorteioData(
            contestNumber: $concurso ?? $ultimo + 1,
            drawnOn: Carbon\CarbonImmutable::now(),
            numbers: $dezenas,
        ),
    );
}
