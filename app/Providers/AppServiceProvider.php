<?php

namespace App\Providers;

use App\Domain\Bolao\Events\RankingAtualizado;
use App\Domain\Bolao\Events\RodadaEncerrada;
use App\Domain\Bolao\Events\SorteioPublicado;
use App\Listeners\InvalidarCacheDaRodada;
use App\Models\User;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::define('administrar-bolao', fn (User $user): bool => $user->is_admin === true);

        Event::listen(
            [SorteioPublicado::class, RankingAtualizado::class, RodadaEncerrada::class],
            InvalidarCacheDaRodada::class,
        );
    }
}
