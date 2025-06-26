<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Counter;

class CounterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $counters = [
            ['collection_center_id' => 1, 'name' => '1', 'description' => 'Front desk 1'],
            ['collection_center_id' => 1, 'name' => '2', 'description' => 'Front desk 2'],
            ['collection_center_id' => 1, 'name' => '3', 'description' => 'Front desk 3'],
            ['collection_center_id' => 1, 'name' => '4', 'description' => 'Front desk 4'],
            ['collection_center_id' => 1, 'name' => '5', 'description' => 'Front desk 5'],
            ['collection_center_id' => 1, 'name' => '6', 'description' => 'Front desk 6'],
            ['collection_center_id' => 1, 'name' => '7', 'description' => 'Front desk 7'],
            ['collection_center_id' => 1, 'name' => '8', 'description' => 'Front desk 8'],
            ['collection_center_id' => 1, 'name' => '9', 'description' => 'Front desk 9'],
            ['collection_center_id' => 1, 'name' => '10', 'description' => 'Front desk 10'],
            ['collection_center_id' => 1, 'name' => '11', 'description' => 'Front desk 11'],
            ['collection_center_id' => 1, 'name' => '12', 'description' => 'Front desk 12'],
            ['collection_center_id' => 1, 'name' => '13', 'description' => 'Front desk 13'],
            ['collection_center_id' => 1, 'name' => '14', 'description' => 'Front desk 14'],
            ['collection_center_id' => 1, 'name' => '15', 'description' => 'Front desk 15'],

            ['collection_center_id' => 2, 'name' => '1', 'description' => 'Service counter'],
            ['collection_center_id' => 2, 'name' => '2', 'description' => 'Payment counter'],

            ['collection_center_id' => 3, 'name' => '99', 'description' => 'OSP counter'],
        ];

        foreach ($counters as $data) {
            Counter::updateOrCreate($data);
        }
    }
}
