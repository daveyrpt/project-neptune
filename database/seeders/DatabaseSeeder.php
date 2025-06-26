<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $this->call(RoleSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(PermissionSeeder::class);
        $this->call(CollectionCenterSeeder::class);
        $this->call(CounterSeeder::class);
        // $this->call(CashReceiptBreakdownSeeder::class);
        // $this->call(ReceiptSeeder::class);
        // $this->call(OpenedCounterSeeder::class);
        $this->call(BankSeeder::class);
        $this->call(SettingCashCollectionSeeder::class);
        $this->call(SettingAutoNumberingSeeder::class);
        $this->call(PaymentTypeSeeder::class); 
        //\App\Models\Customer::factory()->count(20)->create();
        $this->call(SettingSeeder::class); 
        $this->call(SystemConfigurationSeeder::class);
        $this->call(SettingWorkingDaySeeder::class); 
        // $this->call(CustomerSeeder::class);
    }
}
