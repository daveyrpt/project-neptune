<?php

namespace App\Console\Commands\Customer;

use Illuminate\Console\Command;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;

class PushRecordFromLegacyToCustomer extends Command
{
    /*
    |
    | 1. Export table aurealloc and aureopit FROM PLRE/PLMIS as .sql file and import TO local DB as legacy table aurealloc and aureopit
    |--------------------------------------------------------------------------------------------------------------------------------|
    | 2. Insert records TO customers table FROM legacy table aurealloc and aureopit ( update sync_status to '1' )                    |
    |--------------------------------------------------------------------------------------------------------------------------------|
    | 3. Insert records TO legacy table aurealloc and aureopit FROM customers table 
    |
    | 4. Insert records TO PLRE/PLMIS table aurealloc and aureopit FROM customers table 
    |
    */

    /*
    |--------------------------------------------------------------------------
    | ⚠️ Warning
    |--------------------------------------------------------------------------
    |
    | 
    |
    */

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync-customer:step-2';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Push record to customers from legacy';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        ini_set('memory_limit', '128M');

        $chunkSize = 5000;

        # Check table records count for legacy and customers
        try {

            $legacyCount = DB::table('aurealloc as a')
                ->join('aureopit as b', 'a.ACCT_NO', '=', 'b.MDU_ACC')
                ->count();

            $customersCount = Customer::count();

            $this->info("📊 Legacy table total:        {$legacyCount}");

            $this->info("📦 Customers table total:     {$customersCount}");

            if ($legacyCount === 0) {
                $this->info('⚠️ No records found in legacy table. Exiting.');
                return;
            }

            if ($customersCount === 0) {
                $this->info('⚠️ No records found in customers table. Exiting.');
                return;
            }

            if ($legacyCount === $customersCount) {
                $this->info('⚠️ No new records found in legacy table. Exiting.');
                return;
            }

        } catch (\Exception $e) {

            $this->error('❌ Failed to check table counts: ' . $e->getMessage());

            return 1;
        }
       
        Customer::truncate();

        DB::table('aurealloc as a')
            ->join('aureopit as b', function ($join) {
                $join->on('a.ACCT_NO', '=', 'b.MDU_ACC');
            })
            ->select(
                'a.BILL_NO',
                'a.BILL_DTE',
                'a.ACCT_NO',
                'a.SYS_ID',
                'b.RCP_NM1',
                'a.AMT',
                'b.CUS_ID',
                'b.RCP_AD1',
                'b.RCP_AD2',
                'b.RCP_AD3'
            )
            ->orderBy('a.BILL_NO')
            ->chunk($chunkSize, function ($records, $chunkSize) {
                static $count = 0;
                foreach ($records as $record) {
                    Customer::insert(
                        [
                            'system' => $record->SYS_ID,
                            'account_number' => $record->ACCT_NO,
                            'bill_number' => $record->BILL_NO,
                            'bill_date' => $record->BILL_DTE,
                            'name' => $record->RCP_NM1,
                            'amount' => $record->AMT,
                            'identity_number' => $record->CUS_ID,
                            'address_1' => $record->RCP_AD1,
                            'address_2' => $record->RCP_AD2,
                            'address_3' => $record->RCP_AD3,
                            'sync_status' => 1,
                        ]
                    );

                    $count++;
                    if ($count % $chunkSize === 0) {
                        echo "Processed {$count} records...\n";
                    }
                }
            });

        $this->info('✅ Customer sync complete');
    }
}
