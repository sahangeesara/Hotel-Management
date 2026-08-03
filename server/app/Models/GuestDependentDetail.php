<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GuestDependentDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'guest_id',
        'dependent_name',
        'age',
        'dependent_relationship',
        'dependent_id',
        'is_active',
    ];

    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class, 'guest_id');
    }
}
