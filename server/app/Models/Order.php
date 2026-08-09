<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'r_id',
        'order_no',
        'customer_id',
        'order_date',
        'order_amount',
        'order_status_id',
        'is_active',
    ];

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItems::class,'order_id');
    }
    public function room(): BelongsTo
    {
        return $this->belongsTo(Rooms::class,'r_id');
    }
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class,'customer_id');
    }
    public function orderStatus(): BelongsTo
    {
        return $this->belongsTo(Order_status::class,'order_status_id');
    }

}
