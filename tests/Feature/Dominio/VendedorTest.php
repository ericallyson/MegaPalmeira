<?php

use App\Domain\Bolao\Actions\DarBaixaManual;
use App\Domain\Bolao\Enums\BetStatus;
use App\Domain\Bolao\Enums\PaidMethod;
use App\Domain\Bolao\Services\RelatorioService;
use App\Models\Bet;
use App\Models\Round;
use App\Models\Seller;
use Inertia\Testing\AssertableInertia as Assert;

function payloadApostaVendedor(array $overrides = []): array
{
    return array_merge([
        'nome' => 'Rafael Silva',
        'celular' => '(82) 99123-4589',
        'email' => null,
        'numbers' => [1, 5, 8, 12, 19, 25, 33, 47, 51, 60],
        'aceite_maioridade' => true,
        'aceite_regulamento' => true,
    ], $overrides);
}

test('aposta feita pelo link do vendedor é atribuída a ele', function () {
    $seller = Seller::factory()->create(['slug' => 'joao', 'commission_pct' => 10]);
    Round::factory()->aberta()->create(['bets_close_at' => now()->addDay()]);

    $this->get('/v/joao')->assertOk();
    $this->post('/apostas', payloadApostaVendedor())->assertRedirect();

    expect(Bet::query()->firstOrFail()->seller_id)->toBe($seller->id);
});

test('a home geral zera o vínculo: aposta seguinte não é atribuída', function () {
    Seller::factory()->create(['slug' => 'joao']);
    Round::factory()->aberta()->create(['bets_close_at' => now()->addDay()]);

    $this->get('/v/joao')->assertOk();
    $this->get('/')->assertOk();
    $this->post('/apostas', payloadApostaVendedor())->assertRedirect();

    expect(Bet::query()->firstOrFail()->seller_id)->toBeNull();
});

test('o link do vendedor troca o grupo do WhatsApp pelo grupo dele', function () {
    Seller::factory()->create(['slug' => 'joao', 'group_url' => 'https://chat.whatsapp.com/DOJOAO']);
    Round::factory()->aberta()->create();

    $this->get('/v/joao')
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/Home')
            ->where('rodada.whatsappGroupUrl', 'https://chat.whatsapp.com/DOJOAO')
            ->where('vendedor.nome', fn ($n) => $n !== null));
});

test('portal do vendedor: login por slug+senha e comissão só sobre pagas', function () {
    $seller = Seller::factory()->create([
        'slug' => 'joao',
        'password' => 'segredo123',
        'commission_pct' => 10,
        'name' => 'João Vendedor',
    ]);
    $round = Round::factory()->aberta()->create();

    Bet::factory()->paga()->for($round)->create(['seller_id' => $seller->id, 'amount_cents' => 2000]);
    Bet::factory()->for($round)->create(['seller_id' => $seller->id]); // aguardando: não entra na comissão
    Bet::factory()->paga()->for($round)->create(['amount_cents' => 5000]); // de outro/geral: não é dele

    $this->post('/vendedor/entrar', ['slug' => 'joao', 'senha' => 'segredo123'])
        ->assertRedirect(route('vendedor.painel'));

    $this->get('/vendedor/painel')
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/VendedorPainel')
            ->where('resumo.apostas', 2)
            ->where('resumo.pagas', 1)
            ->where('resumo.arrecadacaoPagasCents', 2000)
            ->where('resumo.comissaoCents', 200)
            ->has('apostas', 2));
});

test('senha errada não entra no portal do vendedor', function () {
    Seller::factory()->create(['slug' => 'joao', 'password' => 'segredo123']);

    $this->post('/vendedor/entrar', ['slug' => 'joao', 'senha' => 'errada'])
        ->assertSessionHasErrors('slug');

    $this->get('/vendedor/painel')->assertRedirect(route('vendedor.entrar'));
});

test('vendedor só dá baixa nas apostas do próprio link', function () {
    $seller = Seller::factory()->create(['slug' => 'joao', 'password' => 'segredo123']);
    $outro = Seller::factory()->create();
    $round = Round::factory()->aberta()->create(['bets_close_at' => now()->addDay()]);

    $minha = Bet::factory()->for($round)->create(['seller_id' => $seller->id]);
    $alheia = Bet::factory()->for($round)->create(['seller_id' => $outro->id]);

    $this->post('/vendedor/entrar', ['slug' => 'joao', 'senha' => 'segredo123']);

    $this->post("/vendedor/apostas/{$alheia->uuid}/baixa", ['motivo' => 'tentativa'])
        ->assertForbidden();

    $this->post("/vendedor/apostas/{$minha->uuid}/baixa", ['motivo' => 'Pagou em dinheiro comigo'])
        ->assertRedirect();

    $minha->refresh();
    expect($minha->status)->toBe(BetStatus::Paid)
        ->and($minha->paid_method)->toBe(PaidMethod::Manual);
});

test('relatório separa baixas automáticas de manuais e detalha por vendedor', function () {
    $seller = Seller::factory()->create(['commission_pct' => 10, 'name' => 'João Vendedor']);
    $round = Round::factory()->aberta()->create();

    Bet::factory()->paga()->for($round)->create(['seller_id' => $seller->id, 'amount_cents' => 2000]);
    $manual = Bet::factory()->for($round)->create(['seller_id' => $seller->id, 'amount_cents' => 2000]);
    app(DarBaixaManual::class)->handle($manual, 'Pagou em dinheiro', $seller);

    $round->update(['status' => 'closed', 'closed_at' => now()]);

    $relatorio = app(RelatorioService::class)->gerar($round->refresh());

    expect($relatorio['baixas']['automaticas']['quantidade'])->toBe(1)
        ->and($relatorio['baixas']['manuais']['quantidade'])->toBe(1);

    $linha = collect($relatorio['baixas']['porVendedor'])->firstWhere('nome', 'João Vendedor');
    expect($linha['apostasPagas'])->toBe(2)
        ->and($linha['baixasManuais'])->toBe(1)
        ->and($linha['comissaoCents'])->toBe(400);

    $baixa = collect($relatorio['auditoria'])->firstWhere('tipo', 'Baixa manual');
    expect($baixa['responsavel'])->toContain('vendedor');
});
