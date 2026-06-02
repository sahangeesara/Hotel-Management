<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransportBook extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'guest_id',
        'customer_id',
        'province_id',
        'passengers',
        'service_type_id',
        'vehicle_type_id',
        'tour_type_id',
        'pickup_location',
        'drop_location',
        'pickup_date',
        'pickup_time',
        'duration_id',
        'custom_duration',
        'requests',
        'is_active',
    ];

    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class, 'service_type_id');
    }
    public function vehicleType(): BelongsTo
    {
        return $this->belongsTo(VehicleType::class, 'vehicle_type_id');
    }
    public function tourType(): BelongsTo
    {
        return $this->belongsTo(TourType::class, 'tour_type_id');
    }

    public function duration(): BelongsTo
    {
        return $this->belongsTo(Duration::class, 'duration_id');
    }
    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class, 'guest_id');
    }
     public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }
     public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class, 'province_id');
    }

}
