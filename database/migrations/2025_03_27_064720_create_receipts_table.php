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
        Schema::create('receipts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('collection_center_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('counter_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->dateTime('date');

            $table->string('account_number');
            $table->string('receipt_grouping_id');
            $table->string('receipt_number');
            $table->text('description')->nullable();
            $table->string('reference_number')->nullable();
            $table->decimal('total_amount', 10, 2);
            $table->string('payment_type');
            $table->text('payment_detail');

            $table->decimal('amount', 10, 2)->nullable();
            $table->decimal('amount_to_be_paid', 10, 2)->nullable();
            $table->decimal('amount_paid', 10, 2)->nullable();
            $table->decimal('return_amount', 10, 2)->nullable();
            $table->text('edit_description')->nullable();
            $table->string('service')->nullable();
            $table->string('status')->default('pending');
            $table->boolean('sync_status')->default(0);
            $table->boolean('is_imported')->default(0);
            $table->timestamps();
        });

        // Link to `receipts` table because a receipt can have multiple details
        Schema::create('receipt_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('receipt_id')->nullable()->constrained()->onDelete('set null');

            $table->string('bill_number');
            $table->string('income_code')->nullable();
            $table->decimal('amount', 10, 2)->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('receipts');

        Schema::dropIfExists('receipt_details');
    }
};
