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
            $table->foreignId('hotel_id')
                ->nullable()
                ->after('package_id')
                ->constrained('hotels')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('room_books', function (Blueprint $table) {
            $table->dropForeign(['hotel_id']);
            $table->dropColumn('hotel_id');
        });
    }
};
