<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employees extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'name',
        'address',
        'email',
        'city',
        'nic',
        'employee_type_id',
        'gender_id',
        'tel_no',
        'is_active',
    ];

    public function employeeType(): BelongsTo
    {
        return $this->belongsTo(Employee_type::class,'employee_type_id');
    }

    public function gender(): BelongsTo
    {
        return $this->belongsTo(Gender::class,'gender_id');
    }

}
