<?php

namespace App\Listeners;

use App\Domain\Bolao\Events\RankingAtualizado;
use App\Domain\Bolao\Events\RodadaEncerrada;
use App\Domain\Bolao\Events\SorteioPublicado;
use Illuminate\Support\Facades\Cache;

class InvalidarCacheDaRodada
{
    public function handle(RankingAtualizado|RodadaEncerrada|SorteioPublicado $event): void
    {
        Cache::forget("rodada:{$event->round->id}:ranking");
    }
}
