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
        Schema::create('guests', function (Blueprint $table) {
            $table->id();
            $table->char('guest_no');
            $table->string('name');
            $table->string('address')->nullable();
            $table->string('email')->nullable();
            $table->string('city');
            $table->string('guest_type');
            $table->unsignedBigInteger('guide_id')->nullable();
            $table->unsignedBigInteger('country_id')->nullable();
            $table->foreign('country_id')->references('id')->on('nationalities');
            $table->char('nic',20)->nullable()->unique();
            $table->unsignedBigInteger('cuntry_code_id')->nullable();
            $table->foreign('cuntry_code_id')->references('id')->on('country_codes');
            $table->char('tel_no',10)->unique();
            $table->boolean('is_active')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};
