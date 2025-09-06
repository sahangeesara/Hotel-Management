<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'package_code',
        'description',
        'name',
        'package_amount',
        'duration',
        'max_guests',
        'event_id',
        'is_active',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class,'event_id');
    }
}
