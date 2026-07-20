<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingRooms extends Model
{
    use HasFactory;


    protected $fillable=[
        'id',
        'room_category_id',
        'no_of_rooms',
        'booking_id',
        'total_amount',
        'is_active',
    ];

    public function roomCategory(): BelongsTo
    {
        return $this->belongsTo(Rooms_category::class,'room_category_id');
    }
}
