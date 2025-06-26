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
        //
        Schema::table('receipts', function (Blueprint $table) {
            $table->string('account_number')->nullable()->change();
        });

        Schema::table('receipt_details', function (Blueprint $table) {
            $table->string('bill_number')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('receipts', function (Blueprint $table) {
            $table->string('account_number')->change();
        });

        Schema::table('receipt_details', function (Blueprint $table) {
            $table->string('bill_number')->change();
        });
    }
};
