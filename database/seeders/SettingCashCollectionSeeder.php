<?php

namespace Database\Seeders;

use App\Models\SettingCashCollection;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingCashCollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['code' => 'A101', 'name' => 'Syarikat A', 'bank_id' => 1, 'is_default' => 1],
            ['code' => 'A102', 'name' => 'Syarikat B', 'bank_id' => 2, 'is_default' => 1],
            ['code' => 'A103', 'name' => 'Syarikat C', 'bank_id' => 3, 'is_default' => 1],
            ['code' => 'A104', 'name' => 'Syarikat D', 'bank_id' => 4, 'is_default' => 1],
            ['code' => 'A105', 'name' => 'Syarikat E', 'bank_id' => 5, 'is_default' => 1],
        ];

        foreach ($settings as $data) {
            SettingCashCollection::updateOrCreate($data);
        }
    }
}
