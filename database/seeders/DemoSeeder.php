<?php

namespace Database\Seeders;

use App\Domain\Bolao\Actions\PublicarSorteio;
use App\Domain\Bolao\Data\SorteioData;
use App\Domain\Bolao\Enums\RoundStatus;
use App\Models\Bet;
use App\Models\Round;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    /**
     * Uma rodada em andamento com 40 cartelas e 3 sorteios apurados,
     * para dar o que ver no admin e na home.
     */
    public function run(): void
    {
        $admin = User::query()->firstOrCreate(
            ['email' => (string) config('bolao.admin_email', env('BOLAO_ADMIN_EMAIL', 'admin@example.com'))],
            [
                'name' => 'Administrador',
                'password' => 'password',
                'is_admin' => true,
            ],
        );

        $round = Round::factory()->emAndamento()->create([
            'name' => 'Bolão de Demonstração',
            'slug' => 'bolao-de-demonstracao',
            'created_by' => $admin->id,
        ]);

        Bet::factory()->count(34)->paga()->for($round)->create();
        Bet::factory()->count(4)->for($round)->create();
        Bet::factory()->count(2)->for($round)->create([
            'status' => 'paid_late',
            'paid_at' => $round->bets_close_at->copy()->addMinutes(20),
        ]);

        $publicar = app(PublicarSorteio::class);
        $contest = 2860;

        foreach ([0, 3, 7] as $offset) {
            $numbers = collect(range(1, 60))->shuffle()->take(6)->sort()->values()->all();

            $publicar->handle($round, new SorteioData(
                contestNumber: $contest++,
                drawnOn: CarbonImmutable::now()->subDays(10 - $offset),
                numbers: $numbers,
            ), $admin);

            if ($round->refresh()->status !== RoundStatus::Running) {
                break;
            }
        }
    }
}
