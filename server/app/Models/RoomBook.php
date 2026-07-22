<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class RoomBook extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'booking_no',
        'guest_id',
        'r_book',
        'max_guests',
        'number_of_room',
        'package_id',
        'booking_Date',
        'cancel_Date',
        'is_active',
    ];
    protected $casts = [
        'booking_Date' => 'datetime',
        'cancel_Date' => 'datetime',
    ];

    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class, 'guest_id');
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class, 'package_id');
    }

    public function bookingRooms(): HasMany
    {
        return $this->hasMany(BookingRooms::class, 'booking_id');
    }
}
