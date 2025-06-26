<?php

namespace App\Console\Commands;

use App\Models\CollectionCenter;
use App\Models\Counter;
use App\Models\OpenedCounter;
use App\Models\SettingWorkingDay;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
class AutoOpenCounters extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'counters:auto-open-counters';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Auto Open Counters';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $date = Carbon::today()->toDateString();
        $day = strtolower(Carbon::now()->format('l')); // e.g. 'monday'
        $systemUserId = 1;

        $centers = CollectionCenter::all();

        foreach ($centers as $center) {
            // Get the working day setting for this center
            $setting = SettingWorkingDay::where('collection_center_id', $center->id)->first();

            // Skip if no setting or if today is not a working day
            if (!$setting || !$setting->$day) {
                $this->info('Skipping ' . $center->name);
                continue;
            }

            DB::beginTransaction();

            try {
                $counters = Counter::where('collection_center_id', $center->id)->get();

                if ($counters->isEmpty()) {
                    DB::rollBack();
                    continue;
                }

                foreach ($counters as $counter) {
                    $alreadyExists = OpenedCounter::where('opened_at', $date)
                        ->where('collection_center_id', $center->id)
                        ->where('counter_id', $counter->id)
                        ->exists();

                    if ($alreadyExists) {
                        continue;
                    }
                    $this->info('Opening ' . $counter->name);
                    OpenedCounter::create([
                        'opened_at' => $date,
                        'collection_center_id' => $center->id,
                        'counter_id' => $counter->id,
                        'user_id' => $systemUserId,
                        'status' => OpenedCounter::STATUS_OPEN_BY_ADMIN
                    ]);
                }

                DB::commit();

            } catch (\Exception $e) {
                DB::rollBack();
                dd($e);
            }
        }
    }

}
