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
        Schema::create('flight_passenger_counts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('flight_book_id');
            $table->foreign('flight_book_id')->references('id')->on('flight_books');
            $table->integer('adults');
            $table->integer('children');
            $table->integer('infants');
            $table->decimal('total_amount');
            $table->boolean('is_active')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flight_passenger_counts');
    }
};
