<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rounds', function (Blueprint $table): void {
            $table->string('whatsapp_group_url')->nullable()->after('rules_version');
        });
    }

    public function down(): void
    {
        Schema::table('rounds', function (Blueprint $table): void {
            $table->dropColumn('whatsapp_group_url');
        });
    }
};
