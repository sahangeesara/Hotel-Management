<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_no',
        'customer_id',
        'guest_id',
        'order_id',
        'room_book_id',
        'hotel_event_id',
        'restaurant_event_id',
        'wedding_event_id',
        'payment_status_id',
        'payment_method_id',
        'currencies_id',
        'payment_date',
        'amount',
        'payment_type',
        'payment_note',
        'is_active',
    ];

    protected $casts = [
        'payment_date' => 'datetime',
        'amount' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class, 'guest_id');
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function roomBook(): BelongsTo
    {
        return $this->belongsTo(RoomBook::class, 'room_book_id');
    }

    public function hotelEvent(): BelongsTo
    {
        return $this->belongsTo(HotelEvent::class, 'hotel_event_id');
    }

    public function restaurantEvent(): BelongsTo
    {
        return $this->belongsTo(RestaurantEvent::class, 'restaurant_event_id');
    }


    public function weddingEvent() : BelongsTo
    {
        return $this->belongsTo(WeddingEvent::class, 'wedding_event_id');
    }

    public function paymentStatus(): BelongsTo
    {
        return $this->belongsTo(PaymentStatus::class, 'payment_status_id');
    }


    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id');
    }

    public function currency():BelongsTo
    {
        return $this->belongsTo(Currency::class, 'currencies_id');
    }
}
