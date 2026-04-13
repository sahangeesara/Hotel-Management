<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrganizerDetails extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'organizer_code',
        'gender_id',
        'name',
        'email',
        'phone',
        'nic',
        'is_active',
    ];

    public function gender(): BelongsTo
    {
        return $this->belongsTo(Gender::class, 'gender_id');
    }

}
