<?php

namespace App\Domain\Bolao\Data;

use Spatie\LaravelData\Data;

class RankingItemData extends Data
{
    /**
     * @param  list<array{number: int, matchedDrawId: int|null}>  $numbers
     */
    public function __construct(
        public int $position,
        public string $betUuid,
        public string $displayName,
        public string $maskedPhone,
        public array $numbers,
        public int $hitsCount,
    ) {}
}
