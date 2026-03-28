<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Food_status extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        $statuses = [
            ['name' => 'Pending', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Confirmed', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'In the Kitchen', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Preparing', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Cooking', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Plating', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Ready for Pickup', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Out for Delivery', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Delivered', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Served', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Cancelled', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Returned', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Delayed', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Voided', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('food_status')->insert($statuses);
    }
}
