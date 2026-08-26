<?php

use App\Domain\Bolao\Actions\CriarRodada;
use App\Domain\Bolao\Data\RodadaData;
use App\Domain\Bolao\Enums\NoWinnerPolicy;
use App\Domain\Bolao\Enums\RoundStatus;
use App\Domain\Bolao\Exceptions\PercentuaisNaoSomamCem;
use App\Models\User;
use Carbon\CarbonImmutable;

test('cria rodada com defaults corretos', function () {
    $admin = User::factory()->admin()->create();

    $round = app(CriarRodada::class)->handle(new RodadaData(
        name: 'Bolão de Agosto',
        startsOn: CarbonImmutable::parse('2026-08-10'),
        betAmountCents: 2000,
    ), $admin);

    expect($round->status)->toBe(RoundStatus::Draft)
        ->and($round->slug)->toBe('bolao-de-agosto')
        ->and($round->bets_close_at->format('Y-m-d H:i:s'))->toBe('2026-08-09 23:59:59')
        ->and($round->pct_main)->toBe(70)
        ->and($round->pct_second)->toBe(15)
        ->and($round->pct_admin)->toBe(15)
        ->and($round->max_draws)->toBe(0)
        ->and($round->max_bets_per_person)->toBe(5)
        ->and($round->no_winner_policy)->toBe(NoWinnerPolicy::HighestScore)
        ->and($round->rollover_in_cents)->toBe(0)
        ->and($round->created_by)->toBe($admin->id);
});

test('rejeita percentuais que não somam 100', function () {
    app(CriarRodada::class)->handle(new RodadaData(
        name: 'Bolão Torto',
        startsOn: CarbonImmutable::parse('2026-08-10'),
        betAmountCents: 2000,
        pctMain: 70,
        pctSecond: 20,
        pctAdmin: 15,
    ));
})->throws(PercentuaisNaoSomamCem::class);

test('aceita encerramento de apostas customizado', function () {
    $round = app(CriarRodada::class)->handle(new RodadaData(
        name: 'Bolão Custom',
        startsOn: CarbonImmutable::parse('2026-08-10'),
        betAmountCents: 2000,
        betsCloseAt: CarbonImmutable::parse('2026-08-09 12:00'),
    ));

    expect($round->bets_close_at->format('Y-m-d H:i'))->toBe('2026-08-09 12:00');
});
