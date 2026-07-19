<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WeddingEvent extends Model
{
    use HasFactory;

    protected $table = 'wedding_events';

    protected $fillable = [
        'event_no',
        'bride_name',
        'groom_name',
        'email',
        'phone',
        'event_date',
        'event_time',
        'passengers',
        'hotel_id',
        'room_id',
        'organizer_id',
        'additional_services',
        'book_status_id',
        'requests',
        'is_active',
    ];

    protected $casts = [
        'event_date' => 'datetime',
        'event_time' => 'datetime:H:i:s',
    ];

    public function hotel():BelongsTo
    {
        return $this->belongsTo(Hotel::class, 'hotel_id');
    }

    public function room():BelongsTo
    {
        return $this->belongsTo(Rooms::class, 'room_id');
    }

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(OrganizerDetails::class, 'organizer_id');
    }

    public function bookStatus():BelongsTo
    {
        return $this->belongsTo(BookStatus::class, 'book_status_id');
    }
}
