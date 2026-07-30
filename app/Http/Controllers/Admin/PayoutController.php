<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payout;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PayoutController extends Controller
{
    /**
     * O prêmio é pago fora do sistema; aqui o admin só registra
     * quando e como pagou.
     */
    public function pagar(Request $request, Payout $payout): RedirectResponse
    {
        $validated = $request->validate([
            'observacoes' => ['nullable', 'string', 'max:255'],
        ]);

        $payout->update([
            'paid_at' => now(),
            'notes' => $validated['observacoes'] ?? null,
        ]);

        activity()
            ->causedBy($request->user())
            ->performedOn($payout)
            ->log('premio_pago');

        return back()->with('sucesso', 'Pagamento do prêmio registrado.');
    }
}
