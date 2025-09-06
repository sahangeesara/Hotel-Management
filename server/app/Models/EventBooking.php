<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'booking_Date',
        'cancel_Date',
        'is_active',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class,'event_id');
    }
    public function room(): BelongsTo
    {
        return $this->belongsTo(Rooms::class,'r_id');
    }
    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class,'guest_id');
    }
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class,'customer_id');
    }


}
