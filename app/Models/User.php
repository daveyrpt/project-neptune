<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Activitylog\Models\Activity;
use Carbon\Carbon;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class User extends Authenticatable implements HasMedia
{
    use HasApiTokens, HasFactory, Notifiable;
    use InteractsWithMedia;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'staff_id',
        'name',
        'email',
        'google_email',
        'password',
        'role_id',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];


    public function permissions()
    {
        return $this->hasManyThrough(Permission::class, Role::class);
    }

    public function hasPermission($permission)
    {
        return $this->role->permissions->contains('name', $permission);
    }

    public function currentCashierOpenedCounter()
    {
        return $this->hasOne(OpenedCounter::class)->where('status', OpenedCounter::STATUS_OPEN_BY_CASHIER)->whereDate('opened_at', Carbon::today())->with(['collectionCenter', 'counter']);
    }

    public function scopeHasRole($query, $roleNames)
    {
        return $query->whereHas('role', function ($q) use ($roleNames) {
            $q->whereIn('name', (array) $roleNames); 
        });
    }

    public static function notifyRole($roleNames, $notification)
    {
        static::hasRole($roleNames)->get()->each->notify($notification);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    protected static function booted()
    /**
     * Eager load the user's role and permissions when the user is retrieved
     * from the database. This is done to avoid N+1 queries when the user
     * object is accessed in a loop.
     */
    {
        static::retrieved(function ($user) {
            $user->load('role'); 
            $user->load('currentCashierOpenedCounter.collectionCenter', 'currentCashierOpenedCounter.counter');
        });
    }

    public function latestChange()
    {
        return $this->morphOne(Activity::class, 'subject')->latestOfMany();
    }

    public function firstChange()
    {
        return $this->morphOne(Activity::class, 'subject')->oldestOfMany();
    }

    public function getAvatarAttribute()
    {
        return $this->getFirstMediaUrl('avatar');
    }

}
