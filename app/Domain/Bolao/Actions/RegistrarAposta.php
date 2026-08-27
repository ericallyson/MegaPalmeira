<?php

namespace App\Domain\Bolao\Actions;

use App\Domain\Bolao\Data\ApostaData;
use App\Domain\Bolao\Enums\BetStatus;
use App\Domain\Bolao\Exceptions\ApostasEncerradas;
use App\Domain\Bolao\Exceptions\LimiteDeCartelasExcedido;
use App\Models\Bet;
use App\Models\Bettor;
use App\Models\Round;
use App\Models\User;
use App\Rules\ValidBetNumbers;
use App\Support\PhoneNumber;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RegistrarAposta
{
    public function handle(Round $round, ApostaData $data, ?User $createdBy = null): Bet
    {
        if (! $round->status->acceptsBets() || now()->isAfter($round->bets_close_at)) {
            throw ApostasEncerradas::make();
        }

        Validator::make(
            ['numbers' => $data->numbers],
            ['numbers' => ['required', new ValidBetNumbers]],
        )->validate();

        $numbers = array_map(intval(...), $data->numbers);
        sort($numbers);

        return DB::transaction(function () use ($round, $data, $numbers, $createdBy): Bet {
            $bettor = Bettor::query()->firstOrCreate(
                ['phone' => PhoneNumber::e164($data->bettorPhone)],
                [
                    'name' => $data->bettorName,
                    'email' => $data->bettorEmail,
                ],
            );

            $activeBets = $round->bets()
                ->where('bettor_id', $bettor->id)
                ->whereIn('status', [BetStatus::AwaitingPayment, BetStatus::Paid, BetStatus::PaidLate])
                ->count();

            if ($round->max_bets_per_person > 0 && $activeBets >= $round->max_bets_per_person) {
                throw LimiteDeCartelasExcedido::make($round->max_bets_per_person);
            }

            /** @var Bet $bet */
            $bet = $round->bets()->create([
                'bettor_id' => $bettor->id,
                'seller_id' => $data->sellerId,
                'numbers' => $numbers,
                'amount_cents' => $round->bet_amount_cents,
                'status' => BetStatus::AwaitingPayment,
                'accepted_rules_version' => $round->rules_version,
                'accepted_ip' => $data->acceptedIp,
                'accepted_at' => now(),
                'created_by' => $createdBy?->id,
            ]);

            $bet->betNumbers()->createMany(
                array_map(fn (int $n): array => ['number' => $n], $numbers),
            );

            $bet->statusLogs()->create([
                'from_status' => null,
                'to_status' => BetStatus::AwaitingPayment->value,
                'reason' => 'Aposta registrada',
                'actor_type' => $createdBy !== null ? 'user' : 'bettor',
                'actor_id' => $createdBy?->id,
            ]);

            return $bet;
        });
    }
}
