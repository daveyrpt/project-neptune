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
        Schema::table('osp', function (Blueprint $table) {
            $table->string('collection_date')->nullable()->change();
            $table->string('account_number')->nullable()->change();
            $table->string('account_holder_name')->nullable()->change();
            $table->string('amount')->nullable()->change();
            $table->string('identity_number')->nullable()->change();
            $table->string('income_code')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
