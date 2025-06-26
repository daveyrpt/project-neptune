<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Activity;
use Carbon\Carbon;

class OpenedCounter extends Model
{
    use HasFactory;

    public const STATUS_OPEN_BY_ADMIN = 'opened_by_admin';

    public const STATUS_OPEN_BY_CASHIER = 'opened_by_cashier';

    public const STATUS_CLOSE_BY_CASHIER = 'closed_by_cashier';

    public const STATUS_CLOSE_BY_ADMIN = 'closed_by_admin';

    protected $guarded = [];

    public function collectionCenter()
    {
        return $this->belongsTo(CollectionCenter::class);
    }

    public function counter()
    {
        return $this->belongsTo(Counter::class);
    }

    public function scopeByUser($query, $user = null)
    {
        $user = $user ?? auth()->user();
            
        return $query->when(
            $user->role && $user->role->name === Role::NAME_CASHIER,
            fn($query) => $query->where('user_id', $user->id)
        );
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function latestChange()
    {
        return $this->morphOne(Activity::class, 'subject')->latestOfMany();
    }

    public function firstChange()
    {
        return $this->morphOne(Activity::class, 'subject')->oldestOfMany();
    }
}
