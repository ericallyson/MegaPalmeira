<?php

use App\Models\Bet;
use App\Models\Round;
use App\Models\User;

function adminCom2fa(): User
{
    return User::factory()->admin()->create(['two_factor_confirmed_at' => now()]);
}

test('relatório de rodada em andamento não existe ainda', function () {
    $round = Round::factory()->emAndamento()->create();

    $this->actingAs(adminCom2fa())
        ->get("/admin/rodadas/{$round->uuid}/relatorio")
        ->assertRedirect("/admin/rodadas/{$round->uuid}");
});

test('relatório de rodada encerrada abre com hash e conferência', function () {
    $round = Round::factory()->emAndamento()->create();
    Bet::factory()->paga()->comNumeros([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])->for($round)->create();
    publicarSorteio($round, [1, 2, 3, 4, 5, 6]);
    publicarSorteio($round, [7, 8, 9, 10, 59, 60]);

    $this->actingAs(adminCom2fa())
        ->get("/admin/rodadas/{$round->refresh()->uuid}/relatorio")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Admin/Rounds/Relatorio')
            ->where('relatorio.financeiro.conferenciaFecha', true)
            ->has('hash'));
});

test('csv do relatório baixa com o nome da rodada', function () {
    $round = Round::factory()->emAndamento()->create(['slug' => 'bolao-teste']);
    Bet::factory()->paga()->comNumeros([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])->for($round)->create();
    publicarSorteio($round, [1, 2, 3, 4, 5, 6]);
    publicarSorteio($round, [7, 8, 9, 10, 59, 60]);

    $this->actingAs(adminCom2fa())
        ->get("/admin/rodadas/{$round->refresh()->uuid}/relatorio.csv")
        ->assertOk()
        ->assertHeader('Content-Disposition', 'attachment; filename="relatorio-bolao-teste.csv"');
});

test('registrar pagamento de prêmio grava paid_at e observação', function () {
    $round = Round::factory()->emAndamento()->create();
    Bet::factory()->paga()->comNumeros([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])->for($round)->create();
    publicarSorteio($round, [1, 2, 3, 4, 5, 6]);
    publicarSorteio($round, [7, 8, 9, 10, 59, 60]);

    $payout = $round->refresh()->payouts()->firstOrFail();

    $this->actingAs(adminCom2fa())
        ->post("/admin/payouts/{$payout->id}/pagar", ['observacoes' => 'PIX enviado 30/07'])
        ->assertRedirect();

    expect($payout->refresh()->paid_at)->not->toBeNull()
        ->and($payout->notes)->toBe('PIX enviado 30/07');
});
