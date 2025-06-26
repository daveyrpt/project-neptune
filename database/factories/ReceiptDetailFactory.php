<?php

namespace Database\Factories;

use App\Models\ReceiptDetail;
use App\Models\Receipt;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReceiptDetailFactory extends Factory
{
    protected $model = ReceiptDetail::class;

    public function definition(): array
    {
        return [
            'receipt_id' => Receipt::inRandomOrder()->first()?->id ?? Receipt::factory(),
            'bill_number' => strtoupper($this->faker->bothify('BILL-####')),
            'income_code' => strtoupper($this->faker->bothify('INC-###')),
            'amount' => $this->faker->randomFloat(2, 5, 200),
        ];
    }
}