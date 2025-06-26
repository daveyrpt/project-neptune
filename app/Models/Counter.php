<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Activity;

class Counter extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function scopeFilter($query, $filters)
    {
        if (!empty($filters['collection_center_id'])) {
            $query->where('collection_center_id', 'like', "%{$filters['collection_center_id']}%");
        }

        if (!empty($filters['name'])) {
            $query->where('name', 'like', "%{$filters['name']}%");
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($query) use ($search) {
                $query->where('collection_center_id', 'like', '%' . $search . '%')
                    ->orWhere('name', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        return $query;
    }

    public function collectionCenter()
    {
        return $this->belongsTo(CollectionCenter::class);
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
