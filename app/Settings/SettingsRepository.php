<?php

namespace App\Settings;

use App\Models\Setting;

/**
 * Fonte única das configurações persistidas no banco. Cada chave tem
 * fallback para config()/.env, então o sistema segue funcionando com a
 * configuração antiga até que o admin salve pela tela de Configurações.
 *
 * Registrado como singleton: os valores são lidos uma vez por request.
 */
class SettingsRepository
{
    /** @var array<string, string|null>|null */
    private ?array $cache = null;

    /**
     * @return array<string, string|null>
     */
    private function all(): array
    {
        if ($this->cache === null) {
            // Eloquent get()->pluck() aplica o cast 'encrypted' (decifra),
            // ao contrário do pluck() do query builder.
            $this->cache = Setting::query()->get()->pluck('value', 'key')->all();
        }

        return $this->cache;
    }

    public function get(string $key, ?string $default = null): ?string
    {
        $value = $this->all()[$key] ?? null;

        return ($value === null || $value === '') ? $default : $value;
    }

    /**
     * Persiste um conjunto de chaves. Valores null são ignorados (mantém
     * o atual) — útil para não sobrescrever segredos deixados em branco.
     *
     * @param  array<string, string|null>  $values
     */
    public function set(array $values): void
    {
        foreach ($values as $key => $value) {
            if ($value === null) {
                continue;
            }

            Setting::query()->updateOrCreate(['key' => $key], ['value' => $value]);
        }

        $this->cache = null;
    }

    /**
     * Credenciais do Mercado Pago, com fallback para config('services').
     *
     * @return array{base_url: string, access_token: string, webhook_secret: string, notification_url: ?string}
     */
    public function mercadoPago(): array
    {
        return [
            'base_url' => (string) $this->get('mp_base_url', (string) config('services.mercado_pago.base_url')),
            'access_token' => (string) $this->get('mp_access_token', (string) config('services.mercado_pago.access_token')),
            'webhook_secret' => (string) $this->get('mp_webhook_secret', (string) config('services.mercado_pago.webhook_secret')),
            'notification_url' => $this->get('mp_notification_url', config('services.mercado_pago.notification_url')),
        ];
    }
}
