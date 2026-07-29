<?php

namespace App\Models;

use App\Domain\Bolao\Enums\PayoutCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payout extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'round_id',
        'bet_id',
        'category',
        'position',
        'amount_cents',
        'paid_at',
        'notes',
    ];

    /**
     * @return array<string, string|class-string>
     */
    protected function casts(): array
    {
        return [
            'category' => PayoutCategory::class,
            'position' => 'integer',
            'amount_cents' => 'integer',
            'paid_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Round, $this>
     */
    public function round(): BelongsTo
    {
        return $this->belongsTo(Round::class);
    }

    /**
     * @return BelongsTo<Bet, $this>
     */
    public function bet(): BelongsTo
    {
        return $this->belongsTo(Bet::class);
    }
}
