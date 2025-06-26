<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Activity;

class SettingWorkingDay extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function scopeFilter($query, $filters)
    {
        if (!empty($filters['collection_center_id'])) {
            $query->where('collection_center_id', 'like', "%{$filters['collection_center_id']}%");
        }

        return $query;
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
