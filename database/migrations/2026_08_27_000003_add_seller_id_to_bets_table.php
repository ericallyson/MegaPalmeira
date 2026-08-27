<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bets', function (Blueprint $table): void {
            $table->foreignId('seller_id')
                ->nullable()
                ->after('bettor_id')
                ->constrained('sellers')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('bets', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('seller_id');
        });
    }
};
