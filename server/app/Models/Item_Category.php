<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Item_Category extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'name',
        'is_active',
    ];

    public function foodItem(): HasMany
    {
        return $this->hasMany(FoodItem::class);
    }
}
