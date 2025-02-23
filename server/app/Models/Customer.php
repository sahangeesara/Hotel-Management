<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Customer extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'user_id',
        'address',
        'city',
        'country',
        'nic',
        'gender_id',
        'tel_no',
        'image',
        'image_url',
        'is_active',
    ];
    protected $appends = ['image_url'];
    public function gender(): BelongsTo
    {
        return $this->belongsTo(Gender::class,'gender_id');
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(Gender::class,'user_id');
    }
    protected function getImageUrlAttribute()
    {
        return $this->attributes['image_url'] = url(Storage::url($this->image));
    }
}
