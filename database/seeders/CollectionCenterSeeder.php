<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CollectionCenter;

class CollectionCenterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $centers = [
            ['code' => 'PL1', 'name' => 'Wisma PL', 'description' => 'Wisma Perbadanan Labuan'],
            ['code' => 'PL2','name' => 'Menara PL', 'description' => 'Menara Perbadanan Labuan'],
            ['code' => 'OSP','name' => 'OSP', 'description' => 'One Stop Payment'],
            ['code' => 'PL3','name' => 'UTC', 'description' => 'Urban Transformation Center Labuan'],
            ['code' => 'PL4','name' => 'Test', 'description' => 'Development@Traning'],
        ];

        foreach ($centers as $data) {
            CollectionCenter::updateOrCreate($data);
        }
    }
}
