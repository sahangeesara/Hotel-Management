<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TourTypSeedere extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        $types = [
            ['name' => 'Cultural & Heritage Tour', 'price' => 50000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Wildlife & Safari Tour', 'price' => 75000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Beach & Coastal Tour', 'price' => 60000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Hill Country / Tea Plantation Tour', 'price' => 55000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Adventure & Trekking', 'price' => 80000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Religious / Pilgrimage Tour', 'price' => 45000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'City Sightseeing', 'price' => 25000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Day Trip / Excursion', 'price' => 30000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Overnight Tour', 'price' => 90000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Multi-Day Island Tour', 'price' => 150000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Honeymoon Special', 'price' => 175000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Photography Tour', 'price' => 70000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Educational / Study Tour', 'price' => 65000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Custom / Tailor-Made Tour', 'price' => 200000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('tour_types')->insert($types);
    }
}
