<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GeneralEvent extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'event_no',
        'event_id',
        'event_type_id',
        'room_id',
        'event_date',
        'start_time',
        'end_time',
        'passengers',
        'organizer_id',
        'book_status_id',
        'requests',
        'is_active',
    ];

    public function eventType(): BelongsTo
    {
        return $this->belongsTo(EventType::class, 'event_type_id');
    }
   public function rooms(): BelongsTo
    {
        return $this->belongsTo(Rooms::class, 'room_id');
    }

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(OrganizerDetails::class, 'organizer_id');
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
