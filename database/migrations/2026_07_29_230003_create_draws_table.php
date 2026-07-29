<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('draws', function (Blueprint $table) {
            $table->id();
            $table->foreignId('round_id')->constrained('rounds')->cascadeOnDelete();
            $table->unsignedInteger('contest_number');
            $table->date('drawn_on');
            $table->json('numbers');
            $table->unsignedSmallInteger('sequence');
            $table->dateTime('published_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('corrected_at')->nullable();
            $table->string('correction_reason')->nullable();
            $table->timestamps();

            $table->unique(['round_id', 'contest_number']);
            $table->unique(['round_id', 'sequence']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('draws');
    }
};
