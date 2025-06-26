<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    public const NAME_ADMIN = 'admin';

    public const NAME_SUPERVISOR = 'supervisor';

    public const NAME_COUNTER_SUPERVISOR = 'counter_supervisor';
    
    public const NAME_CASHIER = 'cashier';

    public const NAME_DEVELOPER = 'developer';

    public const NAME_AUDITOR = 'auditor';

    protected $guarded = [];

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permission');
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
