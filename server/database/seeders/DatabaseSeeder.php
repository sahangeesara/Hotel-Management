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
        $this->call(Nationality::class);
        $this->call(CountryCode::class);
        $this->call(Currency::class);
        $this->call(Event_types::class);
        $this->call(FlightClass::class);
        $this->call(Food_status::class);
        $this->call(Languages::class);
        $this->call(Provinces::class);
        $this->call(Rooms_category::class);
        $this->call(RoomSetup::class);
        $this->call(Section::class);
        $this->call(ServiceType::class);
        $this->call(TourType::class);
        $this->call(VehicleType::class);
        $this->call(Durations::class);

    }
}
