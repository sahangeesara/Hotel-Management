<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceType extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        $services = [
            ['name' => 'Airport Pickup', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Airport Drop-off', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Point-to-Point Transfer', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Full Day Hire (8 Hours)', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Half Day Hire (4 Hours)', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'City Tour', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Round Trip Tour', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'VIP / Chauffeur Service', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Wedding Transport', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Corporate Event Shuttle', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Inter-Hotel Transfer', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Sightseeing Excursion', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Night Hire', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Emergency / Backup Service', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('service_types')->insert($services);
    }
}
