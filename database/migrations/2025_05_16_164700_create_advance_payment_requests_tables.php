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
        Schema::create('advance_payment_requests', function (Blueprint $table) {
            $table->id();
            $table->string('system');
            $table->string('account_number');
            $table->string('identity_number');
            $table->string('customer_name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('advance_payment_requests');
    }
};
