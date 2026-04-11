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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->char('emp_no');
            $table->string('name');
            $table->string('address')->nullable();
            $table->string('email')->unique()->nullable();
            $table->string('city');
            $table->unsignedBigInteger('employee_type_id');
            $table->char('nic',12)->Unique();
            $table->char('tel_no',10)->Unique();
            $table->boolean('is_active')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
