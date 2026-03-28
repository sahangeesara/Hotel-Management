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
        Schema::create('wedding_events', function (Blueprint $table) {
            $table->id();
            $table->date('event_no');
            $table->string('bride_name');
            $table->string('groom_name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->dateTime('event_date');
            $table->time('event_time');
            $table->integer('passengers');
            $table->unsignedBigInteger('hotel_id')->nullable();
            $table->string('additional_services')->nullable();
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
        Schema::dropIfExists('wedding_events');
    }
};
