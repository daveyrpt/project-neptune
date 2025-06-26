<?php

namespace Database\Seeders;

use App\Models\SystemConfiguration;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SystemConfigurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SystemConfiguration::create([
            'status' => 'online',
            'total_max_cash' => '',
            'total_max_receipt' => '',
            'max_float_cash' => '',
            'allowed_cancel_receipt' => '',
            'osp_status' => '',
            'receipt_format' => '',
        ]);
    }
}
