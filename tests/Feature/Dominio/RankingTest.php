<?php

use App\Domain\Bolao\Services\RankingService;
use App\Models\Bet;
use App\Models\Bettor;
use App\Models\Draw;
use App\Models\Round;

function cartelaPaga(Round $round, string $nome, array $numeros, string $paidAt = '2026-08-01 10:00'): Bet
{
    return Bet::factory()->paga()
        ->comNumeros($numeros)
        ->for($round)
        ->for(Bettor::factory()->create(['name' => $nome]))
        ->create(['paid_at' => $paidAt]);
}

function acender(Bet $bet, array $numeros, Draw $draw): void
{
    $bet->betNumbers()->whereIn('number', $numeros)->update(['matched_draw_id' => $draw->id]);
    $bet->update(['hits_count' => $bet->betNumbers()->whereNotNull('matched_draw_id')->count()]);
}

test('critério 1: mais pontos vem primeiro', function () {
    $round = Round::factory()->emAndamento()->create();
    $draw = Draw::factory()->for($round)->create();

    // Zilda tem mais pontos que Alberto: pontos vencem nome
    $menos = cartelaPaga($round, 'Alberto', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    $mais = cartelaPaga($round, 'Zilda', [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);

    acender($menos, [1, 2], $draw);
    acender($mais, [11, 12, 13], $draw);

    $ordered = app(RankingService::class)->orderedBets($round);

    expect($ordered->pluck('id')->all())->toBe([$mais->id, $menos->id]);
});

test('critério 2: com pontos iguais, ganha quem completou o último ponto no sorteio mais antigo', function () {
    $round = Round::factory()->emAndamento()->create();
    $draw1 = Draw::factory()->for($round)->create(['sequence' => 1, 'contest_number' => 2801]);
    $draw2 = Draw::factory()->for($round)->create(['sequence' => 2, 'contest_number' => 2802]);

    // Zeca fez os 4 pontos já no primeiro sorteio; Ana só completou no segundo
    $veterana = cartelaPaga($round, 'Zeca', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    $tardia = cartelaPaga($round, 'Ana', [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);

    acender($veterana, [1, 2, 3, 4], $draw1);
    acender($tardia, [11, 12], $draw1);
    acender($tardia, [13, 14], $draw2);

    $ordered = app(RankingService::class)->orderedBets($round);

    expect($ordered->pluck('id')->all())->toBe([$veterana->id, $tardia->id]);
});

test('critério 3: com pontos e antiguidade iguais, ganha quem pagou primeiro', function () {
    $round = Round::factory()->emAndamento()->create();
    $draw = Draw::factory()->for($round)->create();

    // Zuleide pagou antes de Abel: pagamento vence nome
    $pagouDepois = cartelaPaga($round, 'Abel', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], '2026-08-01 12:00');
    $pagouAntes = cartelaPaga($round, 'Zuleide', [11, 12, 13, 14, 15, 16, 17, 18, 19, 20], '2026-08-01 09:00');

    acender($pagouDepois, [1, 2], $draw);
    acender($pagouAntes, [11, 12], $draw);

    $ordered = app(RankingService::class)->orderedBets($round);

    expect($ordered->pluck('id')->all())->toBe([$pagouAntes->id, $pagouDepois->id]);
});

test('critério 4: tudo igual, desempata por ordem alfabética do nome', function () {
    $round = Round::factory()->emAndamento()->create();
    $draw = Draw::factory()->for($round)->create();

    $b = cartelaPaga($round, 'Bruna', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    $a = cartelaPaga($round, 'Amanda', [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);

    acender($b, [1, 2], $draw);
    acender($a, [11, 12], $draw);

    $ordered = app(RankingService::class)->orderedBets($round);

    expect($ordered->pluck('id')->all())->toBe([$a->id, $b->id]);
});

test('ranking público usa primeiro nome, inicial do sobrenome para homônimos e telefone mascarado', function () {
    $round = Round::factory()->emAndamento()->create();

    Bet::factory()->paga()->comNumeros([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        ->for($round)
        ->for(Bettor::factory()->create(['name' => 'Rafael Silva', 'phone' => '+5582991234589']))
        ->create();
    Bet::factory()->paga()->comNumeros([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
        ->for($round)
        ->for(Bettor::factory()->create(['name' => 'Rafael Melo', 'phone' => '+5582987654321']))
        ->create();
    Bet::factory()->paga()->comNumeros([21, 22, 23, 24, 25, 26, 27, 28, 29, 30])
        ->for($round)
        ->for(Bettor::factory()->create(['name' => 'Carla Souza', 'phone' => '+5582999887766']))
        ->create();

    $ranking = app(RankingService::class)->ranking($round);
    $names = collect($ranking)->pluck('displayName');
    $phones = collect($ranking)->pluck('maskedPhone');

    expect($names)->toContain('Rafael S.')
        ->and($names)->toContain('Rafael M.')
        ->and($names)->toContain('Carla')
        ->and($phones)->toContain('(82) 99xxx-xx89')
        ->and($phones->join(' '))->not->toContain('991234589');
});
