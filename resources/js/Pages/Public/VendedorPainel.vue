<script setup lang="ts">
import { ref } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import { brl, dataHora, dezena } from '@/lib/format';

const props = defineProps<{
    vendedor: {
        nome: string;
        slug: string;
        comissaoPct: number;
        link: string;
        grupoUrl: string | null;
    };
    rodadas: Array<{ uuid: string; nome: string }>;
    rodadaAtual: string | null;
    resumo: {
        apostas: number;
        pagas: number;
        arrecadacaoPagasCents: number;
        comissaoCents: number;
    };
    apostas: Array<{
        uuid: string;
        nome: string;
        telefone: string;
        dezenas: number[];
        valorCents: number;
        status: string;
        statusLabel: string;
        metodo: string | null;
        pontos: number;
        pagaEm: string | null;
        podeDarBaixa: boolean;
    }>;
}>();

const rodada = ref(props.rodadaAtual ?? '');
const motivos = ref<Record<string, string>>({});
const abertaParaBaixa = ref<string | null>(null);
const copiado = ref(false);

function trocarRodada() {
    router.get('/vendedor/painel', { rodada: rodada.value || undefined }, { preserveState: true, replace: true });
}

function copiarLink() {
    navigator.clipboard?.writeText(props.vendedor.link).then(() => {
        copiado.value = true;
        setTimeout(() => (copiado.value = false), 1500);
    });
}

function darBaixa(uuid: string) {
    router.post(
        `/vendedor/apostas/${uuid}/baixa`,
        { motivo: motivos.value[uuid] ?? '' },
        { preserveScroll: true, onSuccess: () => (abertaParaBaixa.value = null) },
    );
}

function sair() {
    router.post('/vendedor/sair');
}
</script>

<template>
    <Head title="Área do vendedor" />
    <div class="min-h-screen bg-tinta text-papel">
        <header class="bg-papel text-tinta">
            <div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
                <Link href="/">
                    <img src="/logoMega.png" alt="MegaPalmeira" class="h-12 w-auto" />
                </Link>
                <button type="button" class="text-14 text-noite/70 hover:text-tinta" @click="sair">Sair</button>
            </div>
        </header>

        <main class="mx-auto max-w-4xl px-4 pb-16">
            <h1 class="mt-6 font-display text-28 font-black uppercase tracking-tight">Olá, {{ vendedor.nome }}</h1>
            <p class="mt-1 text-14 text-vidro">
                Seu link:
                <span class="font-mono text-12 font-tabular text-aceso">{{ vendedor.link }}</span>
                <button type="button" class="ml-2 text-aceso underline" @click="copiarLink">
                    {{ copiado ? 'Copiado!' : 'Copiar' }}
                </button>
            </p>

            <div v-if="rodadas.length === 0" class="mt-8 rounded-lg bg-noite p-6">
                <p class="text-16 text-vidro">Ainda não há apostas feitas pelo seu link.</p>
            </div>

            <template v-else>
                <div class="mt-6">
                    <label class="block text-12 uppercase text-vidro" for="rodada">Rodada</label>
                    <select
                        id="rodada"
                        v-model="rodada"
                        class="mt-1 rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                        @change="trocarRodada"
                    >
                        <option v-for="r in rodadas" :key="r.uuid" :value="r.uuid">{{ r.nome }}</option>
                    </select>
                </div>

                <section class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Resumo da rodada">
                    <div class="rounded-lg bg-noite p-4">
                        <p class="text-12 uppercase text-vidro">Apostas</p>
                        <p class="mt-1 font-mono text-20 font-tabular">{{ resumo.apostas }}</p>
                    </div>
                    <div class="rounded-lg bg-noite p-4">
                        <p class="text-12 uppercase text-vidro">Pagas</p>
                        <p class="mt-1 font-mono text-20 font-tabular text-jade">{{ resumo.pagas }}</p>
                    </div>
                    <div class="rounded-lg bg-noite p-4">
                        <p class="text-12 uppercase text-vidro">Arrecadação (pagas)</p>
                        <p class="mt-1 font-mono text-20 font-tabular">{{ brl(resumo.arrecadacaoPagasCents) }}</p>
                    </div>
                    <div class="rounded-lg bg-noite p-4">
                        <p class="text-12 uppercase text-vidro">Sua comissão ({{ vendedor.comissaoPct }}%)</p>
                        <p class="mt-1 font-mono text-20 font-tabular text-aceso">{{ brl(resumo.comissaoCents) }}</p>
                    </div>
                </section>

                <div class="mt-4 overflow-x-auto rounded-lg bg-noite">
                    <table class="w-full text-left text-14">
                        <thead>
                            <tr class="border-b border-vidro/20 text-12 uppercase text-vidro">
                                <th class="px-3 py-2">Apostador</th>
                                <th class="px-3 py-2">Dezenas</th>
                                <th class="px-3 py-2">Valor</th>
                                <th class="px-3 py-2">Status</th>
                                <th class="px-3 py-2">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="a in apostas" :key="a.uuid">
                                <tr class="border-b border-vidro/10">
                                    <td class="px-3 py-2">
                                        <p>{{ a.nome }}</p>
                                        <p class="font-mono text-12 font-tabular text-vidro">{{ a.telefone }}</p>
                                    </td>
                                    <td class="px-3 py-2 font-mono text-12 font-tabular">
                                        {{ a.dezenas.map(dezena).join(' ') }}
                                    </td>
                                    <td class="px-3 py-2 font-mono font-tabular">{{ brl(a.valorCents) }}</td>
                                    <td class="px-3 py-2">
                                        <span :class="a.status === 'paid' ? 'text-jade' : a.status === 'paid_late' ? 'text-brasa' : 'text-vidro'">
                                            {{ a.statusLabel }}
                                        </span>
                                        <p v-if="a.metodo" class="text-12 text-vidro">{{ a.metodo }}</p>
                                        <p v-if="a.pagaEm" class="text-12 text-vidro">{{ dataHora(a.pagaEm) }}</p>
                                    </td>
                                    <td class="px-3 py-2">
                                        <button
                                            v-if="a.podeDarBaixa"
                                            type="button"
                                            class="text-14 text-aceso underline"
                                            @click="abertaParaBaixa = abertaParaBaixa === a.uuid ? null : a.uuid"
                                        >
                                            Dar baixa
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="abertaParaBaixa === a.uuid" class="border-b border-vidro/10 bg-tinta/40">
                                    <td colspan="5" class="px-3 py-3">
                                        <label class="block text-12 uppercase text-vidro" :for="`motivo-${a.uuid}`">
                                            Motivo da baixa manual (obrigatório)
                                        </label>
                                        <div class="mt-1 flex gap-2">
                                            <input
                                                :id="`motivo-${a.uuid}`"
                                                v-model="motivos[a.uuid]"
                                                type="text"
                                                placeholder="Ex.: pagou em dinheiro comigo"
                                                class="w-full max-w-md rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                class="rounded bg-jade px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
                                                @click="darBaixa(a.uuid)"
                                            >
                                                Confirmar baixa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <tr v-if="apostas.length === 0">
                                <td colspan="5" class="px-3 py-6 text-vidro">Nenhuma aposta nesta rodada.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p class="mt-4 text-12 text-vidro">
                    A comissão é calculada apenas sobre as apostas efetivamente pagas.
                    Baixas manuais que você registrar aparecem na prestação de contas da rodada.
                </p>
            </template>
        </main>
    </div>
</template>
