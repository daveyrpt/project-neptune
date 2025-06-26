<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            ['name' => 'En Khairul', 'email' => 'admin@example.com', 'role' => 'admin', 'staff_id' => 'A1001'],
            ['name' => 'Pn Mazlinah', 'email' => 'bomba1@example.com', 'role' => 'balai_bomba', 'staff_id' => 'B1001'],
            ['name' => 'En Alan', 'email' => 'auditor@example.com', 'role' => 'auditor', 'staff_id' => 'B1002'],
            // ['name' => 'Supervisor Example', 'email' => 'supervisor@example.com', 'role' => 'supervisor', 'staff_id' => 'C1001'],
            // ['name' => 'Counter Supervisor Example', 'email' => 'counter_supervisor@example.com', 'role' => 'counter_supervisor', 'staff_id' => 'D1001'],
            // ['name' => 'Developer Example', 'email' => 'developer@example.com', 'role' => 'developer', 'staff_id' => 'E1001'],
            // ['name' => 'Auditor Example', 'email' => 'auditor@example.com', 'role' => 'auditor', 'staff_id' => 'F1001'],
            // ['name' => 'Default User', 'email' => 'default@example.com', 'role' => 'default', 'staff_id' => NULL],
        ];

        foreach ($users as $userData) {
            $role = Role::where('name', $userData['role'])->first(); 
            
            if ($role) {
                User::firstOrCreate([
                    'email' => $userData['email'],
                ], [
                    'name' => $userData['name'],
                    'password' => Hash::make('password'), 
                    'role_id' => $role->id,
                    'staff_id' => $userData['staff_id']
                ]);
            }
        }
    }
}
