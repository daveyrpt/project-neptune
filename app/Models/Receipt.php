<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ReceiptDetail;
use Spatie\Activitylog\Models\Activity;

class Receipt extends Model
{
    use HasFactory;

    public const STATUS_GENERATED = 'generated';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_EDITED = 'edited';
    public const STATUS_CANCEL_REQUEST = 'cancel request';
    public const STATUS_REPLACED = 'replaced';
    protected $casts = [
        'payment_detail' => 'array',
        // 'is_active' => 'boolean',
        // 'price' => 'float',
        // 'settings' => 'array', 
        // 'created_at' => 'datetime:d/m/Y',
    ];

    protected $guarded = [];

    public const ACCEPTABLE_STATUSES = [
        self::STATUS_GENERATED,
        self::STATUS_EDITED,
        self::STATUS_REPLACED,
        self::STATUS_CANCEL_REQUEST
    ];

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

    public function details()
    {
        return $this->hasMany(ReceiptDetail::class);
    }

    public function cancelled()
    {
        return $this->hasOne(CancelledReceipt::class, 'receipt_id');
    }

    public function paymentType()
    {
        return $this->belongsTo(PaymentType::class, 'payment_type', 'name');
    }

    public function incomeCode()
    {
        return $this->belongsTo(IncomeCode::class, 'service', 'name');
    }

    public function collectionCenter()
    {
        return $this->belongsTo(CollectionCenter::class);
    }

    public function counter()
    {
        return $this->belongsTo(Counter::class);
    }

    public function activities()
    {
        return $this->morphMany(Activity::class, 'subject');
    }
    
    public static function currentReceiptNumber($counter_id = null)
    {
        return static::where('counter_id', $counter_id)->where('is_imported', false)->where('status', '!=', self::STATUS_CANCELLED)->max('receipt_number');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'account_number', 'account_number');
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
