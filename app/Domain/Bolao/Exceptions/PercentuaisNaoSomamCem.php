<?php

namespace App\Domain\Bolao\Exceptions;

class PercentuaisNaoSomamCem extends BolaoException
{
    public static function make(int $main, int $second, int $admin): self
    {
        $sum = $main + $second + $admin;

        return new self(
            "Os percentuais de premiação devem somar 100 ({$main} + {$second} + {$admin} = {$sum}).",
        );
    }
}
