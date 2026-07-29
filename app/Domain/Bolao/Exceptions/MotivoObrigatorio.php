<?php

namespace App\Domain\Bolao\Exceptions;

class MotivoObrigatorio extends BolaoException
{
    public static function make(string $operacao): self
    {
        return new self("Informe o motivo para {$operacao}.");
    }
}
