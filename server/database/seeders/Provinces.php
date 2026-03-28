<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Provinces extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        $provinces = [
            ['name' => 'Central', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Eastern', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'North Central', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Northern', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'North Western', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Sabaragamuwa', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Southern', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Uva', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Western', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('provinces')->insert($provinces);
    }
}
