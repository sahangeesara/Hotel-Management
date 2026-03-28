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
        Schema::table('restaurant_events', function (Blueprint $table) {
            $table->foreign('section_id')->references('id')->on('sections');
            $table->foreign('hotel_id')->references('id')->on('hotels');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('restaurant_events', function (Blueprint $table) {
            $table->dropForeign(['section_id']);
            $table->dropForeign(['hotel_id']);
        });    }
};
