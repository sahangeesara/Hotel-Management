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
        Schema::create('general_events', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->char('event_no');
            $table->unsignedBigInteger('event_id')->nullable();
            $table->foreign('event_id')->references('id')->on('events');
            $table->unsignedBigInteger('event_type_id')->nullable();
            $table->foreign('event_type_id')->references('id')->on('event_types');;
            $table->dateTime('event_date');
            $table->time('event_time');
            $table->integer('passengers');
            $table->text('requests')->nullable();
            $table->unsignedBigInteger('organizer_id')->unique();
            $table->unsignedBigInteger('book_status_id')->nullable();
            $table->boolean('is_active')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('general_events');
    }
};
