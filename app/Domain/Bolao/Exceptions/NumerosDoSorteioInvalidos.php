<?php

namespace App\Domain\Bolao\Exceptions;

class NumerosDoSorteioInvalidos extends BolaoException
{
    public static function make(): self
    {
        return new self('O sorteio precisa de exatamente 6 dezenas distintas entre 1 e 60.');
    }
}
