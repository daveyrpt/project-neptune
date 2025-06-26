<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Activity;

class CashierManagement extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $table = 'cashier_managements';

    public function latestChange()
    {
        return $this->morphOne(Activity::class, 'subject')->latestOfMany();
    }

    public function firstChange()
    {
        return $this->morphOne(Activity::class, 'subject')->oldestOfMany();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
