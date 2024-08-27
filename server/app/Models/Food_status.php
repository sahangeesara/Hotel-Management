<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Food_status extends Model
{
    use HasFactory;
    protected $table = 'food_status';

    protected $fillable = [
        'id',
        'name',
        'is_active',
    ];
}
