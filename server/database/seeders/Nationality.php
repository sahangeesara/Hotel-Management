<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class Nationality extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        $nationalities = [
            ['id' => 1, 'name' => 'American', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'name' => 'British', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'name' => 'Canadian', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 4, 'name' => 'Australian', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 5, 'name' => 'German', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 6, 'name' => 'French', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 7, 'name' => 'Japanese', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 8, 'name' => 'Indian', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 9, 'name' => 'Chinese', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 10, 'name' => 'Brazilian', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 11, 'name' => 'Mexican', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 12, 'name' => 'Italian', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 13, 'name' => 'South African', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 14, 'name' => 'Spanish', 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('nationalities')->insert($nationalities);
    }
}
