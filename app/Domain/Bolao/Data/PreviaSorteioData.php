<?php

namespace App\Domain\Bolao\Data;

use Spatie\LaravelData\Data;

class PreviaSorteioData extends Data
{
    public function __construct(
        public int $cartelasQuePontuam,
        public int $cartelasQueChegamADez,
        public bool $rodadaSeraEncerrada,
        public int $premioPrincipalCents,
        public int $cotaPorGanhadorCents,
    ) {}
}
