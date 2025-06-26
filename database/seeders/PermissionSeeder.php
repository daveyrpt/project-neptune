<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Temporarily disable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Delete all permissions first (truncate the table)
        Permission::truncate();

        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    
        // Define the permissions
        $cashier_permissions = [
            'read counter and collection center',
            'create counter and collection center',
            'open floating cash',
            'read dashboard cashier', 
            'read advance payment request',
            'create advance payment request', 
            
            'read processing receipt',
            'read receipt form', 
            'create receipt form', 
            'read list of receipt',
            'request cancel receipt', 
            'read cash receipt breakdown',
            'list cash receipt breakdown',
            'create cash receipt breakdown',

            'read report',
            'manage report',
            'read float cash',
            'read float cash request form',
            'create float cash request form',
        ];
    
        $admin_permissions = [
            'read dashboard admin',
            'read system',
            'read processing receipt',
            'manage configuration system',
            'read code maintenance',
            'read user',
            'create user',
            'update user',
            'delete user',
            'read integration',
            'read list of receipt',
            '', # tarikh permulaan
            'read cashier management',
            'create cashier management',
            'update cashier management',
            'delete cashier management',
            'read receipt form', 
            'create receipt form', 
            'edit receipt form',
            'read receipt cancel',
            'store receipt cancel',
            'read receipt cancel request form',
            'update receipt cancel request form',

            'manage open counter',
            'manage close counter',

            'manage osp',

            'read report',
            'manage report',

            'read terminal management',
            'create terminal management',
            'update terminal management',
            'delete terminal management',

            'read float cash',
            'update request float cash',
        ];

        $supervisor_permissions = [
            'read dashboard admin',
            'read system',
            'read processing receipt',

            'read code maintenance',

            'read integration',
            'read list of receipt',
            '', # tarikh permulaan
            'read cashier management',
            'create cashier management',
            'update cashier management',
            'delete cashier management',
            'read receipt form', 
            'create receipt form', 
            'edit receipt form',
            'read receipt cancel',
            'store receipt cancel',
            'read receipt cancel request form',
            'update receipt cancel request form',

            'manage open counter',
            'manage close counter',

            'manage osp',
            
            'read report',
            'manage report',

            'read terminal management',
            'create terminal management',
            'update terminal management',
            'delete terminal management',
            'read float cash',
            'update request float cash',
        ];

        $supervisor_counter_permissions = [
            'read counter and collection center',
            'create counter and collection center',
            'open floating cash',
            'read advance payment request',
            'create advance payment request', 
            
            'request cancel receipt', 
            'create cash receipt breakdown',

            'read float cash request form',
            'create float cash request form',


            'read dashboard admin',
            'read processing receipt',

            'read integration',
            '', # tarikh permulaan
            'read cashier management',
            'create cashier management',
            'update cashier management',
            'delete cashier management',
            'read receipt form', 
            'create receipt form', 
            'edit receipt form',
            'read receipt cancel',
            'store receipt cancel',
            'read receipt cancel request form',
            'update receipt cancel request form',

            'manage open counter',
            'manage close counter',

            'manage osp',
            
            'read report',
            'manage report',

            'read terminal management',
            'create terminal management',
            'update terminal management',
            'delete terminal management',
            'read float cash',
            'update request float cash',
        ];

        $developer_permissions = [
            'role permission',
        ];

        $auditor_permissions = [
            'read report',
        ];

        foreach (array_merge($cashier_permissions, $admin_permissions, $supervisor_permissions, $supervisor_counter_permissions, $developer_permissions, $auditor_permissions) as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Admin role
        $admin = Role::where('name', 'admin')->first();
        $admin->permissions()->sync(Permission::whereIn('name', $admin_permissions)->pluck('id'));

        // Supervisor role
        $admin = Role::where('name', 'supervisor')->first();
        $admin->permissions()->sync(Permission::whereIn('name', $supervisor_permissions)->pluck('id'));
    
        // Counter Supervisor role
        $admin = Role::where('name', 'counter_supervisor')->first();
        $admin->permissions()->sync(Permission::whereIn('name', $supervisor_counter_permissions)->pluck('id'));

        // Cashier role
        $cashier = Role::where('name', 'cashier')->first();
        $cashier->permissions()->sync(Permission::whereIn('name', $cashier_permissions)->pluck('id'));

        // Developer role
        $developer = Role::where('name', 'developer')->first();
        $developer->permissions()->sync(Permission::whereIn('name', $developer_permissions)->pluck('id'));

        // Auditor role
        $auditor = Role::where('name', 'auditor')->first();
        $auditor->permissions()->sync(Permission::whereIn('name', $auditor_permissions)->pluck('id'));

    }
}
