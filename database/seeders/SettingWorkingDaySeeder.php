<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SettingWorkingDay;

class SettingWorkingDaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $workingDays = [
            ['collection_center_id' => '1', 'monday' => 1, 'tuesday' => 1, 'wednesday' => 1, 'thursday' => 1, 'friday' => 1, 'saturday' => 0, 'sunday' => 0],
            ['collection_center_id' => '2', 'monday' => 1, 'tuesday' => 1, 'wednesday' => 1, 'thursday' => 1, 'friday' => 1, 'saturday' => 0, 'sunday' => 0],
            ['collection_center_id' => '3', 'monday' => 1, 'tuesday' => 1, 'wednesday' => 1, 'thursday' => 1, 'friday' => 1, 'saturday' => 0, 'sunday' => 0],
            ['collection_center_id' => '4', 'monday' => 1, 'tuesday' => 1, 'wednesday' => 1, 'thursday' => 1, 'friday' => 1, 'saturday' => 0, 'sunday' => 0],
            ['collection_center_id' => '5', 'monday' => 1, 'tuesday' => 1, 'wednesday' => 1, 'thursday' => 1, 'friday' => 1, 'saturday' => 0, 'sunday' => 0],
        ];

        foreach ($workingDays as $data) {
            SettingWorkingDay::updateOrCreate($data);
        }
    }
}
