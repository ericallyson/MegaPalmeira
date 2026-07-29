<?php

namespace App\Models;

use Database\Factories\BettorFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bettor extends Model
{
    /** @use HasFactory<BettorFactory> */
    use HasFactory, HasUuids;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'phone',
        'email',
    ];

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
}
