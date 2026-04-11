<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomSetupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        $setups = [
            ['name' => 'Theater Style', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Classroom Style', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'U-Shape Layout', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Boardroom Style', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Banquet Round', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Cabaret Style', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Cocktail / Standing', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Hollow Square', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Herringbone Style', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Reception Style', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Dinner Dance', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Exhibition Layout', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Auditorium', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Workshop Cluster', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('room_setups')->insert($setups);
    }
}
