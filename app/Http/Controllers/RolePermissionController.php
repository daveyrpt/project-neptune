<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class RolePermissionController extends Controller
{
    public function index()
    {
        auth()->user()->role->name === Role::NAME_ADMIN ?: abort(403);

        $roles = Role::with('permissions')->get();
        $permissions = Permission::all();
   
        return Inertia::render('RolePermissions', [
            'currentRoute' => Route::currentRouteName(),
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    public function update(Request $request)
    {
        auth()->user()->role->name === Role::NAME_ADMIN ?: abort(403);
        
        $request->validate([
            'roles' => 'array',
            'roles.*.permissions' => 'array',
            'roles.*.permissions.*' => 'exists:permissions,id',
        ]);
    
        // Loop through roles and update permissions
        foreach ($request->roles as $roleId => $data) {
            $role = Role::find($roleId);
            if ($role) {
                $role->permissions()->sync($data['permissions'] ?? []);
                
                // Clear cached permissions for all users with this role
                $role->users()->each(function ($user) {
                    Cache::forget("user_permissions_{$user->id}");
                });
            }
        }

    
        return redirect()->back()->with('success', 'Permissions updated successfully!');
    
    }
}
