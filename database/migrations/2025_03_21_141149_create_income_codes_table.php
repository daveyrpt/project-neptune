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
        Schema::create('income_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('receipt_collection_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('bank_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('income_category_id')->nullable()->constrained()->onDelete('set null');
            $table->string('code')->unique();
            $table->string('name');
            $table->string('description')->nullable();
            $table->string('gl_account')->nullable();
            $table->decimal('default_amount', 10, 2)->nullable();
            $table->string('printed_receipt_format')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('income_codes');
    }
};
