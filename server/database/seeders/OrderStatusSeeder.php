<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('order_statuses')->insert([
            ['name' => 'Completed', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Pending', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Cancel', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
        ]);
    }
}
