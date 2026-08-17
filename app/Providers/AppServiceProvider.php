<?php

namespace App\Providers;

use App\Domain\Bolao\Events\RankingAtualizado;
use App\Domain\Bolao\Events\RodadaEncerrada;
use App\Domain\Bolao\Events\SorteioPublicado;
use App\Listeners\InvalidarCacheDaRodada;
use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(\App\Settings\SettingsRepository::class);
    }

    public function boot(): void
    {
        Gate::define('administrar-bolao', fn (User $user): bool => $user->is_admin === true);

        Event::listen(
            [SorteioPublicado::class, RankingAtualizado::class, RodadaEncerrada::class],
            InvalidarCacheDaRodada::class,
        );

        RateLimiter::for('apostas', fn (Request $request) => Limit::perMinute(5)->by($request->ip()));

        // Login do apostador é só por telefone: limita tentativas para
        // dificultar enumeração de números.
        RateLimiter::for('apostador-login', fn (Request $request) => Limit::perMinute(5)->by($request->ip()));
    }
}
