<?php

namespace App\Console\Commands\Receipt;

use App\Models\CollectionCenter;
use App\Models\Counter;
use App\Models\PaymentType;
use App\Models\Receipt;
use App\Models\User;
use FontLib\TrueType\Collection;
use Illuminate\Console\Command;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PushRecordFromLegacyToReceipt extends Command
{
    /*
    |
    | 1. Export table aurerecp and aurepymt FROM PLRE/PLMIS as .sql file and import TO local DB as legacy table aurerecp and aurepymt
    |--------------------------------------------------------------------------------------------------------------------------------|
    | 2. Insert records TO receipts table FROM legacy table aurerecp and aurepymt ( update sync_status to '1' )            |
    |--------------------------------------------------------------------------------------------------------------------------------|
    | 3. Insert records TO legacy table aurerecp and aurepymt FROM receipts table 
    |
    | 4. Insert records TO PLRE/PLMIS table aurerecp and aurepymt FROM receipts table 
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
    protected $signature = 'sync-receipt:step-2';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Push record to receipt from legacy';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        ini_set('memory_limit', '128M');

        $chunkSize = 500;

        # Check table records count for legacy and receipts
        try {

            $legacyCount = DB::table('aurerecp as a')
                ->join('aurepymt as b', 'a.RCP_NUM', '=', 'b.RCP_NUM')
                ->count();

            $receiptCount = Receipt::count();

            $this->info("📊 Legacy table total:        {$legacyCount}");

            $this->info("📦 Receipt table total:     {$receiptCount}");

            if ($legacyCount === 0) {
                $this->info('⚠️ No records found in legacy table. Exiting.');
                return;
            }

            // if ($receiptCount === 0) {
            //     $this->info('⚠️ No records found in receipt table. Exiting.');
            //     return;
            // }

            if ($legacyCount === $receiptCount) {
                $this->info('⚠️ No new records found in legacy table. Exiting.');
                return;
            }

        } catch (\Exception $e) {

            $this->error('❌ Failed to check table counts: ' . $e->getMessage());

            return 1;
        }
       
        // Receipt::truncate();

        DB::table('aurerecp as a')
            ->join('aurepymt as b', function ($join) {
                $join->on('a.RCP_NUM', '=', 'b.RCP_NUM');
            })
            ->select(
                'a.TTY_NUM',
                'a.DEP_GRP',
                'a.OPR_NUM',
                'a.RCP_DTE',
                'a.RCP_NUM',
                'a.RCP_AMT',
                'b.PAY_TYP',
                'b.DRW_NME',
            )
            ->orderBy('a.DEP_GRP')
            ->chunk($chunkSize, function ($records, $chunkSize) {
                static $count = 0;
                foreach ($records as $record) {
                   
                    $receipt = Receipt::create([
                        'collection_center_id' => CollectionCenter::where('code', $record->DEP_GRP)->first()->id ?? 1,
                        'counter_id' => Counter::where('name', $record->TTY_NUM)->first()->id ?? 1,
                        'receipt_grouping_id' => Str::uuid()->toString(),
                        'user_id' => User::where('staff_id', $record->OPR_NUM)->first()->id ?? 1,
                        'date' => ($record->RCP_DTE && $record->RCP_DTE !== '0000-00-00')
                            ? $record->RCP_DTE . ' 00:00:00'
                            : Carbon::now()->format('Y-m-d H:i:s'),
                        'account_number' => null,
                        'receipt_number' => $record->RCP_NUM,
                        'total_amount' => $record->RCP_AMT,
                        'amount' => $record->RCP_AMT,
                        'amount_paid' => $record->RCP_AMT,
                        'payment_type' => PaymentType::where('id', $record->PAY_TYP)->first()->name ?? 1,
                        'payment_detail' => '',
                        'sync_status' => 1,
                        'is_imported' => 1,
                        'status' => Receipt::STATUS_GENERATED,
                    ]);

                    $receipt->payment_detail = [
                        [
                            'type' => PaymentType::where('id', $record->PAY_TYP)->first()?->id ?? 1,
                            'amount' => $record->RCP_AMT,
                            'code_bank' => null,
                            'bank_name' => null,
                            'reference_number' => null,
                            'card_holder_name' => $record->DRW_NME,
                        ]
                    ];

                    $receipt->save();

                    $count++;
                    if ($count % $chunkSize === 0) {
                        echo "Processed {$count} records...\n";
                    }
                }
            });

        $this->info('✅ Receipt sync complete');
    }
}
