<?php

use App\Models\Bet;
use App\Models\Bettor;
use App\Models\Round;
use Inertia\Testing\AssertableInertia as Assert;

test('home mostra a rodada aberta', function () {
    $round = Round::factory()->aberta()->create(['name' => 'Bolão de Agosto']);
    Bet::factory()->count(3)->paga()->for($round)->create();

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/Home')
            ->where('rodada.nome', 'Bolão de Agosto')
            ->where('rodada.status', 'open')
            ->where('rodada.cartelasPagas', 3)
            // pote exibido é líquido: 6000 bruto − 15% de comissão = 5100
            ->where('rodada.poteCents', 5100)
            ->has('ranking', 3));
});

test('home mostra a rodada em andamento com sorteios e ranking', function () {
    $round = Round::factory()->emAndamento()->create();
    Bet::factory()->paga()->comNumeros([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])->for($round)->create();

    publicarSorteio($round, [1, 2, 3, 40, 41, 42]);

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/Home')
            ->where('rodada.status', 'running')
            ->has('sorteios', 1)
            ->where('ranking.0.hitsCount', 3));
});

test('home sem rodada ativa mostra estado vazio', function () {
    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/Home')
            ->where('rodada', null));
});

test('contrato: a home nunca expõe o telefone completo do apostador', function () {
    $round = Round::factory()->emAndamento()->create();
    Bet::factory()->paga()
        ->for($round)
        ->for(Bettor::factory()->create(['name' => 'Rafael Silva', 'phone' => '+5582991234589']))
        ->create();

    $response = $this->get('/')->assertOk();
    $content = $response->getContent();

    expect($content)->not->toContain('991234589')
        ->and($content)->not->toContain('5582991234589')
        ->and($content)->toContain('99xxx-xx89');
});
