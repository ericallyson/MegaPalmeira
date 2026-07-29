<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasUuids;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'bet_id',
        'provider',
        'provider_payment_id',
        'amount_cents',
        'status',
        'qr_code',
        'qr_code_base64',
        'ticket_url',
        'expires_at',
        'paid_at',
        'payload',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount_cents' => 'integer',
            'expires_at' => 'datetime',
            'paid_at' => 'datetime',
            'payload' => 'array',
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
     * @return BelongsTo<Bet, $this>
     */
    public function bet(): BelongsTo
    {
        return $this->belongsTo(Bet::class);
    }
}
