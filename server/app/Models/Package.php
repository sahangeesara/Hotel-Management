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
        'package_type_id',
        'package_amount',
        'is_active',
    ];

    public function packageType(): BelongsTo
    {
        return $this->belongsTo(PackageType::class,'package_type_id');
    }
}
