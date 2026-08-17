<?php

use App\Http\Controllers\Admin\BetController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DrawController;
use App\Http\Controllers\Admin\PayoutController;
use App\Http\Controllers\Admin\RelatorioController;
use App\Http\Controllers\Admin\RoundController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\TwoFactorSetupController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Public\BettorController;
use App\Http\Controllers\Public\BettorPortalController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\RankingApiController;
use App\Http\Controllers\Public\RegulamentoController;
use App\Http\Controllers\Webhooks\MercadoPagoWebhookController;
use App\Http\Middleware\EnsureTwoFactorIsEnabled;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::post('/webhooks/mercadopago', MercadoPagoWebhookController::class)
    ->name('webhooks.mercadopago');

Route::get('/apostar', [App\Http\Controllers\Public\BetController::class, 'create'])->name('apostas.create');
Route::post('/apostas', [App\Http\Controllers\Public\BetController::class, 'store'])
    ->middleware('throttle:apostas')
    ->name('apostas.store');
Route::get('/apostas/{bet:uuid}', [App\Http\Controllers\Public\BetController::class, 'checkout'])->name('apostas.checkout');
Route::get('/apostas/{bet:uuid}/status', [App\Http\Controllers\Public\BetController::class, 'status'])->name('apostas.status');
Route::post('/apostas/{bet:uuid}/qr', [App\Http\Controllers\Public\BetController::class, 'regenerarQr'])
    ->middleware('throttle:apostas')
    ->name('apostas.qr');
Route::get('/minhas-cartelas/{bettor:uuid}', BettorController::class)
    ->middleware('signed')
    ->name('apostador.cartelas');

// Portal do apostador: login só com telefone completo.
Route::get('/apostador/entrar', [BettorPortalController::class, 'showLogin'])->name('apostador.login');
Route::post('/apostador/entrar', [BettorPortalController::class, 'login'])
    ->middleware('throttle:apostador-login')
    ->name('apostador.login.attempt');
Route::post('/apostador/sair', [BettorPortalController::class, 'logout'])->name('apostador.logout');
Route::get('/apostador/minhas-apostas', [BettorPortalController::class, 'cartelas'])->name('apostador.portal');
Route::get('/api/rodada-atual/ranking', RankingApiController::class)
    ->name('api.ranking');
Route::get('/regulamento', RegulamentoController::class)->name('regulamento');

Route::middleware(['auth', 'can:administrar-bolao'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function (): void {
        Route::get('/2fa', TwoFactorSetupController::class)->name('2fa');

        Route::middleware(EnsureTwoFactorIsEnabled::class)->group(function (): void {
            Route::get('/', DashboardController::class)->name('dashboard');

            Route::get('/rodadas', [RoundController::class, 'index'])->name('rodadas.index');
            Route::get('/rodadas/criar', [RoundController::class, 'create'])->name('rodadas.create');
            Route::post('/rodadas', [RoundController::class, 'store'])->name('rodadas.store');
            Route::get('/rodadas/{round:uuid}', [RoundController::class, 'show'])->name('rodadas.show');
            Route::post('/rodadas/{round:uuid}/abrir', [RoundController::class, 'abrir'])->name('rodadas.abrir');
            Route::post('/rodadas/{round:uuid}/cancelar', [RoundController::class, 'cancelar'])->name('rodadas.cancelar');
            Route::post('/rodadas/{round:uuid}/encerrar', [RoundController::class, 'encerrar'])->name('rodadas.encerrar');

            Route::post('/rodadas/{round:uuid}/sorteios/previa', [DrawController::class, 'previa'])->name('sorteios.previa');
            Route::post('/rodadas/{round:uuid}/sorteios', [DrawController::class, 'store'])->name('sorteios.store');
            Route::put('/sorteios/{draw}', [DrawController::class, 'corrigir'])->name('sorteios.corrigir');

            Route::get('/rodadas/{round:uuid}/relatorio', [RelatorioController::class, 'show'])->name('rodadas.relatorio');
            Route::get('/rodadas/{round:uuid}/relatorio.csv', [RelatorioController::class, 'csv'])->name('rodadas.relatorio.csv');
            Route::post('/payouts/{payout}/pagar', [PayoutController::class, 'pagar'])->name('payouts.pagar');

            Route::get('/apostas', [BetController::class, 'index'])->name('apostas.index');
            Route::post('/apostas/{bet:uuid}/baixa', [BetController::class, 'darBaixa'])->name('apostas.baixa');
            Route::post('/apostas/{bet:uuid}/cancelar', [BetController::class, 'cancelar'])->name('apostas.cancelar');

            Route::get('/usuarios', [UserController::class, 'index'])->name('usuarios.index');
            Route::get('/usuarios/criar', [UserController::class, 'create'])->name('usuarios.create');
            Route::post('/usuarios', [UserController::class, 'store'])->name('usuarios.store');
            Route::get('/usuarios/{user}/editar', [UserController::class, 'edit'])->name('usuarios.edit');
            Route::put('/usuarios/{user}', [UserController::class, 'update'])->name('usuarios.update');
            Route::post('/usuarios/{user}/reset-2fa', [UserController::class, 'resetTwoFactor'])->name('usuarios.reset2fa');
            Route::delete('/usuarios/{user}', [UserController::class, 'destroy'])->name('usuarios.destroy');

            Route::get('/configuracoes', [SettingsController::class, 'edit'])->name('configuracoes.edit');
            Route::put('/configuracoes', [SettingsController::class, 'update'])->name('configuracoes.update');
        });
    });
