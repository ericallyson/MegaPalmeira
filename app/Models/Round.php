<?php

namespace App\Models;

use App\Domain\Bolao\Enums\BetStatus;
use App\Domain\Bolao\Enums\NoWinnerPolicy;
use App\Domain\Bolao\Enums\RoundStatus;
use Database\Factories\RoundFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Round extends Model
{
    /** @use HasFactory<RoundFactory> */
    use HasFactory, HasUuids;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'starts_on',
        'bets_close_at',
        'bet_amount_cents',
        'pct_main',
        'pct_second',
        'pct_admin',
        'max_draws',
        'max_bets_per_person',
        'min_paid_bets',
        'no_winner_policy',
        'rollover_in_cents',
        'status',
        'rules_version',
        'closed_at',
        'created_by',
    ];

    /**
     * @return array<string, string|class-string>
     */
    protected function casts(): array
    {
        return [
            'starts_on' => 'date',
            'bets_close_at' => 'datetime',
            'bet_amount_cents' => 'integer',
            'pct_main' => 'integer',
            'pct_second' => 'integer',
            'pct_admin' => 'integer',
            'max_draws' => 'integer',
            'max_bets_per_person' => 'integer',
            'min_paid_bets' => 'integer',
            'no_winner_policy' => NoWinnerPolicy::class,
            'rollover_in_cents' => 'integer',
            'status' => RoundStatus::class,
            'closed_at' => 'datetime',
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
     * @return HasMany<Bet, $this>
     */
    public function bets(): HasMany
    {
        return $this->hasMany(Bet::class);
    }

    /**
     * @return HasMany<Bet, $this>
     */
    public function paidBets(): HasMany
    {
        return $this->bets()->where('status', BetStatus::Paid);
    }

    /**
     * @return HasMany<Draw, $this>
     */
    public function draws(): HasMany
    {
        return $this->hasMany(Draw::class);
    }

    /**
     * @return HasMany<Payout, $this>
     */
    public function payouts(): HasMany
    {
        return $this->hasMany(Payout::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
