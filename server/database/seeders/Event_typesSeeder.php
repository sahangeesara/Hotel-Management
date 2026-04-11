<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Event_typesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        $types = [
            ['name' => 'Room Stay', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Wedding', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Conference', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Seminar', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Birthday Party', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Corporate Meeting', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Workshop', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Product Launch', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Gala Dinner', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Exhibition', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Award Ceremony', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Engagement', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Board Meeting', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Charity Event', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('event_types')->insert($types);
    }
}
