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
        Schema::create('flight_books', function (Blueprint $table) {
            $table->id();
            $table->char('booking_no');
            $table->unsignedBigInteger('guest_id');
            $table->foreign('guest_id')->references('id')->on('guests');
            $table->string('to');
            $table->string('from');
            $table->dateTime('departure_Date');
            $table->dateTime('return_Date')->nullable();
            $table->integer('flight_passenger_counts_id')->nullable();
            $table->string('travel_route')->nullable();
            $table->unsignedBigInteger('currency_id')->nullable();
            $table->unsignedBigInteger('class_id')->nullable();
            $table->unsignedBigInteger('airline_ids')->nullable();
            $table->text('requests')->nullable();
            $table->boolean('is_active')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flight_books');
    }
};
