<?php

use App\Domain\Bolao\Actions\RegistrarAposta;
use App\Domain\Bolao\Data\ApostaData;
use App\Domain\Bolao\Enums\BetStatus;
use App\Domain\Bolao\Exceptions\ApostasEncerradas;
use App\Domain\Bolao\Exceptions\LimiteDeCartelasExcedido;
use App\Models\Round;

function registrarAposta(Round $round, array $numeros, string $phone = '82991234589', string $nome = 'Rafael Silva')
{
    return app(RegistrarAposta::class)->handle($round, new ApostaData(
        bettorName: $nome,
        bettorPhone: $phone,
        numbers: $numeros,
        acceptedIp: '187.10.20.30',
        bettorEmail: null,
    ));
}

test('aposta nasce aguardando pagamento, com números em ordem crescente e aceite gravado', function () {
    $round = Round::factory()->aberta()->create(['bet_amount_cents' => 2500, 'rules_version' => '1.2']);

    $bet = registrarAposta($round, [60, 5, 33, 1, 47, 12, 25, 51, 8, 19]);

    expect($bet->status)->toBe(BetStatus::AwaitingPayment)
        ->and($bet->numbers)->toBe([1, 5, 8, 12, 19, 25, 33, 47, 51, 60])
        ->and($bet->amount_cents)->toBe(2500)
        ->and($bet->accepted_rules_version)->toBe('1.2')
        ->and($bet->accepted_ip)->toBe('187.10.20.30')
        ->and($bet->accepted_at)->not->toBeNull()
        ->and($bet->betNumbers()->count())->toBe(10)
        ->and($bet->bettor->phone)->toBe('+5582991234589');
});

test('aposta não conta no pote antes de paga', function () {
    $round = Round::factory()->aberta()->create();

    registrarAposta($round, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    expect(app(App\Domain\Bolao\Services\RateioService::class)->poteCents($round))->toBe(0);
});

test('reaproveita o apostador pelo telefone normalizado', function () {
    $round = Round::factory()->aberta()->create();

    $a = registrarAposta($round, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], phone: '(82) 99123-4589');
    $b = registrarAposta($round, [11, 12, 13, 14, 15, 16, 17, 18, 19, 20], phone: '+5582991234589');

    expect($a->bettor_id)->toBe($b->bettor_id);
});

test('rejeita aposta depois do encerramento das apostas', function () {
    $round = Round::factory()->aberta()->create(['bets_close_at' => now()->subMinute()]);

    registrarAposta($round, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
})->throws(ApostasEncerradas::class);

test('rejeita aposta em rodada que não está aberta', function () {
    $round = Round::factory()->emAndamento()->create(['bets_close_at' => now()->addDay()]);

    registrarAposta($round, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
})->throws(ApostasEncerradas::class);

test('respeita o limite de cartelas por pessoa', function () {
    $round = Round::factory()->aberta()->create(['max_bets_per_person' => 2]);

    registrarAposta($round, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    registrarAposta($round, [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    registrarAposta($round, [21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);
})->throws(LimiteDeCartelasExcedido::class);

test('cartelas expiradas ou canceladas não contam no limite', function () {
    $round = Round::factory()->aberta()->create(['max_bets_per_person' => 2]);

    $primeira = registrarAposta($round, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    $primeira->update(['status' => BetStatus::Expired]);
    registrarAposta($round, [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    $terceira = registrarAposta($round, [21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);

    expect($terceira->status)->toBe(BetStatus::AwaitingPayment);
});

test('cartelas idênticas de pessoas diferentes são permitidas', function () {
    $round = Round::factory()->aberta()->create();

    $a = registrarAposta($round, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], phone: '82991111111', nome: 'Ana');
    $b = registrarAposta($round, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], phone: '82992222222', nome: 'Bia');

    expect($a->numbers)->toBe($b->numbers)
        ->and($a->bettor_id)->not->toBe($b->bettor_id);
});
