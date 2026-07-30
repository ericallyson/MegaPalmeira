<?php

namespace App\Domain\Bolao\Events;

use App\Domain\Bolao\Services\SnapshotService;
use App\Models\Draw;
use App\Models\Round;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SorteioPublicado implements ShouldBroadcast, ShouldDispatchAfterCommit
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Round $round,
        public Draw $draw,
    ) {}

    public function broadcastOn(): Channel
    {
        return new Channel("rodada.{$this->round->uuid}");
    }

    public function broadcastAs(): string
    {
        return 'sorteio.publicado';
    }

    public function broadcastQueue(): string
    {
        return 'notifications';
    }

    /**
     * O payload carrega o ranking completo: o cliente anima o
     * acendimento sem precisar de nenhum round-trip extra.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        $snapshot = app(SnapshotService::class)->publicSnapshot($this->round->refresh());

        return [
            ...$snapshot,
            'sorteio' => [
                'id' => $this->draw->id,
                'concurso' => $this->draw->contest_number,
                'data' => $this->draw->drawn_on->toDateString(),
                'dezenas' => $this->draw->numbers,
            ],
        ];
    }
}
