<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('round_id')->constrained('rounds')->cascadeOnDelete();
            $table->foreignId('bet_id')->constrained('bets')->restrictOnDelete();
            $table->enum('category', ['main', 'second']);
            $table->unsignedSmallInteger('position')->default(1);
            $table->unsignedBigInteger('amount_cents');
            $table->dateTime('paid_at')->nullable();
            $table->string('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payouts');
    }
};
