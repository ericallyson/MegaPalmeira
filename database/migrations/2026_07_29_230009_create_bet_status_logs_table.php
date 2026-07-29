<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bet_status_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bet_id')->constrained('bets')->cascadeOnDelete();
            $table->string('from_status')->nullable();
            $table->string('to_status');
            $table->string('reason')->nullable();
            $table->string('actor_type')->nullable();
            $table->unsignedBigInteger('actor_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bet_status_logs');
    }
};
