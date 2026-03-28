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
        Schema::table('transport_books', function (Blueprint $table) {
            $table->foreign('province_id')->references('id')->on('provinces');
            $table->foreign('vehicle_type_id')->references('id')->on('vehicle_types');
            $table->foreign('service_type_id')->references('id')->on('service_types');
            $table->foreign('tour_type_id')->references('id')->on('tour_types');
            $table->foreign('duration_id')->references('id')->on('tour_types');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transport_books', function (Blueprint $table) {
            $table->dropForeign(['province_id']);
            $table->dropForeign(['vehicle_type_id']);
            $table->dropForeign(['service_type_id']);
            $table->dropForeign(['tour_type_id']);
            $table->dropForeign(['duration_id']);
        });
    }
};
