<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Garante o usuário administrador ericallyson@gmail.com.
     * Idempotente: cria se não existir, sem sobrescrever se já existir.
     * O cast 'password' => 'hashed' no model faz o hash automaticamente.
     */
    public function run(): void
    {
        $email = 'ericallyson@gmail.com';

        $user = User::query()->firstOrCreate(
            ['email' => $email],
            [
                'name' => 'Eric Allyson',
                'password' => '123Mudar',
                'is_admin' => true,
            ],
        );

        // Garante privilégio de admin mesmo que o registro já existisse.
        if (! $user->is_admin) {
            $user->update(['is_admin' => true]);
        }

        $mensagem = $user->wasRecentlyCreated
            ? "Admin {$email} criado."
            : "Admin {$email} já existia — privilégio garantido.";

        $this->command?->info($mensagem);
    }
}
