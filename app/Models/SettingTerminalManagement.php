<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Activity;

class SettingTerminalManagement extends Model
{
    use HasFactory;

    protected $table = 'setting_terminal_managements';

    protected $guarded = [];

    public function incomeCode()
    {
        return $this->belongsTo(IncomeCode::class, 'income_code_id');
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
