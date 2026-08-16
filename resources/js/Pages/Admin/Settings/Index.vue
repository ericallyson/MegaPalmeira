<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps<{
    mercadoPago: {
        baseUrl: string;
        notificationUrl: string | null;
        accessTokenConfigurado: boolean;
        accessTokenDica: string | null;
        webhookSecretConfigurado: boolean;
        webhookSecretDica: string | null;
    };
}>();

const form = useForm({
    mp_base_url: props.mercadoPago.baseUrl,
    mp_notification_url: props.mercadoPago.notificationUrl ?? '',
    mp_access_token: '',
    mp_webhook_secret: '',
});

function salvar() {
    form.put('/admin/configuracoes', {
        preserveScroll: true,
        onSuccess: () => form.reset('mp_access_token', 'mp_webhook_secret'),
    });
}
</script>

<template>
    <Head title="Configurações" />
    <AdminLayout>
        <h1 class="font-display text-28 font-black uppercase tracking-tight">Configurações</h1>
        <p class="mt-1 text-14 text-vidro">
            As credenciais abaixo ficam salvas no banco (cifradas) e substituem as variáveis de ambiente.
        </p>

        <form class="mt-6 max-w-2xl space-y-6" @submit.prevent="salvar">
            <section class="rounded-lg bg-noite p-5">
                <h2 class="font-display text-16 font-black uppercase tracking-tight text-aceso">Mercado Pago</h2>

                <div class="mt-4 space-y-4">
                    <div>
                        <label class="block text-12 uppercase text-vidro" for="mp_base_url">URL base da API</label>
                        <input
                            id="mp_base_url"
                            v-model="form.mp_base_url"
                            type="url"
                            placeholder="https://api.mercadopago.com"
                            class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                        />
                        <p v-if="form.errors.mp_base_url" class="mt-1 text-12 text-erro">{{ form.errors.mp_base_url }}</p>
                    </div>

                    <div>
                        <label class="block text-12 uppercase text-vidro" for="mp_notification_url">
                            URL de notificação (webhook)
                        </label>
                        <input
                            id="mp_notification_url"
                            v-model="form.mp_notification_url"
                            type="url"
                            placeholder="https://megapalmeira.com.br/webhooks/mercadopago"
                            class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                        />
                        <p v-if="form.errors.mp_notification_url" class="mt-1 text-12 text-erro">
                            {{ form.errors.mp_notification_url }}
                        </p>
                    </div>

                    <div>
                        <label class="block text-12 uppercase text-vidro" for="mp_access_token">Access Token</label>
                        <input
                            id="mp_access_token"
                            v-model="form.mp_access_token"
                            type="password"
                            autocomplete="off"
                            :placeholder="mercadoPago.accessTokenConfigurado
                                ? `Configurado (${mercadoPago.accessTokenDica}) — deixe em branco para manter`
                                : 'Ainda não configurado'"
                            class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                        />
                        <p v-if="form.errors.mp_access_token" class="mt-1 text-12 text-erro">
                            {{ form.errors.mp_access_token }}
                        </p>
                    </div>

                    <div>
                        <label class="block text-12 uppercase text-vidro" for="mp_webhook_secret">
                            Assinatura secreta do webhook
                        </label>
                        <input
                            id="mp_webhook_secret"
                            v-model="form.mp_webhook_secret"
                            type="password"
                            autocomplete="off"
                            :placeholder="mercadoPago.webhookSecretConfigurado
                                ? `Configurado (${mercadoPago.webhookSecretDica}) — deixe em branco para manter`
                                : 'Ainda não configurado'"
                            class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                        />
                        <p v-if="form.errors.mp_webhook_secret" class="mt-1 text-12 text-erro">
                            {{ form.errors.mp_webhook_secret }}
                        </p>
                    </div>
                </div>
            </section>

            <div class="flex items-center gap-3">
                <button
                    type="submit"
                    :disabled="form.processing"
                    class="rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-50"
                >
                    Salvar
                </button>
                <span v-if="form.recentlySuccessful" class="text-14 text-jade">Salvo.</span>
            </div>
        </form>
    </AdminLayout>
</template>
