<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CountryCode extends Model
{
    use HasFactory;
    protected $fillable = [
            'id',
            'country_id',
            'cuntry_code',
            'is_active',
        ];

    public function country(): BelongsTo
    {
        return $this->belongsTo(Nationality::class,'country_id');
    }
}
