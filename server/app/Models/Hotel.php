<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    public function roomSetup(): BelongsTo
    {
        return $this->belongsTo(RoomSetup::class,'room_setups_id');
    }
}
