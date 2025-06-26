<?php

namespace Database\Factories;

use App\Models\Receipt;
use App\Models\CollectionCenter;
use App\Models\Counter;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ReceiptFactory extends Factory
{
    protected $model = Receipt::class;

    public function definition(): array
    {
        $amountPaid = $this->faker->randomFloat(2, 10, 500);
        $totalAmount = $this->faker->randomFloat(2, $amountPaid, $amountPaid + 50);

        return [
            'collection_center_id' => CollectionCenter::inRandomOrder()->first()?->id ?? CollectionCenter::factory(),
            'counter_id' => Counter::inRandomOrder()->first()?->id ?? Counter::factory(),
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'date' => $this->faker->date,

            'account_number' => $this->faker->bankAccountNumber,
            'receipt_number' => strtoupper(Str::random(10)),

            'description' => $this->faker->sentence,
            'reference_number' => $this->faker->optional()->uuid,
            'total_amount' => $totalAmount,
            'payment_type' => $this->faker->randomElement(['CSH', 'LCQ', 'CC']),

            'amount_to_be_paid' => $totalAmount,
            'amount_paid' => $amountPaid,
            'return_amount' => $totalAmount - $amountPaid,

            'service' => $this->faker->word,
            'status' => 'complete',
        ];
    }
}
