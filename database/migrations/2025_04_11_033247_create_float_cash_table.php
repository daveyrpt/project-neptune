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
        Schema::create('float_cashes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('collection_center_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('counter_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->dateTime('set_at');

            // Cash denominations
            $table->integer('RM100')->nullable()->default(0);
            $table->integer('RM50')->nullable()->default(0);
            $table->integer('RM20')->nullable()->default(0);
            $table->integer('RM10')->nullable()->default(0);
            $table->integer('RM5')->nullable()->default(0);
            $table->integer('RM1')->nullable()->default(0);

            // Coin denominations
            $table->integer('RM0_50')->nullable()->default(0);
            $table->integer('RM0_20')->nullable()->default(0);
            $table->integer('RM0_10')->nullable()->default(0);
            $table->integer('RM0_05')->nullable()->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('float_cashes');
    }
};
