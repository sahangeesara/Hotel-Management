<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HotelEvent extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'event_no',
        'event_type_id',
        'event_date',
        'start_time',
        'end_time',
        'hotel_id',
        'organizer_name',
        'organizer_tel_no',
        'organizer_email',
        'requests',
        'additional_services',
        'is_active',
    ];
}
