<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new  class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('payment_no')->unique();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->foreign('customer_id')->references('id')->on('customers');
            $table->unsignedBigInteger('guest_id')->nullable();
            $table->foreign('guest_id')->references('id')->on('guests');
            $table->unsignedBigInteger('order_id')->nullable();
            $table->foreign('order_id')->references('id')->on('orders');
            $table->unsignedBigInteger('room_book_id')->nullable();
            $table->foreign('room_book_id')->references('id')->on('room_books');
            $table->unsignedBigInteger('hotel_event_id')->nullable();
            $table->foreign('hotel_event_id')->references('id')->on('hotel_events');
            $table->unsignedBigInteger('restaurant_event_id')->nullable();
            $table->foreign('restaurant_event_id')->references('id')->on('restaurant_events');
            $table->unsignedBigInteger('wedding_event_id')->nullable();
            $table->foreign('wedding_event_id')->references('id')->on('wedding_events');
            $table->unsignedBigInteger('payment_status_id');
            $table->foreign('payment_status_id')->references('id')->on('payment_statuses');
            $table->unsignedBigInteger('payment_method_id');
            $table->foreign('payment_method_id')->references('id')->on('payment_methods');
            $table->unsignedBigInteger('currencies_id')->nullable();
            $table->foreign('currencies_id')->references('id')->on('currencies');
            $table->string('payment_date');
            $table->decimal('amount', 10, 2);
            $table->string('payment_type');
            $table->string('payment_note')->nullable();
            $table->boolean('is_active')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
