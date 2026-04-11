<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VehicleTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        $vehicles = [
            ['name' => 'Tuk-Tuk (Three Wheeler)', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Budget Sedan (e.g., Alto/Axia)', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Standard Sedan (e.g., Premio/Allion)', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Luxury Sedan (e.g., Mercedes/BMW)', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Mini Van (e.g., Every/K-Car)', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Standard Van (e.g., Hiace/Caravan)', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Luxury Van (e.g., KDH High Roof)', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'SUV (4x4 / Jeep)', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Luxury SUV (e.g., Land Cruiser/Prado)', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Mini Bus (e.g., Coaster/Rosa)', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Large Luxury Coach', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Double Cab (Pick-up)', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Motorbike / Scooter', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Bicycle (Rental)', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('vehicle_types')->insert($vehicles);
    }
}
