<?php

namespace App\Domain\Bolao\Events;

use App\Models\Draw;
use App\Models\Round;
use Illuminate\Foundation\Events\Dispatchable;

class SorteioPublicado
{
    use Dispatchable;

    public function __construct(
        public Round $round,
        public Draw $draw,
    ) {}
}
