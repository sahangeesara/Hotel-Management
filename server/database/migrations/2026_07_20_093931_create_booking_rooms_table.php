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
        Schema::create('booking_rooms', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('room_category_id');
            $table->foreign('room_category_id')->references('id')->on('rooms_categories');
            $table->unsignedBigInteger('booking_id');
            $table->foreign('booking_id')->references('id')->on('room_books');
            $table->integer('no_of_rooms');
            $table->json('r_no')->comment('Array of room numbers');
            $table->decimal('total_amount', 10, 2);
            $table->boolean('is_active')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_rooms');
    }
};
