<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Activity;

class IncomeCode extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function scopeFilter($query, $filters)
    {
        if (!empty($filters['code'])) {
            $query->where('code', 'like', "%{$filters['code']}%");
        }

        if (!empty($filters['name'])) {
            $query->where('name', 'like', "%{$filters['name']}%");
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($query) use ($search) {
                $query->where('code', 'like', '%' . $search . '%')
                    ->orWhere('name', 'like', '%' . $search . '%');
            });
        }

        return $query;
    }

    public function receipts()
    {
        return $this->hasMany(Receipt::class, 'service', 'name'); 
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
