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
            ['name' => 'Tuk-Tuk (Three Wheeler)', 'price' => 5000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Budget Sedan (e.g., Alto/Axia)', 'price' => 12000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Standard Sedan (e.g., Premio/Allion)', 'price' => 18000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Luxury Sedan (e.g., Mercedes/BMW)', 'price' => 50000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Mini Van (e.g., Every/K-Car)', 'price' => 15000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Standard Van (e.g., Hiace/Caravan)', 'price' => 30000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Luxury Van (e.g., KDH High Roof)', 'price' => 45000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'SUV (4x4 / Jeep)', 'price' => 35000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Luxury SUV (e.g., Land Cruiser/Prado)', 'price' => 70000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Mini Bus (e.g., Coaster/Rosa)', 'price' => 60000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Large Luxury Coach', 'price' => 120000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Double Cab (Pick-up)', 'price' => 30000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Motorbike / Scooter', 'price' => 3000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Bicycle (Rental)', 'price' => 1000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('vehicle_types')->insert($vehicles);
    }
}
