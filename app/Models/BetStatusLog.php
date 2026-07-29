<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BetStatusLog extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'bet_id',
        'from_status',
        'to_status',
        'reason',
        'actor_type',
        'actor_id',
    ];

    /**
     * @return BelongsTo<Bet, $this>
     */
    public function bet(): BelongsTo
    {
        return $this->belongsTo(Bet::class);
    }
}
