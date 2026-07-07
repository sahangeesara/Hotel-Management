<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PackageTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('package_types')->insert([
            [
                'name' => 'Room Only',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Bed & Breakfast',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Half Board',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Full Board',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'All Inclusive',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
