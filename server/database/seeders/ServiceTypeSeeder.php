<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        $services = [
            ['name' => 'Airport Pickup', 'price' => 15000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Airport Drop-off', 'price' => 15000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Point-to-Point Transfer', 'price' => 10000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Full Day Hire (8 Hours)', 'price' => 35000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Half Day Hire (4 Hours)', 'price' => 20000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'City Tour', 'price' => 25000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Round Trip Tour', 'price' => 40000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'VIP / Chauffeur Service', 'price' => 60000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Wedding Transport', 'price' => 75000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Corporate Event Shuttle', 'price' => 80000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Inter-Hotel Transfer', 'price' => 12000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Sightseeing Excursion', 'price' => 30000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Night Hire', 'price' => 45000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Emergency / Backup Service', 'price' => 25000, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('service_types')->insert($services);
    }
}
