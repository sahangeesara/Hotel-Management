<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'r_id',
        'guest_id',
        'order_date',
        'order_amount',
        'order_status_id',
        'is_active',
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Rooms::class,'r_id');
    }
    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class,'guest_id');
    }
    public function orderStatus(): BelongsTo
    {
        return $this->belongsTo(Order_status::class,'order_status_id');
    }

}
