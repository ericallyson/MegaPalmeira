<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentWebhookEvent extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'provider',
        'provider_event_id',
        'type',
        'payload',
        'processed_at',
        'error',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'processed_at' => 'datetime',
        ];
    }
}
