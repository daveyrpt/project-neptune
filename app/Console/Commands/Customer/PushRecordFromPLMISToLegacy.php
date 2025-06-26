<?php

namespace App\Console\Commands\Customer;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\File;

class PushRecordFromPLMISToLegacy extends Command
{
    /*
    |-----------------------------------------------------------------------------------------------------------------------------------|
    | 1. Export table aurealloc and aureopit FROM PLRE/PLMIS as .sql file and import TO local DB as legacy table aurealloc and aureopit |
    |-----------------------------------------------------------------------------------------------------------------------------------|
    | 2. Insert records TO customers table FROM legacy table aurealloc and aureopit ( update sync_status to '1' )
    |
    | 3. Insert records TO legacy table aurealloc and aureopit FROM customers table 
    |
    | 4. Insert records TO PLRE/PLMIS table aurealloc and aureopit FROM customers table 
    |
    */

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync-customer:step-1';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Push record from PLMIS to Legacy';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Config::set('database.connections.temp_mysql', [
            'driver' => 'mysql',
            'host' => config('plmis.host'),
            'port' => config('plmis.port'),
            'database' => config('plmis.database'),
            'username' => config('plmis.username'),
            'password' => config('plmis.password'),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'strict' => true,
            'engine' => null,
        ]);
        DB::purge('temp_mysql');

        $local = [
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', 'root'),
            'database' => env('DB_DATABASE', 'plre'), 
        ];

        $tables = [
            'AUREALLOC' => 'aurealloc',
            'AUREOPIT'  => 'aureopit',
        ];

        try {
            foreach ($tables as $remoteTable => $localTable) {
                $remoteCount = DB::connection('temp_mysql')->table($remoteTable)->count();
                $localCount = DB::table($localTable)->count();

                $this->info("📊 Remote [$remoteTable]: $remoteCount");
                $this->info("📦 Local [$localTable]: $localCount");

                if ($localCount === $remoteCount) {
                    $this->info("✅ [$remoteTable] counts match. Skipping.");
                    continue;
                }

                $this->info("🔄 [$remoteTable] counts differ — syncing...");

                // File and path
                $timestamp = now()->format('Ymd_His');
                $filename = strtolower($remoteTable) . "_{$timestamp}.sql";
                $folderPath = storage_path("app/mysql_db/sync/customers");

                File::ensureDirectoryExists($folderPath);

                $storagePath = "{$folderPath}/{$filename}";

                // Export from remote
                $dumpCmd = "/usr/bin/mysqldump -h" . config('plmis.host') .
                    " -P" . config('plmis.port') .
                    " -u" . config('plmis.username') .
                    " -p" . config('plmis.password') .
                    " " . config('plmis.database') . " $remoteTable > $storagePath";

                exec($dumpCmd, $dumpOutput, $dumpResult);

                if ($dumpResult !== 0) {
                    $this->error("❌ Export failed for [$remoteTable] (mysqldump exit code: $dumpResult)");
                    continue;
                }

                $this->info("✅ [$remoteTable] exported to: storage/app/sync/customers/{$filename}");

                // Truncate local table
                DB::table($localTable)->truncate();
                $this->info("🧹 Local [$localTable] truncated.");

                // Import into local DB
                $isDocker = config('plmis.is_docker', true);
                if ($isDocker) {
                    $this->info("🐳 Docker mode");
                    $importCmd = "mysql -hplre_db -u{$local['username']} -p{$local['password']} {$local['database']} < {$storagePath}";
                } else {
                    $this->info("🖥️ Non-Docker mode");
                    $importCmd = "mysql -u{$local['username']} -p{$local['password']} {$local['database']} < {$storagePath}";
                }

                exec($importCmd, $importOutput, $importResult);

                if ($importResult === 0) {
                    $this->info("✅ [$remoteTable] imported into local DB.");
                } else {
                    $this->error("❌ Import failed for [$remoteTable] (exit code: $importResult)");
                }
            }
        } catch (\Exception $e) {
            $this->error("❌ Sync process failed: " . $e->getMessage());
        }
    }

}
