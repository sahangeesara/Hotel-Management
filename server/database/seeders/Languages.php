<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Languages extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        $languages = [
            ['name' => 'English', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Spanish', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'French', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'German', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Chinese (Mandarin)', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Japanese', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Arabic', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Hindi', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Portuguese', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Russian', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Italian', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Korean', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Turkish', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Dutch', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('languages')->insert($languages);
    }
}
