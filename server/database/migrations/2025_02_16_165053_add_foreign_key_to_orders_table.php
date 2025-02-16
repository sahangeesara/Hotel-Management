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
        Schema::table('orders', function (Blueprint $table) {
            $table->foreign('r_id')->references('id')->on('rooms');
            $table->foreign('guest_id')->references('id')->on('guests');
            $table->foreign('order_status_id')->references('id')->on('order_statuses');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['r_id']);
            $table->dropForeign(['guest_id']);
            $table->dropForeign(['order_status_id']);

        });
    }
};
