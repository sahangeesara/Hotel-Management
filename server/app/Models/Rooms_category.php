<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rooms_category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'is_active',
    ];
    public function room(): HasMany
    {
        return $this->hasMany(Rooms::class);
    }
}
