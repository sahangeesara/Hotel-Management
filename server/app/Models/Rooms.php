<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rooms extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'r_no',
        'r_cost',
        'r_book',
        'r_category_id',
        'is_active',
    ];

    public function roomCategory(): BelongsTo
    {
        return $this->belongsTo(Rooms_category::class,'r_category_id');
    }
}
