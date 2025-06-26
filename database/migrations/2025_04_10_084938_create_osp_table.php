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
        Schema::create('osp', function (Blueprint $table) {
            $table->id();
            $table->foreignId('collection_center_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('counter_id')->nullable()->constrained()->onDelete('set null');
            $table->dateTime('collection_date');
            $table->string('account_number');
            $table->string('account_holder_name');
            $table->string('osp_receipt_number')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('identity_number');
            $table->string('income_code');
            $table->string('import_type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('osp');
    }
};
