<?php

namespace Database\Factories;

use App\Models\Draw;
use App\Models\Round;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Draw>
 */
class DrawFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $numbers = fake()->randomElements(range(1, 60), 6);
        sort($numbers);

        return [
            'round_id' => Round::factory(),
            'contest_number' => fake()->unique()->numberBetween(2800, 9999),
            'drawn_on' => now()->subDay(),
            'numbers' => $numbers,
            'sequence' => 1,
            'published_at' => now(),
        ];
    }
}
