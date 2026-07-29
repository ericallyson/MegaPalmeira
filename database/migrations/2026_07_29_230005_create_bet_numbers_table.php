<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bet_numbers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bet_id')->constrained('bets')->cascadeOnDelete();
            $table->unsignedTinyInteger('number');
            $table->foreignId('matched_draw_id')->nullable()->constrained('draws')->nullOnDelete();

            $table->unique(['bet_id', 'number']);
            $table->index('matched_draw_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bet_numbers');
    }
};
