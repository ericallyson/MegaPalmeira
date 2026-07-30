<?php

use App\Domain\Bolao\Actions\DarBaixaManual;
use App\Domain\Bolao\Services\RelatorioService;
use App\Models\Bet;
use App\Models\Bettor;
use App\Models\Round;
use App\Models\User;

function rodadaEncerradaComVencedora(): Round
{
    $round = Round::factory()->emAndamento()->create(['bet_amount_cents' => 2003, 'rollover_in_cents' => 7]);

    Bet::factory()->paga()
        ->comNumeros([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        ->for($round)
        ->for(Bettor::factory()->create(['name' => 'Rafael Silva', 'phone' => '+5582991234589']))
        ->create(['amount_cents' => 2003]);
    Bet::factory()->paga()
        ->comNumeros([1, 2, 11, 12, 13, 14, 15, 16, 17, 18])
        ->for($round)
        ->for(Bettor::factory()->create(['name' => 'Carla Souza']))
        ->create(['amount_cents' => 2003]);
    Bet::factory()->paga()
        ->comNumeros([41, 42, 43, 44, 45, 46, 47, 48, 49, 50])
        ->for($round)
        ->for(Bettor::factory()->create(['name' => 'Bruno Melo']))
        ->create(['amount_cents' => 2003]);

    publicarSorteio($round, [1, 2, 3, 4, 5, 6]);
    publicarSorteio($round, [7, 8, 9, 10, 59, 60]); // fecha 10 e encerra

    return $round->refresh();
}

test('conferência financeira do relatório fecha exata, mesmo com valores primos', function () {
    $round = rodadaEncerradaComVencedora();

    $relatorio = app(RelatorioService::class)->gerar($round);
    $fin = $relatorio['financeiro'];

    // pote 3 × 2003 + 7 = 6016
    expect($fin['poteCents'])->toBe(6016)
        ->and($fin['conferenciaFecha'])->toBeTrue()
        ->and($fin['totalPagoCents'] + $fin['administracaoCents'] + $fin['rolloverSaidaCents'])
        ->toBe($fin['poteCents']);
});

test('relatório identifica ganhadores com telefone mascarado e sorteio de fechamento', function () {
    $round = rodadaEncerradaComVencedora();

    $relatorio = app(RelatorioService::class)->gerar($round);

    $principal = collect($relatorio['ganhadores'])->firstWhere('categoria', 'Prêmio principal');

    expect($principal['nome'])->toBe('Rafael Silva')
        ->and($principal['telefone'])->toBe('(82) 99xxx-xx89')
        ->and($principal['sorteioFechamento'])->not->toBeNull();

    expect(json_encode($relatorio))->not->toContain('991234589');
});

test('histórico de sorteios informa quantas cartelas pontuaram em cada um', function () {
    $round = rodadaEncerradaComVencedora();

    $relatorio = app(RelatorioService::class)->gerar($round);

    // 1º sorteio: Rafael acende 6, Carla acende 2 → 2 cartelas pontuam
    // 2º sorteio: só Rafael acende as 4 restantes → 1 cartela
    $porConcurso = collect($relatorio['sorteios'])->keyBy('sequencia');

    expect($porConcurso[1]['cartelasQuePontuaram'])->toBe(2)
        ->and($porConcurso[2]['cartelasQuePontuaram'])->toBe(1);
});

test('auditoria registra baixas manuais com responsável e motivo', function () {
    $round = Round::factory()->aberta()->create();
    $bet = Bet::factory()->for($round)->create();
    $admin = User::factory()->admin()->create(['name' => 'Eric Admin']);

    app(DarBaixaManual::class)->handle($bet, 'Pagou em dinheiro', $admin);
    $round->update(['status' => 'closed', 'closed_at' => now()]);

    $relatorio = app(RelatorioService::class)->gerar($round->refresh());

    $baixa = collect($relatorio['auditoria'])->firstWhere('tipo', 'Baixa manual');

    expect($baixa['motivo'])->toBe('Pagou em dinheiro')
        ->and($baixa['responsavel'])->toBe('Eric Admin');
});

test('reimprimir o mesmo relatório gera o mesmo hash; registrar pagamento do prêmio não o altera', function () {
    $round = rodadaEncerradaComVencedora();
    $service = app(RelatorioService::class);

    $hash1 = $service->hash($service->gerar($round));
    $hash2 = $service->hash($service->gerar($round->refresh()));

    expect($hash1)->toBe($hash2)->and(strlen($hash1))->toBe(64);

    // marcar o prêmio como pago é pós-fechamento: não muda o hash
    $round->payouts()->first()->update(['paid_at' => now(), 'notes' => 'PIX enviado']);

    $hash3 = $service->hash($service->gerar($round->refresh()));
    expect($hash3)->toBe($hash1);
});

test('csv contém as seções e termina com o hash', function () {
    $round = rodadaEncerradaComVencedora();
    $service = app(RelatorioService::class);

    $relatorio = $service->gerar($round);
    $csv = $service->csv($relatorio);

    expect($csv)->toContain('IDENTIFICAÇÃO')
        ->and($csv)->toContain('FINANCEIRO')
        ->and($csv)->toContain('GANHADORES')
        ->and($csv)->toContain('CLASSIFICAÇÃO')
        ->and($csv)->toContain('SORTEIOS')
        ->and($csv)->toContain('AUDITORIA')
        ->and($csv)->toContain($service->hash($relatorio))
        ->and($csv)->not->toContain('991234589');
});
