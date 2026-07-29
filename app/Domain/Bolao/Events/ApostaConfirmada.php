<?php

namespace App\Domain\Bolao\Events;

use App\Models\Bet;
use Illuminate\Foundation\Events\Dispatchable;

class ApostaConfirmada
{
    use Dispatchable;

    public function __construct(
        public Bet $bet,
    ) {}
}
