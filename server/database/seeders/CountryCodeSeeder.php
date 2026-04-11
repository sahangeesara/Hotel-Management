<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CountryCodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        $codes = [
            ['country_id' => 1, 'country_code' => '+1', 'created_at' => $now, 'updated_at' => $now],
            ['country_id' => 2, 'country_code' => '+44', 'created_at' => $now, 'updated_at' => $now],
            ['country_id' => 3, 'country_code' => '+1', 'created_at' => $now, 'updated_at' => $now],
            ['country_id' => 4, 'country_code' => '+61', 'created_at' => $now, 'updated_at' => $now],
            ['country_id' => 5, 'country_code' => '+49', 'created_at' => $now, 'updated_at' => $now],
            ['country_id' => 6, 'country_code' => '+33', 'created_at' => $now, 'updated_at' => $now],
            ['country_id' => 7, 'country_code' => '+81', 'created_at' => $now, 'updated_at' => $now],
            ['country_id' => 8, 'country_code' => '+91', 'created_at' => $now, 'updated_at' => $now],
            ['country_id' => 9, 'country_code' => '+86', 'created_at' => $now, 'updated_at' => $now],
            ['country_id' => 10, 'country_code' => '+55', 'created_at' => $now, 'updated_at' => $now],
            ['country_id' => 11, 'country_code' => '+52', 'created_at' => $now, 'updated_at' => $now],
            ['country_id' => 12, 'country_code' => '+39', 'created_at' => $now, 'updated_at' => $now],
            ['country_id' => 13, 'country_code' => '+27', 'created_at' => $now, 'updated_at' => $now],
            ['country_id' => 14, 'country_code' => '+34', 'created_at' => $now, 'updated_at' => $now],
            ['country_id' => 15, 'country_code' => '+94', 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('country_codes')->insert($codes);
    }
}
