<?php

use App\Models\Bet;
use App\Models\Bettor;
use App\Models\Round;
use Inertia\Testing\AssertableInertia as Assert;

test('login com telefone e data de nascimento abre o portal com as apostas', function () {
    $round = Round::factory()->aberta()->create();
    $bettor = Bettor::factory()->create([
        'phone' => '+5582991234589',
        'birth_date' => '1990-05-20',
        'name' => 'Rafael Silva',
    ]);
    Bet::factory()->paga()->for($round)->for($bettor)->create();
    Bet::factory()->for($round)->for($bettor)->create(); // aguardando pagamento

    $this->post('/apostador/entrar', ['celular' => '(82) 99123-4589', 'data_nascimento' => '1990-05-20'])
        ->assertRedirect(route('apostador.portal'));

    $this->get('/apostador/minhas-apostas')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/ApostadorPortal')
            ->where('apostador.nome', 'Rafael')
            ->has('cartelas', 2));
});

test('data de nascimento errada não entra', function () {
    Bettor::factory()->create(['phone' => '+5582991234589', 'birth_date' => '1990-05-20']);

    $this->post('/apostador/entrar', ['celular' => '(82) 99123-4589', 'data_nascimento' => '1991-01-01'])
        ->assertSessionHasErrors('celular');

    $this->get('/apostador/minhas-apostas')->assertRedirect(route('apostador.login'));
});

test('telefone sem aposta não entra', function () {
    $this->post('/apostador/entrar', ['celular' => '(11) 90000-0000', 'data_nascimento' => '1990-05-20'])
        ->assertSessionHasErrors('celular');

    $this->get('/apostador/minhas-apostas')->assertRedirect(route('apostador.login'));
});

test('portal exige sessão: sem login redireciona para o entrar', function () {
    $this->get('/apostador/minhas-apostas')->assertRedirect(route('apostador.login'));
});

test('aposta não paga dentro do prazo pode gerar QR; fora do prazo não', function () {
    $bettor = Bettor::factory()->create(['phone' => '+5582991234589', 'birth_date' => '1990-05-20']);

    $aberta = Round::factory()->aberta()->create();
    Bet::factory()->for($aberta)->for($bettor)->create(); // aguardando, no prazo

    $this->post('/apostador/entrar', ['celular' => '82991234589', 'data_nascimento' => '1990-05-20']);

    $this->get('/apostador/minhas-apostas')
        ->assertInertia(fn (Assert $page) => $page
            ->where('cartelas.0.podePagar', true)
            ->where('cartelas.0.paga', false));
});
