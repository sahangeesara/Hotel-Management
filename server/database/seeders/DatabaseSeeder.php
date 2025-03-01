<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(RoomTypeSeeder::class);
        $this->call(GenderSeeder::class);
        $this->call(ItemCategorySeeder::class);
        $this->call(EmployeeTypeSeeder::class);
        $this->call(FoodStatusSeeder::class);
        $this->call(OrderStatusSeeder::class);
    }
}
