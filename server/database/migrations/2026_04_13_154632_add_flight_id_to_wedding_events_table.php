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
        Schema::table('wedding_events', function (Blueprint $table) {
            $table->foreign('organizer_id')->references('id')->on('organizer_details');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wedding_events', function (Blueprint $table) {
            $table->dropForeign(['organizer_id']);
        });
    }
};
