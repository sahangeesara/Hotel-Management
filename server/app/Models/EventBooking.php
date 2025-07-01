<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventBooking extends Model
{
    use HasFactory;


    protected $fillable = [
        'id',
        'event_booking_no',
        'guest_id',
        'customer_id',
        'event_id',
        'r_id',
        'is_active',
    ];
}
