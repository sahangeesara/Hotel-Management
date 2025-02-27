<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Supplier extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'supp_no',
        'company_name',
        'name',
        'address',
        'email',
        'city',
        'nic',
        'gender_id',
        'tel_no',
        'is_active',
    ];

    public function gender(): BelongsTo
    {
        return $this->belongsTo(Gender::class,'gender_id');
    }

}
