<?php

use App\Domain\Bolao\Events\SorteioPublicado;
use App\Models\Bet;
use App\Models\Bettor;
use App\Models\Round;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

test('SorteioPublicado transmite no canal público da rodada com o ranking completo', function () {
    $round = Round::factory()->emAndamento()->create();
    Bet::factory()->paga()
        ->comNumeros([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        ->for($round)
        ->for(Bettor::factory()->create(['name' => 'Rafael Silva', 'phone' => '+5582991234589']))
        ->create();

    $draw = publicarSorteio($round, [1, 2, 3, 40, 41, 42]);

    $event = new SorteioPublicado($round->refresh(), $draw);

    expect($event)->toBeInstanceOf(ShouldBroadcast::class)
        ->and($event->broadcastOn()->name)->toBe("rodada.{$round->uuid}")
        ->and($event->broadcastAs())->toBe('sorteio.publicado');

    $payload = $event->broadcastWith();

    expect($payload['sorteio']['concurso'])->toBe($draw->contest_number)
        ->and($payload['sorteio']['dezenas'])->toBe([1, 2, 3, 40, 41, 42])
        ->and($payload['ranking'])->toHaveCount(1)
        ->and($payload['ranking'][0]['hitsCount'])->toBe(3)
        ->and($payload['rodada']['status'])->toBe('running');

    // contrato: nada de telefone cru no payload transmitido
    $json = json_encode($payload);
    expect($json)->not->toContain('991234589')
        ->and($json)->toContain('99xxx-xx89');
});

test('endpoint de fallback devolve o snapshot da rodada atual sem telefone completo', function () {
    $round = Round::factory()->emAndamento()->create();
    Bet::factory()->paga()
        ->for($round)
        ->for(Bettor::factory()->create(['phone' => '+5582991234589']))
        ->create();

    $response = $this->getJson('/api/rodada-atual/ranking')->assertOk();

    expect($response->json('rodada.uuid'))->toBe($round->uuid)
        ->and($response->json('ranking'))->toHaveCount(1)
        ->and($response->getContent())->not->toContain('991234589');
});

test('endpoint de fallback sem rodada devolve rodada nula', function () {
    $this->getJson('/api/rodada-atual/ranking')->assertOk()->assertJson(['rodada' => null]);
});
