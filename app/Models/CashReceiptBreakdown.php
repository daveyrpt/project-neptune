<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Activity;

class CashReceiptBreakdown extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'RM100' => 'integer',
        'RM50' => 'integer',
        'RM20' => 'integer',
        'RM10' => 'integer',
        'RM5' => 'integer',
        'RM1' => 'integer',
        'RM0_50' => 'integer',
        'RM0_20' => 'integer',
        'RM0_10' => 'integer',
        'RM0_05' => 'integer',
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

    public function scopeByUser($query, $user = null)
    {
        $user = $user ?? auth()->user();
            
        return $query->when(
            $user->role && $user->role->name === Role::NAME_CASHIER,
            fn($query) => $query->where('user_id', $user->id)
        );
    }
    
    public function getTotalCashAttribute()
    {
        return $this->RM100 * 100 +
            $this->RM50 * 50 +
            $this->RM20 * 20 +
            $this->RM10 * 10 +
            $this->RM5 * 5 +
            $this->RM1 * 1;
    }

    public function getTotalCoinAttribute()
    {
        return $this->RM0_50 * 0.50 +
            $this->RM0_20 * 0.20 +
            $this->RM0_10 * 0.10 +
            $this->RM0_05 * 0.05;
    }

    public function getTotalAllAttribute()
    {
        return $this->total_cash + $this->total_coin;
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
