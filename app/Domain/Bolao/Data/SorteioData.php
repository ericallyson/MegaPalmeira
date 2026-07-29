<?php

namespace App\Domain\Bolao\Data;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;

class SorteioData extends Data
{
    /**
     * @param  list<int>  $numbers
     */
    public function __construct(
        public int $contestNumber,
        public CarbonImmutable $drawnOn,
        public array $numbers,
    ) {}
}
