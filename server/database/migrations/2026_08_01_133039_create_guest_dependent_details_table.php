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
        Schema::create('guest_dependent_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('guest_id');
            $table->foreign('guest_id')->references('id')->on('guests');
            $table->string('dependent_name');
            $table->string('dependent_relationship');
            $table->integer('age');
            $table->string('dependent_id');
            $table->boolean('is_active')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guest_dependent_details');
    }
};
