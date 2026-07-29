<?php

namespace Database\Factories;

use App\Models\Bettor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Bettor>
 */
class BettorFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'phone' => '+5582'.fake()->numerify('9########'),
            'email' => fake()->optional()->safeEmail(),
        ];
    }
}
