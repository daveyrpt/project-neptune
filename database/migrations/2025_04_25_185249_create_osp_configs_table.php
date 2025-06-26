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
        Schema::create('osp_configs', function (Blueprint $table) {
            $table->id();
            $table->string('import_type');
            $table->string('description')->nullable();
            $table->string('header')->nullable();
            $table->string('footer')->nullable();
            $table->string('collection_date_starting')->nullable();
            $table->string('collection_date_length')->nullable();
            $table->string('income_code_starting')->nullable();
            $table->string('income_code_length')->nullable();
            $table->string('account_number_starting')->nullable();
            $table->string('account_number_length')->nullable();
            $table->string('account_holder_name_starting')->nullable();
            $table->string('account_holder_name_length')->nullable();
            $table->string('amount_starting')->nullable();
            $table->string('amount_length')->nullable();
            $table->string('osp_receipt_starting')->nullable();
            $table->string('osp_receipt_length')->nullable();
            $table->string('identity_number_starting')->nullable();
            $table->string('identity_number_length')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('osp_configs');
    }
};
