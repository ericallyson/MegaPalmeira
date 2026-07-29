<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('bet_id')->constrained('bets')->cascadeOnDelete();
            $table->enum('provider', ['mercado_pago'])->default('mercado_pago');
            $table->string('provider_payment_id')->nullable()->index();
            $table->unsignedBigInteger('amount_cents');
            $table->string('status')->default('pending');
            $table->text('qr_code')->nullable();
            $table->longText('qr_code_base64')->nullable();
            $table->string('ticket_url')->nullable();
            $table->dateTime('expires_at')->nullable();
            $table->dateTime('paid_at')->nullable();
            $table->json('payload')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
