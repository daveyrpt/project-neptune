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
        Schema::create('system_configurations', function (Blueprint $table) {
            $table->id();
            $table->string('status')->default('online');
            $table->string('total_max_cash')->nullable();
            $table->string('total_max_receipt')->nullable();
            $table->string('max_float_cash')->nullable();
            $table->string('allowed_cancel_receipt')->nullable();
            $table->string('osp_status')->nullable();
            $table->string('receipt_format')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_configurations');
    }
};
