<?php

use App\Models\User;

test('visitante é redirecionado para o login', function () {
    $this->get('/admin')->assertRedirect('/login');
});

test('usuário sem permissão de admin recebe 403', function () {
    $user = User::factory()->create(['two_factor_confirmed_at' => now()]);

    $this->actingAs($user)->get('/admin')->assertForbidden();
});

test('rota de admin sem 2FA confirmado é bloqueada e redireciona para a configuração', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->get('/admin')->assertRedirect('/admin/2fa');
    $this->actingAs($admin)->get('/admin/rodadas')->assertRedirect('/admin/2fa');
    $this->actingAs($admin)->get('/admin/apostas')->assertRedirect('/admin/2fa');
});

test('admin com 2FA confirmado acessa o painel', function () {
    $admin = User::factory()->admin()->create(['two_factor_confirmed_at' => now()]);

    $this->actingAs($admin)->get('/admin')->assertOk();
});

test('percentuais que não somam 100 são rejeitados no formulário', function () {
    $admin = User::factory()->admin()->create(['two_factor_confirmed_at' => now()]);

    $this->actingAs($admin)
        ->post('/admin/rodadas', [
            'name' => 'Bolão Torto',
            'starts_on' => now()->addWeek()->toDateString(),
            'bet_amount_cents' => 2000,
            'pct_main' => 70,
            'pct_second' => 20,
            'pct_admin' => 15,
            'max_draws' => 15,
            'max_bets_per_person' => 5,
            'min_paid_bets' => 10,
            'no_winner_policy' => 'highest_score',
        ])
        ->assertSessionHasErrors('pct_main');
});
