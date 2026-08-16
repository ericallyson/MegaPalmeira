<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminPasswordSeeder extends Seeder
{
    /**
     * Redefine a senha do administrador ericallyson@gmail.com.
     * O cast 'password' => 'hashed' no model faz o hash automaticamente.
     */
    public function run(): void
    {
        $email = 'ericallyson@gmail.com';

        $user = User::query()->where('email', $email)->first();

        if (! $user) {
            $this->command?->warn("Usuário {$email} não encontrado — nada foi alterado.");

            return;
        }

        $user->update(['password' => '123Mudar']);

        $this->command?->info("Senha de {$email} redefinida com sucesso.");
    }
}
