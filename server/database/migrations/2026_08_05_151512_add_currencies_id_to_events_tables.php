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
        // Hotel Events
        Schema::table('hotel_events', function (Blueprint $table) {
            $table->unsignedBigInteger('currencies_id')
                ->nullable()
                ->after('id');

            $table->foreign('currencies_id')
                ->references('id')
                ->on('currencies')
                ->onDelete('set null');
        });


        // Restaurant Events
        Schema::table('restaurant_events', function (Blueprint $table) {
            $table->unsignedBigInteger('currencies_id')
                ->nullable()
                ->after('id');

            $table->foreign('currencies_id')
                ->references('id')
                ->on('currencies')
                ->onDelete('set null');
        });

        // Wedding Events
        Schema::table('wedding_events', function (Blueprint $table) {
            $table->unsignedBigInteger('currencies_id')
                ->nullable()
                ->after('id');

            $table->foreign('currencies_id')
                ->references('id')
                ->on('currencies')
                ->onDelete('set null');
        });

        Schema::table('room_books', function (Blueprint $table) {
            $table->unsignedBigInteger('currencies_id')
                ->nullable()
                ->after('id');

            $table->foreign('currencies_id')
                ->references('id')
                ->on('currencies')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hotel_events', function (Blueprint $table) {
            $table->dropForeign(['currencies_id']);
            $table->dropColumn('currencies_id');
        });

        Schema::table('restaurant_events', function (Blueprint $table) {
            $table->dropForeign(['currencies_id']);
            $table->dropColumn('currencies_id');
        });

        Schema::table('wedding_events', function (Blueprint $table) {
            $table->dropForeign(['currencies_id']);
            $table->dropColumn('currencies_id');
        });

        Schema::table('room_books', function (Blueprint $table) {
            $table->dropForeign(['currencies_id']);
            $table->dropColumn('currencies_id');
        });
    }
};
