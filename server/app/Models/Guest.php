<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Guest extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'guest_no',
        'name',
        'address',
        'email',
        'city',
        'nic',
        'guest_type',
        'guide_id',
        'gender_id',
        'country',
        'tel_no',
        'is_active',

    ];

    public function guide(): BelongsTo
    {
        return $this->belongsTo(Guides::class,'guide_id');
    }
    public function gender(): BelongsTo
    {
        return $this->belongsTo(Gender::class,'gender_id');
    }
}
