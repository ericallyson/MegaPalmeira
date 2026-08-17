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
            'birth_date' => fake()->dateTimeBetween('-70 years', '-18 years')->format('Y-m-d'),
            'email' => fake()->optional()->safeEmail(),
        ];
    }
}
