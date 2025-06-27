<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $appends = ['gps', 'tarikh', 'masa', 'foto', 'tahap', 'lokasi', 'sumber', 'pegawai', 'phone', 'address', 'tugasan'];

    public function getGpsAttribute()
    {
        return "{$this->latitude}, {$this->longitude}";
    }

    public function getTarikhAttribute()
    {
        return $this->created_at->format('d/m/Y');
    }

    public function getMasaAttribute()
    {
        return $this->created_at->format('H:i');
    }

    public function getFotoAttribute()
    {
        return 0; // Telegram doesn't support photo yet
    }

    public function getTahapAttribute()
    {
        return 'New'; // default state
    }

    public function getLokasiAttribute()
    {
        return 'Lokasi tidak diketahui'; // fallback if you don't parse address
    }

    public function getSumberAttribute()
    {
        return 'Telegram';
    }

    public function getPegawaiAttribute()
    {
        return 'Pelapor Telegram';
    }

    public function getPhoneAttribute()
    {
        return '-'; // or extract phone from future structured data
    }

    public function getAddressAttribute()
    {
        return '-'; // same as above
    }

    public function getTugasanAttribute()
    {
        return ''; // not assigned yet
    }

}
