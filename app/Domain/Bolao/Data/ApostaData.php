<?php

namespace App\Domain\Bolao\Data;

use Spatie\LaravelData\Data;

class ApostaData extends Data
{
    /**
     * @param  list<int>  $numbers
     */
    public function __construct(
        public string $bettorName,
        public string $bettorPhone,
        public string $bettorBirthDate,
        public array $numbers,
        public string $acceptedIp,
        public ?string $bettorEmail = null,
    ) {}
}
