<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bets', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('round_id')->constrained('rounds')->cascadeOnDelete();
            $table->foreignId('bettor_id')->constrained('bettors')->restrictOnDelete();
            $table->json('numbers');
            $table->unsignedBigInteger('amount_cents');
            $table->enum('status', [
                'awaiting_payment', 'paid', 'paid_late', 'expired', 'canceled', 'refunded',
            ])->default('awaiting_payment');
            $table->dateTime('paid_at')->nullable();
            $table->enum('paid_method', ['pix', 'manual'])->nullable();
            $table->unsignedTinyInteger('hits_count')->default(0);
            $table->foreignId('completed_at_draw_id')->nullable()->constrained('draws')->nullOnDelete();
            $table->string('accepted_rules_version');
            $table->string('accepted_ip', 45);
            $table->dateTime('accepted_at');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['round_id', 'status', 'hits_count']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bets');
    }
};
