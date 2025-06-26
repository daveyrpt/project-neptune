<?php

namespace App\Console\Commands\Customer;

use App\Models\Customer;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class PushRecordFromCustomerToLegacyAndPLMIS extends Command
{    
    /*
    |
    | 1. Export table aurealloc and aureopit FROM PLRE/PLMIS as .sql file and import TO local DB as legacy table aurealloc and aureopit
    |
    | 2. Insert records TO customers table FROM legacy table aurealloc and aureopit ( update sync_status to '1' )
    |--------------------------------------------------------------------------------------------------------------------------------|
    | 3. Insert records TO legacy table aurealloc and aureopit FROM customers table                                                  |
    |                                                                                                                                |
    | 4. Insert records TO PLRE/PLMIS table aurealloc and aureopit FROM customers table                                              |
    |--------------------------------------------------------------------------------------------------------------------------------|
    */

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync-customer:step-3-4';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Push record from customers to legacy and PLMIS';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        ini_set('memory_limit', '128M');

        $chunkSize = 5000;

        # Check if connected to PLMIS
        try {
            DB::connection('plmis_mysql')->getPdo();

            $this->info('✅ Connected to PLIS DB: ' . DB::connection('plmis_mysql')->getDatabaseName());
        } catch (\Exception $e) {
            $this->error('❌ Remote DB connection failed: ' . $e->getMessage());

            return 1; 
        }

        # Check table records count before proceed
        try {
            $legacyCount = DB::table('aurealloc as a')
                ->join('aureopit as b', 'a.ACCT_NO', '=', 'b.MDU_ACC')
                ->count();

            $this->info("📊 Legacy table total:        {$legacyCount}");

            $pendingCount = Customer::where('sync_status', 0)->count();

            $this->info("📦 Customers pending sync:   {$pendingCount}");
        } catch (\Exception $e) {
            $this->error('❌ Failed to check counts: ' . $e->getMessage());

            return;
        }

        if ($pendingCount === 0) {
            $this->info('✅ No unsynced customers found. Exiting.');
            return;
        }

        $this->info("🔄 Syncing {$pendingCount} new/updated customers…");

        Customer::where('sync_status', 0)
            ->chunk($chunkSize, function ($customers) {
                $accountNos = $customers->pluck('account_number')->unique()->all();

                // 1️⃣ Build & insert the alloc rows first
                $allocInserts = [];
                foreach ($customers as $c) {
                    $allocInserts[] = [
                        'SYS_ID' => $c->system,
                        'ACCT_NO' => $c->account_number,
                        'BILL_DTE' => $c->bill_date,
                        'BILL_NO' => $c->bill_number,
                        'AMT' => $c->amount,
                    ];
                }

                # insert to legacy
                DB::table('aurealloc')->insert($allocInserts);

                # insert to PLRE/PLMIS
                DB::connection('plmis_mysql')->table('AUREALLOC')->insert($allocInserts);

                // 2️⃣ Now that the new rows are in aurealloc, re-query the sums
                $allocSums = DB::table('aurealloc')
                    ->select('ACCT_NO', DB::raw('SUM(AMT) AS total_amt'))
                    ->whereIn('ACCT_NO', $accountNos)
                    ->groupBy('ACCT_NO')
                    ->pluck('total_amt', 'ACCT_NO');

                // 3️⃣ Build & insert the pit rows with a correct RCP_AMT
                $pitInserts = [];
                $idsToMark = [];
                foreach ($customers as $c) {
                    $pitInserts[] = [
                        'MDU_REF' => $c->bill_number,
                        'MDU_ACC' => $c->account_number,
                        'CUS_ID' => $c->identity_number,
                        'RCP_NM1' => $c->name,
                        'RCP_AD1' => $c->address_1,
                        'RCP_AD2' => $c->address_2,
                        'RCP_AD3' => $c->address_3,
                        'RCP_TYP' => '1',
                        'RCP_AMT' => $allocSums[$c->account_number] ?? 0,
                    ];
                    $idsToMark[] = $c->id;
                }

                # insert to legacy
                DB::table('aureopit')->insert($pitInserts);

                # insert to PLRE/PLMIS
                DB::connection('plmis_mysql')->table('AUREOPIT')->insert($pitInserts);

                // 4️⃣ Mark them synced
                Customer::whereIn('id', $idsToMark)->update(['sync_status' => 1]);

                $this->info('  • Synced chunk of ' . count($allocInserts));
            });

        $this->info('✅ All pending customers have been pushed.');
    }

}
