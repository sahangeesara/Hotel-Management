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
        Schema::create('transport_books', function (Blueprint $table) {
            $table->id();
            $table->char('booking_no');
            $table->unsignedBigInteger('guest_id')->nullable();
            $table->foreign('guest_id')->references('id')->on('guests');
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->foreign('customer_id')->references('id')->on('customers');
            $table->unsignedBigInteger('province_id');
            $table->unsignedBigInteger('vehicle_type_id');
            $table->integer('passengers');
            $table->unsignedBigInteger('service_type_id');
            $table->unsignedBigInteger('tour_type_id');
            $table->string('pickup_location');
            $table->string('drop_location');
            $table->dateTime('pickup_date');
            $table->time('pickup_time');
            $table->unsignedBigInteger('duration_id');
            $table->string('custom_duration')->nullable();
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
        Schema::dropIfExists('transport_books');
    }
};
