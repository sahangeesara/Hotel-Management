<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Customer extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'name',
        'custom_no',
        'address',
        'email',
        'city',
        'country',
        'nic',
        'gender_id',
        'custom_type',
        'tel_no',
        'is_active',
    ];

    public function gender(): BelongsTo
    {
        return $this->belongsTo(Gender::class,'gender_id');
    }
}
