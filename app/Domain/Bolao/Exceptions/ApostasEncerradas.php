<?php

namespace App\Domain\Bolao\Exceptions;

class ApostasEncerradas extends BolaoException
{
    public static function make(): self
    {
        return new self('As apostas desta rodada já foram encerradas.');
    }
}
