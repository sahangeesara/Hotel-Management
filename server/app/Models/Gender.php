<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Gender extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'name',
        'is_active',
    ];
    public function empolyee(): HasMany
    {
        return $this->hasMany(Employees::class);
    }
    public function guide(): HasMany
    {
        return $this->hasMany(Guides::class);
    }
    public function guest(): HasMany
    {
        return $this->hasMany(Guest::class);
    }

}
