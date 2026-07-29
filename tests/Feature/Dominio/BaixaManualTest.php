<?php

use App\Domain\Bolao\Actions\DarBaixaManual;
use App\Domain\Bolao\Enums\BetStatus;
use App\Domain\Bolao\Enums\PaidMethod;
use App\Domain\Bolao\Exceptions\MotivoObrigatorio;
use App\Models\Bet;
use App\Models\Round;
use App\Models\User;

test('baixa manual marca a aposta como paga e registra o responsável e o motivo', function () {
    $round = Round::factory()->aberta()->create();
    $bet = Bet::factory()->comNumeros([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])->for($round)->create();
    $admin = User::factory()->admin()->create();

    app(DarBaixaManual::class)->handle($bet, 'Pagou em dinheiro na portaria', $admin);

    $bet->refresh();
    $log = $bet->statusLogs()->latest('id')->first();

    expect($bet->status)->toBe(BetStatus::Paid)
        ->and($bet->paid_method)->toBe(PaidMethod::Manual)
        ->and($bet->paid_at)->not->toBeNull()
        ->and($log->from_status)->toBe('awaiting_payment')
        ->and($log->to_status)->toBe('paid')
        ->and($log->reason)->toBe('Pagou em dinheiro na portaria')
        ->and($log->actor_type)->toBe('user')
        ->and($log->actor_id)->toBe($admin->id);
});

test('baixa manual sem motivo é rejeitada', function () {
    $bet = Bet::factory()->create();

    app(DarBaixaManual::class)->handle($bet, '', User::factory()->admin()->create());
})->throws(MotivoObrigatorio::class);

test('baixa manual depois de sorteios publicados reapura a cartela retroativamente', function () {
    $round = Round::factory()->emAndamento()->create();
    Bet::factory()->paga()->comNumeros([41, 42, 43, 44, 45, 46, 47, 48, 49, 50])->for($round)->create();

    $draw1 = publicarSorteio($round, [1, 2, 3, 55, 56, 57]);
    $draw2 = publicarSorteio($round, [4, 5, 58, 59, 60, 54]);

    $atrasada = Bet::factory()->comNumeros([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])->for($round)->create();
    expect($atrasada->hits_count)->toBe(0);

    app(DarBaixaManual::class)->handle($atrasada, 'PIX caiu na conta errada, conferido no extrato', User::factory()->admin()->create());

    $atrasada->refresh();
    expect($atrasada->hits_count)->toBe(5)
        ->and($atrasada->betNumbers()->where('number', 1)->value('matched_draw_id'))->toBe($draw1->id)
        ->and($atrasada->betNumbers()->where('number', 4)->value('matched_draw_id'))->toBe($draw2->id);
});
