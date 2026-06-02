<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Flight extends Model
{
    use HasFactory;


    protected $fillable = [
        'id',
        'flight_no',
        'airline_id',
        'from',
        'to',
        'departure_time',
        'departure_date',
        'available_seats',
        'total_seats',
        'is_active',
    ];

    public function airline(): BelongsTo
    {
        return $this->belongsTo(Airlines::class,'airline_id');
    }
}
