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
        $this->call(NationalitySeeder::class);
        $this->call(CountryCodeSeeder::class);
        $this->call(CurrencySeeder::class);
        $this->call(Event_typesSeeder::class);
        $this->call(FlightClassSeeder::class);
        $this->call(LanguagesSeeder::class);
        $this->call(ProvincesSeeder::class);
        $this->call(RoomsCategorySeeder::class);
        $this->call(RoomSetupSeeder::class);
        $this->call(SectionSeeder::class);
        $this->call(ServiceTypeSeeder::class);
        $this->call(TourTypSeedere::class);
        $this->call(VehicleTypeSeeder::class);
        $this->call(DurationsSeedeSeederr::class);

    }
}
