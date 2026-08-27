<?php

namespace Database\Factories;

use App\Models\Seller;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Seller>
 */
class SellerFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->name();

        return [
            'name' => $name,
            'phone' => '+5582'.fake()->numerify('9########'),
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(1, 99999),
            'commission_pct' => fake()->numberBetween(5, 20),
            'group_url' => 'https://chat.whatsapp.com/'.fake()->bothify('??????????'),
            'password' => 'senha-do-vendedor',
        ];
    }
}
