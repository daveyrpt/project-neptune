<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Activity;

class TerminalManagement extends Model
{
    use HasFactory;

    protected $table = 'terminal_managements';

    protected $guarded = [];

    public function latestReceipt()
    {   
        return $this->hasOne(Receipt::class, 'counter_id')->latestOfMany();
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
