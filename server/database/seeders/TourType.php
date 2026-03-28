<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TourType extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        $types = [
            ['name' => 'Cultural & Heritage Tour', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Wildlife & Safari Tour', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Beach & Coastal Tour', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Hill Country / Tea Plantation Tour', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Adventure & Trekking', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Religious / Pilgrimage Tour', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'City Sightseeing', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Day Trip / Excursion', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Overnight Tour', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Multi-Day Island Tour', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Honeymoon Special', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Photography Tour', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Educational / Study Tour', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Custom / Tailor-Made Tour', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('tour_types')->insert($types);
    }
}
