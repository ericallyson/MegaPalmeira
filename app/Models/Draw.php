<?php

namespace App\Models;

use Database\Factories\DrawFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Draw extends Model
{
    /** @use HasFactory<DrawFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'round_id',
        'contest_number',
        'drawn_on',
        'numbers',
        'sequence',
        'published_at',
        'created_by',
        'corrected_at',
        'correction_reason',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'contest_number' => 'integer',
            'drawn_on' => 'date',
            'numbers' => 'array',
            'sequence' => 'integer',
            'published_at' => 'datetime',
            'corrected_at' => 'datetime',
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
     * @return HasMany<BetNumber, $this>
     */
    public function matchedNumbers(): HasMany
    {
        return $this->hasMany(BetNumber::class, 'matched_draw_id');
    }
}
