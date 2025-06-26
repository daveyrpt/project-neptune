<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Activity;

class FloatCash extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [

    ];

    public function collectionCenter()
    {
        return $this->belongsTo(CollectionCenter::class);
    }

    public function counter()
    {
        return $this->belongsTo(Counter::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getTotalAmount()
    {
        $denominations = [
            'RM100' => 100,
            'RM50'  => 50,
            'RM20'  => 20,
            'RM10'  => 10,
            'RM5'   => 5,
            'RM1'   => 1,
            'RM0_50'   => 0.50,
            'RM0_20'   => 0.20,
            'RM0_10'   => 0.10,
            'RM0_05'   => 0.05,
        ];

        $total = 0;

        foreach ($denominations as $column => $value) {
            $quantity = $this->{$column} ?? 0; 
            $total += $quantity * $value;
        }

        return $total;
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
