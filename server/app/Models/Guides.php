<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Guides extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'name',
        'address',
        'email',
        'city',
        'nic',
        'tel_no',
        'gender_id',
        'is_active',
    ];

    public function guest(): HasMany
    {
        return $this->hasMany(Guest::class);
    }
    public function gender(): BelongsTo
    {
        return $this->belongsTo(Gender::class,'gender_id');
    }
}
