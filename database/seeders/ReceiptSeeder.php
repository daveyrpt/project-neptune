<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Receipt;
use App\Models\ReceiptDetail;

class ReceiptSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Receipt::factory()
            ->count(10)
            ->create()
            ->each(function ($receipt) {
                // For each receipt, create 2–5 receipt details
                ReceiptDetail::factory()
                    ->count(rand(2, 5))
                    ->create(['receipt_id' => $receipt->id]);
            });
    }
}
