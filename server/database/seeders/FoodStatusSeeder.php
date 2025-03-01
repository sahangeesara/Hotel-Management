<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FoodStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('food_status')->insert([
            ['name' => 'Available', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Unavailable', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Limited Stock', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Restocking', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Out of Stock', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Discontinued', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Pre-Order', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
        ]);
    }
}
