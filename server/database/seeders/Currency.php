<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Currency extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        $currencies = [
            ['currency' => 'USD', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now], // USA
            ['currency' => 'GBP', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now], // UK
            ['currency' => 'CAD', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now], // Canada
            ['currency' => 'AUD', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now], // Australia
            ['currency' => 'EUR', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now], // Germany
            ['currency' => 'EUR', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now], // France
            ['currency' => 'JPY', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now], // Japan
            ['currency' => 'INR', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now], // India
            ['currency' => 'CNY', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now], // China
            ['currency' => 'BRL', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now], // Brazil
            ['currency' => 'MXN', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now], // Mexico
            ['currency' => 'EUR', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now], // Italy
            ['currency' => 'ZAR', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now], // South Africa
            ['currency' => 'EUR', 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now], // Spain
        ];

        DB::table('currencies')->insert($currencies);
    }
}
