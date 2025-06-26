<?php

namespace Database\Seeders;

use App\Models\PaymentType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $paymentTypes = [
            ['code' => '1', 'name' => 'CSH', 'description' => 'Tunai', 'destination' => 'CB', 'status' => 'active'],
            ['code' => '2','name' => 'LCQ', 'description' => 'Cek', 'destination' => 'CB', 'status' => 'active'],
            ['code' => '3','name' => 'CC', 'description' => 'Kad Kredit', 'destination' => 'CB', 'status' => 'active'],
            ['code' => '4','name' => 'WP', 'description' => 'Wang Pos/ Kiriman Wang', 'destination' => 'CB', 'status' => 'active'],
            ['code' => '5','name' => 'EFT', 'description' => 'EFT/SI', 'destination' => 'CB', 'status' => 'active'],
            ['code' => '6','name' => 'DB', 'description' => 'Deraf Bank', 'destination' => 'CB', 'status' => 'active'],
            ['code' => '7','name' => 'SB', 'description' => 'Slip Bank', 'destination' => 'CB', 'status' => 'active'],
        ];

        foreach ($paymentTypes as $type) {
            PaymentType::updateOrCreate($type);
        }
    }
}
