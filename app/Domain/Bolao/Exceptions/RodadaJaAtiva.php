<?php

namespace App\Domain\Bolao\Exceptions;

use App\Domain\Bolao\Enums\RoundStatus;

class RodadaJaAtiva extends BolaoException
{
    public static function make(): self
    {
        return new self('Já existe uma rodada aberta ou em andamento. Encerre-a antes de abrir outra.');
    }

    public static function naoERascunho(RoundStatus $status): self
    {
        return new self("Só rodadas em rascunho podem ser abertas (estado atual: \"{$status->label()}\").");
    }
}
