<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //$roles = ['default', 'admin', 'cashier', 'supervisor', 'counter_supervisor', 'auditor', 'developer'];
        $roles = ['default', 'admin', 'balai_bomba', 'auditor'];
        $roles_names = [
            'default' => 'default',
            'admin' => 'Pusat Kawalan',
            'balai_bomba' => 'Balai Bomba',
            'auditor' => 'Auditor',
            // 'cashier' => 'Juruwang',
            // 'supervisor' => 'Penyelia',
            // 'counter_supervisor' => 'Penyelia Kaunter',
            // 'auditor' => 'Auditor',
            // 'developer' => 'Developer'
        ];
    
        foreach ($roles as $role) {
            Role::firstOrCreate([
                'name' => $role,
                'display_name' => $roles_names[$role],  
            ]);
        }
    }
}
