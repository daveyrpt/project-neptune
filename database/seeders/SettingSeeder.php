<?php

namespace Database\Seeders;

use App\Models\IncomeCategory;
use App\Models\IncomeCode;
use App\Models\IncomeCodeDescription;
use App\Models\ReceiptCollection;
use App\Models\SettingDefaultCashierLocation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $receipt_collections = [
            ['code' => '1', 'name' => 'PL', 'description' => 'Perbadanan Labuan', 'status' => 1],
            ['code' => '2', 'name' => 'PL', 'description' => 'Perbadanan Labuan', 'status' => 1],
            ['code' => '3', 'name' => 'PL', 'description' => 'Perbadanan Labuan', 'status' => 1],
        ];

        foreach ($receipt_collections as $data) {
            ReceiptCollection::updateOrCreate($data);
        }

        $cashier_locations = [
            ['collection_center_id' => '1', 'counter_id' => '1', 'user_id' => '2'],
            ['collection_center_id' => '1', 'counter_id' => '2', 'user_id' => '3'],
        ];

        foreach ($cashier_locations as $data) {
            SettingDefaultCashierLocation::updateOrCreate($data);
        }

        $income_categories = [
            ['code' => 'AR', 'name' => 'AR-Terimaan Pelbagai', 'description' => '', 'status' => 1],
            ['code' => 'DT', 'name' => 'DEPOSIT', 'description' => '', 'status' => 1],
            ['code' => 'LES', 'name' => 'LESEN', 'description' => '', 'status' => 1],
            ['code' => 'TBH', 'name' => 'TRIMAAN BUKAN HASIL', 'description' => '', 'status' => 1],
            ['code' => 'JRM', 'name' => 'JUALAN RUMAH', 'description' => '', 'status' => 1],
        ];

        foreach ($income_categories as $data) {
            IncomeCategory::updateOrCreate($data);
        }

        $income_codes = [
            ['code' => '71101', 'name' => 'Cukai Taksiran', 'description' => 'C Taksiran', 'receipt_collection_id' => '1', 'bank_id' => '1', 'income_category_id' => '1', 'gl_account' => 'M-D000-R71101', 'default_amount' => '0.00', 'printed_receipt_format' => '3', 'status' => 1],
            ['code' => '71201', 'name' => 'LESEN KEDAI MKN/RESTORAN', 'description' => 'L RESTORAN', 'receipt_collection_id' => '1', 'bank_id' => '2', 'income_category_id' => '1', 'gl_account' => 'M-D000-R71201', 'default_amount' => '0.00', 'printed_receipt_format' => '3', 'status' => 1],
        ];

        foreach ($income_codes as $data) {
            IncomeCode::updateOrCreate($data);
        }        

        $income_code_descriptions = [
            ['income_code_id' => '1', 'description' => 'Pembetulan Diskaun'],

        ];

        foreach ($income_code_descriptions as $data) {
            IncomeCodeDescription::updateOrCreate($data);
        }  
    }
}
