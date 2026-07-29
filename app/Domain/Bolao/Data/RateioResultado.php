<?php

namespace App\Domain\Bolao\Data;

use Spatie\LaravelData\Data;

class RateioResultado extends Data
{
    public function __construct(
        public int $poteCents,
        public int $premioPrincipalCents,
        public int $cotaPrincipalCents,
        public int $ganhadoresPrincipal,
        public int $premioSegundoCents,
        public int $cotaSegundoCents,
        public int $ganhadoresSegundo,
        public int $administracaoCents,
        public int $rolloverOutCents,
    ) {}

    public function totalPagoCents(): int
    {
        return $this->cotaPrincipalCents * $this->ganhadoresPrincipal
            + $this->cotaSegundoCents * $this->ganhadoresSegundo;
    }
}
