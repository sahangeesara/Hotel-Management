<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FoodItem extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'name',
        'quantity',
        'food_amount',
        'item_category_id',
        'food_status_id',
        'image',
        'is_active',
    ];
    public function itemCategory(): BelongsTo
    {
        return $this->belongsTo(Item_Category::class,'item_category_id');
    }
    public function foodStatus(): BelongsTo
    {
        return $this->belongsTo(Food_status::class,'food_status_id');
    }

}
