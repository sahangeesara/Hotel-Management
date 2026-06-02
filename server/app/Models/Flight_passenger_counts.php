<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Flight_passenger_counts extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'flight_book_id',
        'adults',
        'children',
        'infants',
        'total_amount',
        'is_active',
    ];

    public function flightBook(): BelongsTo
    {
        return $this->belongsTo(FlightBook::class, 'flight_book_id');
    }
}
