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
        Schema::table('food_items', function (Blueprint $table) {
            $table->foreign('food_status_id')->references('id')->on('food_status');
            $table->foreign('item_category_id')->references('id')->on('item__categories');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('food_items', function (Blueprint $table) {
            $table->dropForeign(['food_status_id']);
            $table->dropForeign(['item_category_id']);
        });
    }
};
