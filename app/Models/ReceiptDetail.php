<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReceiptDetail extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function receipt()
    {
        return $this->belongsTo(Receipt::class);
    }
}
