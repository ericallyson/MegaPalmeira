<?php

namespace Database\Factories;

use App\Domain\Bolao\Enums\BetStatus;
use App\Domain\Bolao\Enums\PaidMethod;
use App\Models\Bet;
use App\Models\Bettor;
use App\Models\Round;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Bet>
 */
class BetFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $numbers = fake()->randomElements(range(1, 60), 10);
        sort($numbers);

        return [
            'round_id' => Round::factory(),
            'bettor_id' => Bettor::factory(),
            'numbers' => $numbers,
            'amount_cents' => 2000,
            'status' => BetStatus::AwaitingPayment,
            'hits_count' => 0,
            'accepted_rules_version' => '1.0',
            'accepted_ip' => fake()->ipv4(),
            'accepted_at' => now(),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Bet $bet): void {
            if ($bet->betNumbers()->count() > 0) {
                return;
            }

            $bet->betNumbers()->createMany(
                collect($bet->numbers)->map(fn (int $n): array => ['number' => $n])->all(),
            );
        });
    }

    public function paga(): static
    {
        return $this->state(fn (): array => [
            'status' => BetStatus::Paid,
            'paid_at' => now(),
            'paid_method' => PaidMethod::Pix,
        ]);
    }

    /**
     * @param  list<int>  $numbers
     */
    public function comNumeros(array $numbers): static
    {
        sort($numbers);

        return $this->state(fn (): array => ['numbers' => $numbers]);
    }
}
