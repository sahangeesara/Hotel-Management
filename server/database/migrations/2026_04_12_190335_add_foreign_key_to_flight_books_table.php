<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('flight_books', function (Blueprint $table) {
            $table->foreign('flight_id')->references('id')->on('flights');
            $table->foreign('flight_passenger_counts_id')->references('id')->on('flight_passenger_counts');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('flight_books', function (Blueprint $table) {
            $table->dropForeign(['flight_id']);
            $table->dropForeign(['flight_passenger_counts_id']);

        });
    }
};
