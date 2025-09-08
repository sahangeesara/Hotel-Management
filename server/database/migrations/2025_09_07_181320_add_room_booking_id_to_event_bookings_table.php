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
        Schema::table('event_bookings', function (Blueprint $table) {
            // Add event_booking_id column if it doesn't exist
            if (!Schema::hasColumn('event_bookings', 'room_booking_id')) {
                $table->unsignedBigInteger('room_booking_id')->after('id');
            }

            // Add foreign key constraint
            $table->foreign('room_booking_id')
                ->references('id')
                ->on('room_books')
                ->onDelete('cascade'); // delete room_book when event_booking is deleted
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('event_bookings', function (Blueprint $table) {
            $table->dropForeign(['room_booking_id']);
            $table->dropColumn('room_booking_id');
        });
    }
};
