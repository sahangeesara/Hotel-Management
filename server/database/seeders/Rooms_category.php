<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Rooms_category extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        $categories = [
            ['name' => 'Standard Room', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Superior Room', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Deluxe Room', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Junior Suite', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Executive Suite', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Presidential Suite', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Family Room', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Ocean View Room', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Garden Villa', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Pool Villa', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Penthouse', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Bungalow', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Cabana', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Dormitory', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('rooms_categories')->insert($categories);
    }
}
