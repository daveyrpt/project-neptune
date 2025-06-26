<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Activity;

class SettingCashCollection extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function latestChange()
    {
        return $this->morphOne(Activity::class, 'subject')->latestOfMany();
    }

    public function firstChange()
    {
        return $this->morphOne(Activity::class, 'subject')->oldestOfMany();
    }

    public function scopeFilter($query, $filters)
    {
        if (!empty($filters['code'])) {
            $query->where('code', 'like', "%{$filters['code']}%");
        }

        if (!empty($filters['name'])) {
            $query->where('name', 'like', "%{$filters['name']}%");
        }

        return $query;
    }
}
