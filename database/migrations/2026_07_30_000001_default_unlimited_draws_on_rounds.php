<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * max_draws = 0 passa a significar "sem limite: joga até alguém
     * fechar 10 pontos", e vira o default das novas rodadas.
     */
    public function up(): void
    {
        Schema::table('rounds', function (Blueprint $table) {
            $table->unsignedSmallInteger('max_draws')->default(0)->change();
        });
    }

    public function down(): void
    {
        Schema::table('rounds', function (Blueprint $table) {
            $table->unsignedSmallInteger('max_draws')->default(15)->change();
        });
    }
};
