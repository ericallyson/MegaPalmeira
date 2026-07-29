<?php

namespace App\Domain\Bolao\Exceptions;

use App\Domain\Bolao\Enums\RoundStatus;

class RodadaNaoAceitaSorteios extends BolaoException
{
    public static function porStatus(RoundStatus $status): self
    {
        return new self("A rodada não aceita sorteios no estado \"{$status->label()}\".");
    }

    public static function limiteAtingido(int $maxDraws): self
    {
        return new self("A rodada já atingiu o limite de {$maxDraws} sorteios.");
    }
}
