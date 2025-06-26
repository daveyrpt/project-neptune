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
        Schema::create('setting_working_days', function (Blueprint $table) {
            $table->id();
            $table->foreignId('collection_center_id')->nullable()->constrained()->onDelete('set null');
            $table->boolean('monday')->default(1);
            $table->boolean('tuesday')->default(1);
            $table->boolean('wednesday')->default(1);
            $table->boolean('thursday')->default(1);
            $table->boolean('friday')->default(1);
            $table->boolean('saturday')->default(0);
            $table->boolean('sunday')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('setting_working_days');
    }
};
