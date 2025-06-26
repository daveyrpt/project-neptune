<?php

namespace Database\Seeders;

use App\Models\SettingAutoNumbering;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingAutoNumberingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['code' => 'CB', 'name' => '2132', 'setting_cash_collection_id' => 1, 'prefix' => 1],
            ['code' => 'GL', 'name' => '123', 'setting_cash_collection_id' => 2, 'prefix' => 1],
            ['code' => 'CBADJ', 'name' => '1233123', 'setting_cash_collection_id' => 3, 'prefix' => 1],
            ['code' => 'ARADJ', 'name' => '123312', 'setting_cash_collection_id' => 4, 'prefix' => 1],
            ['code' => 'SDB Cek', 'name' => '313123', 'setting_cash_collection_id' => 5, 'prefix' => 1],
        ];

        foreach ($settings as $data) {
            SettingAutoNumbering::updateOrCreate($data);
        }
    }
}
