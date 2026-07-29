<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTwoFactorIsEnabled
{
    /**
     * A conta do admin movimenta dinheiro: sem 2FA confirmado,
     * nenhuma rota administrativa é liberada.
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var User|null $user */
        $user = $request->user();

        if ($user !== null && $user->two_factor_confirmed_at === null) {
            return redirect()->route('admin.2fa');
        }

        return $next($request);
    }
}
