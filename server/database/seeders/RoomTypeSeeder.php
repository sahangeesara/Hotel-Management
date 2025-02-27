<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('rooms_categories')->insert([
            ['name' => 'Single Room'],
            ['name' => 'Queen Room'],
            ['name' => 'Double Room'],
            ['name' => 'Hall'],
        ]);
    }
}
