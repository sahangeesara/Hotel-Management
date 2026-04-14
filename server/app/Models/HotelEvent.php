<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HotelEvent extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'name',
        'event_no',
        'event_id',
        'event_type_id',
        'event_date',
        'start_time',
        'end_time',
        'passengers',
        'hotel_id',
        'organizer_id',
        'book_status_id',
        'requests',
        'additional_services',
        'is_active',
    ];

    public function eventType(): BelongsTo
    {
        return $this->belongsTo(EventType::class, 'event_type_id');
    }

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(OrganizerDetails::class, 'organizer_id');
    }
    public function hotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class, 'hotel_id');
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'event_id');
    }
    public function bookStatus(): BelongsTo
    {
        return $this->belongsTo(BookStatus::class, 'book_status_id');
    }
}
