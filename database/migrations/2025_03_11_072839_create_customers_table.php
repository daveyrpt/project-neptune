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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('system')->nullable();
            $table->string('name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('bill_number')->nullable();
            $table->date('bill_date')->nullable();
            $table->decimal('amount', 10, 2)->nullable();
            $table->string('identity_number')->nullable();
            $table->text('address_1')->nullable();
            $table->text('address_2')->nullable();
            $table->text('address_3')->nullable();
            $table->boolean('sync_status')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
