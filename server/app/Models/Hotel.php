<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    use HasFactory;
    protected $fillable = [
        'hotel_code',
        'name',
        'location',
        'phone',
        'room_setups_id',
        'capacity',
        'is_active',
    ];
}
