<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Guest extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'guest_no',
        'name',
        'address',
        'email',
        'city',
        'nic',
        'foreign_nic',
        'guest_type',
        'country_id',
        'cuntry_code_id',
        'guide_id',
        'gender_id',
        'tel_no',
        'is_active',

    ];

    public function guide(): BelongsTo
    {
        return $this->belongsTo(Guides::class,'guide_id');
    }
    public function gender(): BelongsTo
    {
        return $this->belongsTo(Gender::class,'gender_id');
    }
    public function country(): BelongsTo
    {
        return $this->belongsTo(Nationality::class,'country_id');
    }
    public function countryCode(): BelongsTo
    {
        return $this->belongsTo(CountryCode::class,'cuntry_code_id');
    }

    public function roomBook(): HasMany
    {
        return $this->hasMany(RoomBook::class);
    }
    public function transportBook(): HasMany
    {
        return $this->hasMany(TransportBook::class);
    }
    public function order(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function bookingGuestCounts(): HasMany
    {
        return $this->hasMany(BookingGuestCounts::class);
    }

    public function  guestDependentDetail() : HasMany
    {
        return $this->hasMany(GuestDependentDetail::class);
    }

}
