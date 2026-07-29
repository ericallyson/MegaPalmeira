<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BetNumber extends Model
{
    public $timestamps = false;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'bet_id',
        'number',
        'matched_draw_id',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'number' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Bet, $this>
     */
    public function bet(): BelongsTo
    {
        return $this->belongsTo(Bet::class);
    }

    /**
     * @return BelongsTo<Draw, $this>
     */
    public function matchedDraw(): BelongsTo
    {
        return $this->belongsTo(Draw::class, 'matched_draw_id');
    }
}
