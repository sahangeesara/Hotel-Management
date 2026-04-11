<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FlightClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        $classes = [
            ['class_name' => 'Economy Class', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['class_name' => 'Premium Economy', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['class_name' => 'Business Class', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['class_name' => 'First Class', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['class_name' => 'Suite Class', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['class_name' => 'Basic Economy', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['class_name' => 'Business Suite', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['class_name' => 'Private Jet / Charter', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['class_name' => 'Upper Class', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['class_name' => 'World Traveller', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['class_name' => 'Club World', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['class_name' => 'Executive Class', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['class_name' => 'Comfort Plus', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['class_name' => 'Promotional / Group', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('flight_classes')->insert($classes);
    }
}
