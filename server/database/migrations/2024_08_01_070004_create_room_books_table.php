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
        Schema::create('room_books', function (Blueprint $table) {
            $table->id();
            $table->char('booking_no');
            $table->unsignedBigInteger('r_id');
            $table->unsignedBigInteger('guest_id');
            $table->string('r_book');
            $table->dateTime('booking_Date');
            $table->dateTime('cancel_Date')->nullable();
            $table->boolean('is_active')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_books');
    }
};
