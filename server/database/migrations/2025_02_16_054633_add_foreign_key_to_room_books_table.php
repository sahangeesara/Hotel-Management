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
        Schema::table('room_books', function (Blueprint $table) {
            $table->foreign('r_id')->references('id')->on('rooms');
            $table->foreign('guest_id')->references('id')->on('guests');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('room_books', function (Blueprint $table) {
            $table->dropForeign(['r_id']);
            $table->dropForeign(['guest_id']);
        });
    }
};
