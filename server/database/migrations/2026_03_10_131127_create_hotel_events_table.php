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
        Schema::create('hotel_events', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->date('event_no');
            $table->unsignedBigInteger('event_type_id')->nullable();
            $table->foreign('event_type_id')->references('id')->on('event_types');
            $table->dateTime('event_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->unsignedBigInteger('hotel_id')->nullable();
            $table->foreign('hotel_id')->references('id')->on('hotels');
            $table->string('organizer_name');
            $table->char('organizer_tel_no',10)->unique();
            $table->string('organizer_email')->nullable();
            $table->text('requests')->nullable();
            $table->string('additional_services')->nullable();
            $table->boolean('is_active')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotel_events');
    }
};
