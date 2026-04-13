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
            $table->foreign('book_status_id')->references('id')->on('book_statuses');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wedding_events', function (Blueprint $table) {
            $table->dropForeign(['book_status_id']);
        });
    }
};
