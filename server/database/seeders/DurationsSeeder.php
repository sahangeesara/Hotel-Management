<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DurationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        $durations = [
            ['duration' => '1 Hour', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['duration' => '2 Hours', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['duration' => '4 Hours (Half Day)', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['duration' => '8 Hours (Full Day)', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['duration' => '12 Hours', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['duration' => '24 Hours (1 Day)', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['duration' => '2 Days / 1 Night', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['duration' => '3 Days / 2 Nights', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['duration' => '4 Days / 3 Nights', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['duration' => '5 Days / 4 Nights', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['duration' => '6 Days / 5 Nights', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['duration' => '7 Days (1 Week)', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['duration' => '10 Days', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['duration' => '14 Days (2 Weeks)', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('durations')->insert($durations);
    }
}
