<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Activity;

class Osp extends Model 
{
    use HasFactory;

    protected $table = 'osp';

    protected $guarded = [];

    public function collectionCenter()
    {
        return $this->belongsTo(CollectionCenter::class);
    }

    public function counter()
    {
        return $this->belongsTo(Counter::class);
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
