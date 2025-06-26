<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Counter;
use App\Models\CollectionCenter;
use App\Models\OpenedCounter;

class OpenedCounterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        OpenedCounter::create([
            'collection_center_id' => 1,
            'counter_id' => 1,
            'user_id' => 1,
            'status' => OpenedCounter::STATUS_OPEN_BY_ADMIN, 
            'opened_at' => '2023-01-01 00:00:00',
            'closed_at' => null,
        ]);

        OpenedCounter::create([
            'collection_center_id' => 1,
            'counter_id' => 2,
            'user_id' => 3,
            'status' => OpenedCounter::STATUS_OPEN_BY_CASHIER, 
            'opened_at' => '2023-01-01 00:00:00',
            'closed_at' => null,
        ]);

        OpenedCounter::create([
            'collection_center_id' => 1,
            'counter_id' => 1,
            'user_id' => 1,
            'status' => OpenedCounter::STATUS_OPEN_BY_ADMIN, 
            'opened_at' => now()->toDateTimeString(),
            'closed_at' => null,
        ]);

        // OpenedCounter::create([
        //     'collection_center_id' => 1,
        //     'counter_id' => 2,
        //     'user_id' => 3,
        //     'status' => OpenedCounter::STATUS_OPEN_BY_CASHIER, 
        //     'opened_at' => now()->toDateTimeString(),
        //     'closed_at' => null,
        // ]);
    }
}
