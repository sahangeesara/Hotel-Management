<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        $sections = [
            ['name' => 'Main Dining Hall', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Poolside Terrace', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Rooftop Bar', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Garden Area', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Private Dining Room A', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Private Dining Room B', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Ballroom West', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Ballroom East', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Beachfront Deck', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Executive Lounge', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Mezzanine Level', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Veranda', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Wine Cellar', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Coffee Shop', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('sections')->insert($sections);
    }
}
