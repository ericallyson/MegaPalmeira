<?php

namespace App\Domain\Bolao\Exceptions;

class LimiteDeCartelasExcedido extends BolaoException
{
    public static function make(int $limit): self
    {
        $cartelas = $limit === 1 ? 'cartela' : 'cartelas';

        return new self("Você já tem {$limit} {$cartelas} nesta rodada, que é o limite por pessoa.");
    }
}
