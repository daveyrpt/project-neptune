<?php

namespace App\Console\Commands\Receipt;

use App\Models\Receipt;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class PushRecordFromReceiptToLegacyAndPLMIS extends Command
{    
    /*
    |
    | 1. Export table aurerecp and aurepymt FROM PLRE/PLMIS as .sql file and import TO local DB as legacy table aurerecp and aurepymt
    |
    | 2. Insert records TO receipts table FROM legacy table aurerecp and aurepymt ( update sync_status to '1' )
    |--------------------------------------------------------------------------------------------------------------------------------|
    | 3. Insert records TO legacy table aurerecp and aurepymt FROM receipts table                                           |
    |                                                                                                                                |
    | 4. Insert records TO PLRE/PLMIS table aurerecp and aurepymt FROM receipts table                                           |
    |--------------------------------------------------------------------------------------------------------------------------------|
    */

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync-receipt:step-3-4';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Push record from receipts to legacy and PLMIS';

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
            $legacyCount = DB::table('aurerecp as a')
                ->join('aurepymt as b', 'a.RCP_NUM', '=', 'b.RCP_NUM')
                ->count();

            $this->info("📊 Legacy table total:        {$legacyCount}");

            $pendingCount = Receipt::where('sync_status', 0)->count();

            $this->info("📦 Customers pending sync:   {$pendingCount}");
        } catch (\Exception $e) {
            $this->error('❌ Failed to check counts: ' . $e->getMessage());

            return;
        }

        if ($pendingCount === 0) {
            $this->info('✅ No unsynced receipt found. Exiting.');
            return;
        }

        $this->info("🔄 Syncing {$pendingCount} new/updated receipts");

        Receipt::where('sync_status', 0)
            ->orderBy('id')
            ->chunk($chunkSize, function ($receipts) {
                foreach ($receipts as $receipt) {

                    $exists = DB::table('aurerecp')
                                ->where('RCP_NUM', $receipt->receipt_number)
                                ->exists();

                    if ($exists) {
                        continue;
                    }

                    # insert to legacy table 'aurerecp'
                    DB::table('aurerecp')->insert([
                        'TTY_NUM' => $receipt->counter_id,
                        'OPR_NUM' => $receipt->user_id,
                        'RCP_NUM' => substr($receipt->receipt_number, -6),
                        'RCP_AMT' => $receipt->amount,
                        'RCP_DTE' => $receipt->date,
                        'DEP_GRP' => $receipt->collection_center_id,
                    ]);

                    # insert to legacy table 'aurerecp'
                    DB::table('aurepymt')->insert([
                        'TTY_NUM' => $receipt->counter_id,
                        'RCP_NUM' => substr($receipt->receipt_number, -6),
                        'RCP_AMT' => $receipt->amount,
                        'RCP_DTE' => $receipt->date,
                        'DEP_GRP' => $receipt->collection_center_id,
                        'PAY_TYP' => $receipt->detail[0]['payment_type'] ?? null,
                        'DRW_NME' => $receipt->detail[0]['card_holder_name'] ?? null,
                        'TRN_NUM' => 0, // PLMIS data show 0 for this field
                        'SEQ_NUM' => 1, // PLMIS data show 1 for this field
                        'MOD_OPR' => $receipt->user_id, // PLMIS data show 1 for this field
                    ]);

                    $receipt->sync_status = 1;
                    $receipt->save();
                }
            });

        $this->info('✅ All pending receipts have been pushed.');
    }

}
