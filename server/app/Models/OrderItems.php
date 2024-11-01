<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItems extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'order_id',
        'food_id',
        'quantity',
        'order_amount',
        'is_active',
    ];
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class,'order_id');
    }
    public function food(): BelongsTo
    {
        return $this->belongsTo(FoodItem::class,'food_id');
    }
}
