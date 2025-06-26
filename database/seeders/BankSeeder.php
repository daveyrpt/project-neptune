<?php

namespace Database\Seeders;

use App\Models\Bank;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $banks = [
            ['code' => '10', 'name' => 'Bank Negara Malaysia'],
            ['code' => '12','name' => 'Bank Simpanan Malaysia'],
            ['code' => '9','name' => 'Bank Mualamat Malaysia Berhad'],
            ['code' => '29','name' => 'Multi Purpose Bank Berhad'],
            ['code' => '3','name' => 'Standard Chartered Bank Berhad'],
            ['code' => '5','name' => 'OCBC'],
        ];

        foreach ($banks as $data) {
            Bank::updateOrCreate($data);
        }
    }
}
