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
        Schema::create('event_bookings', function (Blueprint $table) {
            $table->id();
            $table->char('event_booking_no')->unique();;

            $table->unsignedBigInteger('event_id');
            $table->unsignedBigInteger('package_id');
            $table->unsignedBigInteger('customer_id')->default(0);
            $table->unsignedBigInteger('guest_id')->default(0);
            $table->unsignedBigInteger('r_id');
            $table->dateTime('booking_Date');
            $table->dateTime('cancel_Date')->nullable();

            $table->foreign('event_id')->references('id')->on('events');
            $table->foreign('customer_id')->references('id')->on('customers');
            $table->foreign('guest_id')->references('id')->on('guests');
            $table->foreign('r_id')->references('id')->on('rooms');
            $table->foreign('package_id')->references('id')->on('packages');

            $table->boolean('is_active')->default(1);
            $table->timestamps();


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_bookings');
    }
};
