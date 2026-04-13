<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FlightBook extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'booking_no',
        'guest_id',
        'to',
        'from',
        'departure_Date',
        'return_Date',
        'flight_passenger_counts_id',
        'travel_route',
        'currency_id',
        'class_id',
        'flight_id',
        'requests',
        'is_active',
    ];

     public function flight(): BelongsTo
     {
        return $this->belongsTo(Flight::class);
    }

     public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class, 'guest_id');
    }

     public function class(): BelongsTo
    {
        return $this->belongsTo(FlightClass::class, 'class_id');
    }
    public function flightClass(): BelongsTo
    {
        return $this->belongsTo(FlightClass::class, 'class_id');
    }

     public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class, 'currency_id');
    }

    public function flightPassengerCounts(): BelongsTo
    {
        return $this->belongsTo(Flight_passenger_counts::class, 'flight_passenger_counts_id');
    }
}
