<?php

namespace Database\Factories;

use App\Domain\Bolao\Enums\NoWinnerPolicy;
use App\Domain\Bolao\Enums\RoundStatus;
use App\Models\Draw;
use App\Models\Round;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Round>
 */
class RoundFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = 'Bolão '.fake()->unique()->numerify('###');
        $startsOn = now()->addWeek()->startOfDay();

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'starts_on' => $startsOn,
            'bets_close_at' => $startsOn->copy()->setTime(18, 0),
            'bet_amount_cents' => 2000,
            'pct_main' => 70,
            'pct_second' => 15,
            'pct_admin' => 15,
            'max_draws' => 0,
            'max_bets_per_person' => 5,
            'min_paid_bets' => 10,
            'no_winner_policy' => NoWinnerPolicy::HighestScore,
            'rollover_in_cents' => 0,
            'status' => RoundStatus::Draft,
            'rules_version' => '1.0',
        ];
    }

    public function aberta(): static
    {
        return $this->state(fn (): array => ['status' => RoundStatus::Open]);
    }

    public function emAndamento(): static
    {
        return $this->state(fn (): array => [
            'status' => RoundStatus::Running,
            'starts_on' => now()->subWeek()->startOfDay(),
            'bets_close_at' => now()->subWeek()->setTime(18, 0),
        ]);
    }

    public function comSorteios(int $n): static
    {
        return $this->emAndamento()->afterCreating(function (Round $round) use ($n): void {
            $firstContest = fake()->numberBetween(2800, 2900);

            for ($i = 1; $i <= $n; $i++) {
                Draw::factory()->create([
                    'round_id' => $round->id,
                    'contest_number' => $firstContest + $i,
                    'sequence' => $i,
                    'drawn_on' => $round->starts_on->copy()->addDays(($i - 1) * 3),
                ]);
            }
        });
    }
}
