<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    public function definition(): array
    {
        return [
            'system' => $this->faker->randomElement(['A', 'B']),
            'name' => $this->faker->name,
            'account_number' => $this->faker->unique()->bankAccountNumber,
            'identity_number' => $this->faker->unique()->numerify('###########'), // 11-digit fake IC
        ];
    }
}
