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
        Schema::create('cashier_managements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('collection_center_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('counter_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('retail_money')->nullable();
            $table->string('max_cash')->nullable();
            $table->string('max_receipt')->nullable();
            $table->string('received_amount_in_cash')->nullable();
            $table->string('received_amount_in_cheque')->nullable();
            $table->string('received_amount_in_card_credit')->nullable();
            $table->string('received_amount_in_postage')->nullable();
            $table->string('received_amount_in_eft_si')->nullable();
            $table->string('received_amount_in_bank_draft')->nullable();
            $table->string('received_amount_in_bank_slip')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cashier_managements');
    }
};
