<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Activity;

class SettingAutoNumbering extends Model
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

        if (!empty($filters['setting_cash_collection_id'])) {
            $query->where('setting_cash_collection_id', 'like', "%{$filters['setting_cash_collection_id']}%");
        }

        return $query;
    }
}
