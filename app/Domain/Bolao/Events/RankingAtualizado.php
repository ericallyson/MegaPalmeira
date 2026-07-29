<?php

namespace App\Domain\Bolao\Events;

use App\Models\Round;
use Illuminate\Foundation\Events\Dispatchable;

class RankingAtualizado
{
    use Dispatchable;

    public function __construct(
        public Round $round,
    ) {}
}
