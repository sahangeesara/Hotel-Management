<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use App\Models\Duration;
use Illuminate\Support\Facades\DB;

class DurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        $durations = [
            ['duration' => '1 Hour','created_at' => $now, 'updated_at' => $now],
            ['duration' => '2 Hours','created_at' => $now, 'updated_at' => $now],
            ['duration' => '3 Hours','created_at' => $now, 'updated_at' => $now],
            ['duration' => '4 Hours','created_at' => $now, 'updated_at' => $now],
            ['duration' => '5 Hours','created_at' => $now, 'updated_at' => $now],
            ['duration' => '6 Hours','created_at' => $now, 'updated_at' => $now],
            ['duration' => 'Half Day','created_at' => $now, 'updated_at' => $now],
            ['duration' => 'Full Day','created_at' => $now, 'updated_at' => $now],
            ['duration' => '2 Days','created_at' => $now, 'updated_at' => $now],
            ['duration' => '3 Days','created_at' => $now, 'updated_at' => $now],
            ['duration' => '4 Days','created_at' => $now, 'updated_at' => $now],
            ['duration' => '5 Days','created_at' => $now, 'updated_at' => $now],
            ['duration' => '1 Week','created_at' => $now, 'updated_at' => $now],
            ['duration' => 'Custom','created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('durations')->insert($durations);

    }
}
