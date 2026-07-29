<?php

namespace App\Domain\Bolao\Enums;

enum RoundStatus: string
{
    case Draft = 'draft';
    case Open = 'open';
    case Running = 'running';
    case Closed = 'closed';
    case Canceled = 'canceled';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Rascunho',
            self::Open => 'Aberta',
            self::Running => 'Em andamento',
            self::Closed => 'Encerrada',
            self::Canceled => 'Cancelada',
        };
    }

    public function acceptsBets(): bool
    {
        return $this === self::Open;
    }

    public function acceptsDraws(): bool
    {
        return $this === self::Running;
    }
}
