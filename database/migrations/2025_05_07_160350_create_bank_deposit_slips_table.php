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
        Schema::create('bank_deposit_slips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('collection_center_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('counter_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->dateTime('date');
            $table->string('receipt_collection')->nullable();
            $table->string('report_type')->nullable();
            $table->string('payment_type')->nullable();
            $table->decimal('amount_from_receipt', 10, 2);
            $table->decimal('amount_from_cash_breakdown_receipt', 10, 2);
            $table->dateTime('deposit_date')->nullable();
            $table->string('slip_number')->nullable();
            $table->string('status')->default('generated');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_deposit_slips');
    }
};
