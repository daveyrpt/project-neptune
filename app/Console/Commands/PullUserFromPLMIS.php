<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PullUserFromPLMIS extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:pull-user-from-plmis';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Pull records from PLMIS aumnoper table to local users table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $supervisorRoleId        = Role::where('name', 'supervisor')->first()?->id;
        $counterSupervisorRoleId = Role::where('name', 'counter_supervisor')->first()?->id;
        $adminRoleId             = Role::where('name', 'admin')->first()?->id;
        $cashierRoleId           = Role::where('name', 'cashier')->first()?->id;

        $users = DB::table('aumnoper')->get();

        foreach ($users as $user) {
            $roleId = match ($user->ROLE) {
                's' => $supervisorRoleId,
                'o' => $counterSupervisorRoleId,
                'a' => $adminRoleId,
                default => $cashierRoleId,
            };

            $email = strtolower(str_replace(' ', '', $user->FRS_NME)) . '@plre.my';

            User::updateOrCreate(
                ['email' => $email], 
                [
                    'staff_id' => $user->OPR_NUM,
                    'name' => $user->FRS_NME,
                    'password' => Hash::make('password'), 
                    'role_id' => $roleId,
                ]
            );
        }

        $this->info('Users pulled from PLMIS');
    }
}
