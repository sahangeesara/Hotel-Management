<?php

namespace Database\Seeders;

use App\Models\Hotel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HotelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Hotel::insert([
            [
                'hotel_code' => 'HN00001',
                'name' => 'Araliya',
                'location' => 'Kandy, Sri Lanka',
                'phone' => '0113403112',
                'room_setups_id' => 6,
                'capacity' => 200,
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'hotel_code' => 'HN00002',
                'name' => 'Mahanuge',
                'location' => 'Polonnaruwa, Sri Lanka',
                'phone' => '0113403567',
                'room_setups_id' => 8,
                'capacity' => 100,
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'hotel_code' => 'HN00003',
                'name' => 'Le Grand Galle',
                'location' => 'Hilltop Building, 30 Park Rd, Galle 80000',
                'phone' => '0912228555',
                'room_setups_id' => 6,
                'capacity' => 100,
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'hotel_code' => 'HN00004',
                'name' => 'The Country House Chalets',
                'location' => '297 Morris Rd, Galle 80000',
                'phone' => '0774678721',
                'room_setups_id' => 5,
                'capacity' => 200,
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'hotel_code' => 'HN00005',
                'name' => 'Cinnamon Life at City of Dreams',
                'location' => 'No 01 Justice Akbar Mawatha, Colombo 00200',
                'phone' => '0112220000',
                'room_setups_id' => 10,
                'capacity' => 500,
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'hotel_code' => 'HN00006',
                'name' => 'Morven Hotel',
                'location' => '213 Calle Road, Colombo 03',
                'phone' => '0770408008',
                'room_setups_id' => 10,
                'capacity' => 94,
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
