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
        
        Schema::create('setting_default_cashier_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('collection_center_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('counter_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
        });


        Schema::create('setting_terminal_managements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('collection_center_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('income_code_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
        });

        Schema::create('setting_cash_collections', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->foreignId('bank_id')->nullable()->constrained()->onDelete('set null');
            $table->boolean('is_default')->default(0);
            $table->timestamps();
        });

        Schema::create('setting_auto_numberings', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->foreignId('setting_cash_collection_id')->nullable()->constrained()->onDelete('set null');
            $table->string('prefix')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        Schema::dropIfExists('setting_default_cashier_locations');
        Schema::dropIfExists('setting_terminal_managements');
        Schema::dropIfExists('setting_cash_collections');
        Schema::dropIfExists('setting_auto_numberings');
    }
};
