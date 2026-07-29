<?php

namespace App\Models;

use App\Domain\Bolao\Enums\BetStatus;
use App\Domain\Bolao\Enums\PaidMethod;
use Database\Factories\BetFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bet extends Model
{
    /** @use HasFactory<BetFactory> */
    use HasFactory, HasUuids;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'round_id',
        'bettor_id',
        'numbers',
        'amount_cents',
        'status',
        'paid_at',
        'paid_method',
        'hits_count',
        'completed_at_draw_id',
        'accepted_rules_version',
        'accepted_ip',
        'accepted_at',
        'created_by',
    ];

    /**
     * @return array<string, string|class-string>
     */
    protected function casts(): array
    {
        return [
            'numbers' => 'array',
            'amount_cents' => 'integer',
            'status' => BetStatus::class,
            'paid_at' => 'datetime',
            'paid_method' => PaidMethod::class,
            'hits_count' => 'integer',
            'accepted_at' => 'datetime',
        ];
    }

    /**
     * @return list<string>
     */
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    /**
     * @return BelongsTo<Round, $this>
     */
    public function round(): BelongsTo
    {
        return $this->belongsTo(Round::class);
    }

    /**
     * @return BelongsTo<Bettor, $this>
     */
    public function bettor(): BelongsTo
    {
        return $this->belongsTo(Bettor::class);
    }

    /**
     * @return HasMany<BetNumber, $this>
     */
    public function betNumbers(): HasMany
    {
        return $this->hasMany(BetNumber::class);
    }

    /**
     * @return BelongsTo<Draw, $this>
     */
    public function completedAtDraw(): BelongsTo
    {
        return $this->belongsTo(Draw::class, 'completed_at_draw_id');
    }

    /**
     * @return HasMany<Payment, $this>
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * @return HasMany<BetStatusLog, $this>
     */
    public function statusLogs(): HasMany
    {
        return $this->hasMany(BetStatusLog::class);
    }
}
