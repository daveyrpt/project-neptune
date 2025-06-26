<?php

namespace Database\Seeders;

use App\Models\CashReceiptBreakdown;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CashReceiptBreakdownSeeder extends Seeder
{
    public function run()
    {
        $entries = [
            [
                'collection_center_id' => 1,
                'counter_id' => 1,
                'user_id' => 1,
                'receipt_date' => Carbon::now(),
                
                'RM100' => 5,
                'RM50' => 2,
                'RM20' => 3,
                'RM10' => 4,
                'RM5' => 5,
                'RM1' => 10,
                'RM0_50' => 20,
                'RM0_20' => 15,
                'RM0_10' => 30,
                'RM0_05' => 50,
            ],
            [
                'collection_center_id' => 2,
                'counter_id' => 2,
                'user_id' => 2,
                'receipt_date' => Carbon::now(),

                'RM100' => 1,
                'RM50' => 3,
                'RM20' => 2,
                'RM10' => 6,
                'RM5' => 2,
                'RM1' => 5,
                'RM0_50' => 10,
                'RM0_20' => 25,
                'RM0_10' => 40,
                'RM0_05' => 30,
            ],
            [
                'collection_center_id' => 3,
                'counter_id' => 3,
                'user_id' => 3,
                'receipt_date' => Carbon::now(),
                
                'RM100' => 0,
                'RM50' => 0,
                'RM20' => 5,
                'RM10' => 5,
                'RM5' => 10,
                'RM1' => 20,
                'RM0_50' => 5,
                'RM0_20' => 5,
                'RM0_10' => 10,
                'RM0_05' => 100,
            ],
        ];

        foreach ($entries as $data) {
            CashReceiptBreakdown::create($data);
        }
    }
}