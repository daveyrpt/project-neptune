<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Customer;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = [
            [
                'system' => 'PRS',
                'name' => 'Ahmad Bin Ali',
                'account_number' => '1002003001',
                'bill_number' => 'BA20240518001',
                'amount' => 45.75,
                'identity_number' => '900101014321',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'system' => 'PRS',
                'name' => 'Ahmad Bin Ali',
                'account_number' => '1002003001',
                'bill_number' => 'BA20240318001',
                'amount' => 145.75,
                'identity_number' => '900101014321',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'system' => 'PRS',
                'name' => 'Ahmad Bin Ali',
                'account_number' => '1002003001',
                'bill_number' => 'BA20212318001',
                'amount' => 65.75,
                'identity_number' => '900101014321',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'system' => 'PAS',
                'name' => 'Siti Nur Aisyah',
                'account_number' => '2003004002',
                'bill_number' => 'BA20240518002',
                'amount' => 123.40,
                'identity_number' => '850812025678',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'system' => 'PAS',
                'name' => 'Siti Nur Aisyah',
                'account_number' => '2003004002',
                'bill_number' => 'BA20240511202',
                'amount' => 40.40,
                'identity_number' => '850812025678',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'system' => 'LISO',
                'name' => 'Lim Wei Seng',
                'account_number' => '3004005003',
                'bill_number' => 'IW20240518003',
                'amount' => 35.20,
                'identity_number' => '920304085432',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'system' => 'LIST',
                'name' => 'Mageswari A/P Krishnan',
                'account_number' => '4005006004',
                'bill_number' => 'IN20240518004',
                'amount' => 89.99,
                'identity_number' => '781110104321',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'system' => 'LIST',
                'name' => 'Mageswari A/P Krishnan',
                'account_number' => '4005006004',
                'bill_number' => 'IN20240514004',
                'amount' => 109.99,
                'identity_number' => '781110104321',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'system' => 'NBL',
                'name' => 'Mohd Faizal Bin Hassan',
                'account_number' => '5006007005',
                'bill_number' => 'BT20240518005',
                'amount' => 56.00,
                'identity_number' => '800223056789',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($customers as $customer) {
            Customer::updateOrCreate($customer);
        }
    }
}
