<script setup lang="ts">
import { computed } from 'vue';
import { Head, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const form = useForm({
    name: '',
    starts_on: '',
    bets_close_at: '',
    bet_amount_cents: 2000,
    pct_main: 70,
    pct_second: 15,
    pct_admin: 15,
    max_draws: 0,
    max_bets_per_person: 5,
    min_paid_bets: 10,
    no_winner_policy: 'highest_score',
    rollover_in_cents: 0,
    whatsapp_group_url: '',
});

const somaPercentuais = computed(
    () => Number(form.pct_main) + Number(form.pct_second) + Number(form.pct_admin),
);

function salvar() {
    form.post('/admin/rodadas');
}
</script>

<template>
    <Head title="Criar rodada" />
    <AdminLayout>
        <h1 class="font-display text-28 font-black uppercase tracking-tight">Criar rodada</h1>

        <form class="mt-6 max-w-2xl space-y-4" @submit.prevent="salvar">
            <div>
                <label class="block text-14 text-vidro" for="name">Nome</label>
                <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="Bolão de Agosto"
                    class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-16 focus:border-aceso focus:outline-none"
                />
                <p v-if="form.errors.name" class="mt-1 text-12 text-erro">{{ form.errors.name }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-14 text-vidro" for="starts_on">Data do primeiro sorteio</label>
                    <input
                        id="starts_on"
                        v-model="form.starts_on"
                        type="date"
                        required
                        class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-16 focus:border-aceso focus:outline-none"
                    />
                    <p v-if="form.errors.starts_on" class="mt-1 text-12 text-erro">{{ form.errors.starts_on }}</p>
                </div>
                <div>
                    <label class="block text-14 text-vidro" for="bets_close_at">Apostas até (opcional)</label>
                    <input
                        id="bets_close_at"
                        v-model="form.bets_close_at"
                        type="datetime-local"
                        class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-16 focus:border-aceso focus:outline-none"
                    />
                    <p class="mt-1 text-12 text-vidro">Vazio = 23:59:59 do dia anterior ao início</p>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-14 text-vidro" for="bet_amount_cents">Valor da aposta (centavos)</label>
                    <input
                        id="bet_amount_cents"
                        v-model.number="form.bet_amount_cents"
                        type="number"
                        min="100"
                        step="1"
                        required
                        class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"
                    />
                    <p class="mt-1 text-12 text-vidro">2000 = R$ 20,00</p>
                    <p v-if="form.errors.bet_amount_cents" class="mt-1 text-12 text-erro">{{ form.errors.bet_amount_cents }}</p>
                </div>
                <div>
                    <label class="block text-14 text-vidro" for="rollover_in_cents">Valor herdado (centavos)</label>
                    <input
                        id="rollover_in_cents"
                        v-model.number="form.rollover_in_cents"
                        type="number"
                        min="0"
                        step="1"
                        class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"
                    />
                </div>
            </div>

            <fieldset class="rounded border border-vidro/20 p-4">
                <legend class="px-1 text-14 text-vidro">Divisão do pote (%)</legend>
                <div class="grid grid-cols-3 gap-4">
                    <div>
                        <label class="block text-14 text-vidro" for="pct_main">10 pontos</label>
                        <input
                            id="pct_main"
                            v-model.number="form.pct_main"
                            type="number"
                            min="0"
                            max="100"
                            class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"
                        />
                    </div>
                    <div>
                        <label class="block text-14 text-vidro" for="pct_second">2º lugar</label>
                        <input
                            id="pct_second"
                            v-model.number="form.pct_second"
                            type="number"
                            min="0"
                            max="100"
                            class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"
                        />
                    </div>
                    <div>
                        <label class="block text-14 text-vidro" for="pct_admin">Administração</label>
                        <input
                            id="pct_admin"
                            v-model.number="form.pct_admin"
                            type="number"
                            min="0"
                            max="100"
                            class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"
                        />
                    </div>
                </div>
                <p class="mt-2 text-14" :class="somaPercentuais === 100 ? 'text-jade' : 'text-erro'">
                    Soma: {{ somaPercentuais }}%{{ somaPercentuais === 100 ? '' : ' — ajuste para 100%' }}
                </p>
                <p v-if="form.errors.pct_main" class="mt-1 text-12 text-erro">{{ form.errors.pct_main }}</p>
            </fieldset>

            <div class="grid grid-cols-3 gap-4">
                <div>
                    <label class="block text-14 text-vidro" for="max_draws">Limite de sorteios</label>
                    <input
                        id="max_draws"
                        v-model.number="form.max_draws"
                        type="number"
                        min="0"
                        max="99"
                        class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"
                    />
                    <p class="mt-1 text-12 text-vidro">0 = sem limite: joga até alguém ganhar</p>
                </div>
                <div>
                    <label class="block text-14 text-vidro" for="max_bets_per_person">Cartelas por pessoa</label>
                    <input
                        id="max_bets_per_person"
                        v-model.number="form.max_bets_per_person"
                        type="number"
                        min="0"
                        class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"
                    />
                </div>
                <div>
                    <label class="block text-14 text-vidro" for="min_paid_bets">Mínimo de pagas</label>
                    <input
                        id="min_paid_bets"
                        v-model.number="form.min_paid_bets"
                        type="number"
                        min="0"
                        class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"
                    />
                </div>
            </div>

            <div>
                <label class="block text-14 text-vidro" for="whatsapp_group_url">Link do grupo do WhatsApp (opcional)</label>
                <input
                    id="whatsapp_group_url"
                    v-model="form.whatsapp_group_url"
                    type="url"
                    placeholder="https://chat.whatsapp.com/..."
                    class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-16 focus:border-aceso focus:outline-none"
                />
                <p class="mt-1 text-12 text-vidro">Aparece como botão na página de acompanhamento.</p>
                <p v-if="form.errors.whatsapp_group_url" class="mt-1 text-12 text-erro">{{ form.errors.whatsapp_group_url }}</p>
            </div>

            <div v-if="form.max_draws > 0">
                <label class="block text-14 text-vidro" for="no_winner_policy">Se ninguém fechar 10 pontos até o limite</label>
                <select
                    id="no_winner_policy"
                    v-model="form.no_winner_policy"
                    class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-16 focus:border-aceso focus:outline-none"
                >
                    <option value="highest_score">Paga a maior pontuação</option>
                    <option value="rollover">Acumula para a próxima rodada</option>
                </select>
            </div>

            <button
                type="submit"
                :disabled="form.processing"
                class="rounded bg-aceso px-6 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-60"
            >
                Criar rodada
            </button>
        </form>
    </AdminLayout>
</template>
