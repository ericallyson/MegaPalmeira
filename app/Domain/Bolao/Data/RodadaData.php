<?php

namespace App\Domain\Bolao\Data;

use App\Domain\Bolao\Enums\NoWinnerPolicy;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;

class RodadaData extends Data
{
    public function __construct(
        public string $name,
        public CarbonImmutable $startsOn,
        public int $betAmountCents,
        public ?CarbonImmutable $betsCloseAt = null,
        public int $pctMain = 70,
        public int $pctSecond = 15,
        public int $pctAdmin = 15,
        public int $maxDraws = 0,
        public int $maxBetsPerPerson = 5,
        public int $minPaidBets = 10,
        public NoWinnerPolicy $noWinnerPolicy = NoWinnerPolicy::HighestScore,
        public int $rolloverInCents = 0,
        public string $rulesVersion = '1.0',
    ) {}
}
