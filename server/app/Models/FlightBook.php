<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FlightBook extends Model
{
    use HasFactory;
    protected $fillable = [
        'flight_id',
        'guest_id',
        'seat_no',
        'class_id',
        'status',
    ];

     public function flight()
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
}
