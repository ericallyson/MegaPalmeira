<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rounds', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name');
            $table->string('slug')->unique();
            $table->date('starts_on');
            $table->dateTime('bets_close_at');
            $table->unsignedBigInteger('bet_amount_cents');
            $table->unsignedTinyInteger('pct_main')->default(70);
            $table->unsignedTinyInteger('pct_second')->default(15);
            $table->unsignedTinyInteger('pct_admin')->default(15);
            $table->unsignedSmallInteger('max_draws')->default(15);
            $table->unsignedSmallInteger('max_bets_per_person')->default(5);
            $table->unsignedSmallInteger('min_paid_bets')->default(10);
            $table->enum('no_winner_policy', ['highest_score', 'rollover'])->default('highest_score');
            $table->unsignedBigInteger('rollover_in_cents')->default(0);
            $table->enum('status', ['draft', 'open', 'running', 'closed', 'canceled'])->default('draft');
            $table->string('rules_version')->default('1.0');
            $table->dateTime('closed_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rounds');
    }
};
