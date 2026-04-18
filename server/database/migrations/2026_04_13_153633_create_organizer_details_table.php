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
        Schema::create('organizer_details', function (Blueprint $table) {
            $table->id();
            $table->char('organizer_code');
            $table->unsignedBigInteger('gender_id');
            $table->foreign('gender_id')->references('id')->on('genders');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->char('nic');
            $table->string('address');
            $table->boolean('is_active')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organizer_details');
    }
};
