<?php

namespace App\Domain\Bolao\Enums;

enum BetStatus: string
{
    case AwaitingPayment = 'awaiting_payment';
    case Paid = 'paid';
    case PaidLate = 'paid_late';
    case Expired = 'expired';
    case Canceled = 'canceled';
    case Refunded = 'refunded';

    public function label(): string
    {
        return match ($this) {
            self::AwaitingPayment => 'Aguardando pagamento',
            self::Paid => 'Paga',
            self::PaidLate => 'Paga fora do prazo',
            self::Expired => 'Expirada',
            self::Canceled => 'Cancelada',
            self::Refunded => 'Estornada',
        };
    }

    public function countsInPot(): bool
    {
        return $this === self::Paid;
    }
}
