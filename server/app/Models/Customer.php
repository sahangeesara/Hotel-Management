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
        'country_id',
        'cuntry_code_id',
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
    public function country(): BelongsTo
    {
        return $this->belongsTo(Nationality::class,'country_id');
    }
    public function countryCode(): BelongsTo
    {
        return $this->belongsTo(CountryCode::class,'cuntry_code_id');
    }
}
