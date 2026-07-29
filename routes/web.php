<?php

use App\Http\Controllers\Admin\BetController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DrawController;
use App\Http\Controllers\Admin\RoundController;
use App\Http\Controllers\Admin\TwoFactorSetupController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Middleware\EnsureTwoFactorIsEnabled;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

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

            Route::get('/apostas', [BetController::class, 'index'])->name('apostas.index');
            Route::post('/apostas/{bet:uuid}/baixa', [BetController::class, 'darBaixa'])->name('apostas.baixa');
            Route::post('/apostas/{bet:uuid}/cancelar', [BetController::class, 'cancelar'])->name('apostas.cancelar');
        });
    });
