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
        'r_id',
        'booking_no',
        'guest_id',
        'r_book',
        'booking_Date',
        'cancel_Date',
        'is_active',
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Rooms::class,'r_id');
    }
    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class,'guest_id');
    }
}
