<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingsRequest;
use App\Settings\SettingsRepository;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function edit(SettingsRepository $settings): Response
    {
        $mp = $settings->mercadoPago();

        return Inertia::render('Admin/Settings/Index', [
            'mercadoPago' => [
                'baseUrl' => $mp['base_url'],
                'notificationUrl' => $mp['notification_url'],
                // Segredos nunca voltam ao cliente: só informamos se já
                // existem e uma dica (últimos 4 caracteres).
                'accessTokenConfigurado' => $mp['access_token'] !== '',
                'accessTokenDica' => $this->dica($mp['access_token']),
                'webhookSecretConfigurado' => $mp['webhook_secret'] !== '',
                'webhookSecretDica' => $this->dica($mp['webhook_secret']),
            ],
        ]);
    }

    public function update(UpdateSettingsRequest $request, SettingsRepository $settings): RedirectResponse
    {
        $settings->set([
            'mp_base_url' => $request->string('mp_base_url')->toString(),
            'mp_notification_url' => $request->filled('mp_notification_url')
                ? $request->string('mp_notification_url')->toString()
                : '',
            // Só grava o segredo se veio preenchido (null = mantém atual).
            'mp_access_token' => $request->filled('mp_access_token')
                ? $request->string('mp_access_token')->toString()
                : null,
            'mp_webhook_secret' => $request->filled('mp_webhook_secret')
                ? $request->string('mp_webhook_secret')->toString()
                : null,
        ]);

        return redirect()
            ->route('admin.configuracoes.edit')
            ->with('sucesso', 'Configurações salvas.');
    }

    private function dica(string $secret): ?string
    {
        return strlen($secret) >= 4 ? '••••'.substr($secret, -4) : null;
    }
}
