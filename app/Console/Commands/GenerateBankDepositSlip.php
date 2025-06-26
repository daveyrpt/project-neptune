<?php

namespace App\Console\Commands;

use App\Models\Bank;
use App\Models\BankDepositSlip;
use App\Models\Receipt;
use Illuminate\Console\Command;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class GenerateBankDepositSlip extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-bank-deposit-slip';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        ini_set('memory_limit', '512M'); // raise if needed
        $chunkSize = 1000;

        DB::beginTransaction();

        try {
            $existingDates = BankDepositSlip::pluck('date')
                ->map(fn($d) => Carbon::parse($d)->format('Y-m-d'))
                ->unique()
                ->toArray();

            // Step 1: Chunk through receipts and group them
            $groupedReceipts = collect();

            Receipt::whereYear('date', 2013)->orderBy('id')->chunkById($chunkSize, function ($receipts) use (&$groupedReceipts, $existingDates) {
                foreach ($receipts as $receipt) {
                    $dateKey = Carbon::parse($receipt->date)->format('Y-m-d');

                    if (!in_array($dateKey, $existingDates)) {
                        $groupedReceipts->push($receipt);
                    }
               
                }
            });
     
            // Step 2: Group by date
            $receiptsByDate = $groupedReceipts->groupBy(function ($receipt) {
                return Carbon::parse($receipt->date)->format('Y-m-d');
            });

            // Step 3: Create deposit slips
            foreach ($receiptsByDate as $date => $grouped) {
                $first = $grouped->first();

                $slip = new BankDepositSlip();
                $slip->collection_center_id = $first->collection_center_id;
                $slip->counter_id = $first->counter_id;
                $slip->user_id = $first->user_id;
                $slip->receipt_collection = 'PL';
                $slip->date = $date;
                $slip->payment_type = $first->payment_type;
                $slip->deposit_date = $date;
                $slip->amount_from_receipt = $grouped->sum('total_amount');
                $slip->amount_from_cash_breakdown_receipt = $grouped->sum('total_amount');
                $slip->report_type = 'terperinci';
                $slip->slip_number = '0';
                $slip->status = BankDepositSlip::STATUS_GENERATED;
                $slip->save();
            }

            DB::commit();
            $this->info('✅ Bank deposit slips generated.');
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('❌ ' . $e->getMessage());
        }
    }
}
