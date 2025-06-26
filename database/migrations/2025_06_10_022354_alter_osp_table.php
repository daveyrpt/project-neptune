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

            $table->boolean('is_ready_to_be_upload')->default(0)->nullable()->after('import_type');
            $table->boolean('is_uploaded')->default(0)->nullable()->after('is_ready_to_be_upload');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('osp', function (Blueprint $table) {
            $table->dropColumn('is_ready_to_be_upload');
            $table->dropColumn('is_uploaded');
        });
    }
};
