<script setup lang="ts">
import { ref } from 'vue';
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import axios from 'axios';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { brl, dataCurta, dataHora, dezena } from '@/lib/format';

const props = defineProps<{
    rodada: {
        uuid: string;
        nome: string;
        status: string;
        statusLabel: string;
        inicio: string;
        encerramentoApostas: string;
        valorCents: number;
        pctMain: number;
        pctSecond: number;
        pctAdmin: number;
        maxSorteios: number;
        politicaSemVencedor: string;
        rolloverCents: number;
        poteCents: number;
        apostasPagas: number;
        apostasPendentes: number;
        whatsappGroupUrl: string | null;
    };
    sorteios: Array<{
        id: number;
        concurso: number;
        data: string;
        dezenas: number[];
        sequencia: number;
        corrigidoEm: string | null;
        motivoCorrecao: string | null;
    }>;
    ranking: Array<{
        position: number;
        betUuid: string;
        displayName: string;
        maskedPhone: string;
        numbers: Array<{ number: number; matchedDrawId: number | null }>;
        hitsCount: number;
    }>;
    payouts: Array<{
        id: number;
        categoria: string;
        nome: string;
        valorCents: number;
        pagoEm: string | null;
        observacoes: string | null;
    }>;
}>();

const sorteioForm = useForm({
    contest_number: null as number | null,
    drawn_on: '',
    numbers: ['', '', '', '', '', ''] as Array<string | number>,
});

type Previa = {
    cartelasQuePontuam: number;
    cartelasQueChegamADez: number;
    rodadaSeraEncerrada: boolean;
    premioPrincipalCents: number;
    cotaPorGanhadorCents: number;
};

const previa = ref<Previa | null>(null);
const previaErro = ref<string | null>(null);
const motivoCancelamento = ref('');
const mostrandoCancelamento = ref(false);

async function verPrevia() {
    previaErro.value = null;
    try {
        const { data } = await axios.post(`/admin/rodadas/${props.rodada.uuid}/sorteios/previa`, {
            contest_number: sorteioForm.contest_number,
            drawn_on: sorteioForm.drawn_on,
            numbers: sorteioForm.numbers.map(Number),
        });
        previa.value = data;
    } catch (e: unknown) {
        const err = e as { response?: { data?: { message?: string } } };
        previaErro.value = err.response?.data?.message ?? 'Não foi possível calcular a prévia.';
        previa.value = null;
    }
}

function publicar() {
    sorteioForm
        .transform((data) => ({ ...data, numbers: data.numbers.map(Number) }))
        .post(`/admin/rodadas/${props.rodada.uuid}/sorteios`, {
            onSuccess: () => {
                sorteioForm.reset();
                previa.value = null;
            },
        });
}

function abrir() {
    router.post(`/admin/rodadas/${props.rodada.uuid}/abrir`);
}

function encerrar() {
    if (confirm('Encerrar a rodada agora e calcular os prêmios?')) {
        router.post(`/admin/rodadas/${props.rodada.uuid}/encerrar`);
    }
}

function cancelar() {
    router.post(`/admin/rodadas/${props.rodada.uuid}/cancelar`, { motivo: motivoCancelamento.value });
}

const whatsappForm = useForm({
    whatsapp_group_url: props.rodada.whatsappGroupUrl ?? '',
});

function salvarWhatsapp() {
    whatsappForm.put(`/admin/rodadas/${props.rodada.uuid}/whatsapp`, { preserveScroll: true });
}

const obsPagamento = ref<Record<number, string>>({});

function registrarPagamento(payoutId: number) {
    router.post(`/admin/payouts/${payoutId}/pagar`, {
        observacoes: obsPagamento.value[payoutId] ?? '',
    });
}
</script>

<template>
    <Head :title="rodada.nome" />
    <AdminLayout>
        <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
                <h1 class="font-display text-28 font-black uppercase tracking-tight">{{ rodada.nome }}</h1>
                <p class="mt-1 text-14 text-vidro">
                    {{ rodada.statusLabel }} · começa em {{ dataCurta(rodada.inicio + 'T12:00:00') }} · apostas até
                    {{ dataHora(rodada.encerramentoApostas) }}
                </p>
            </div>
            <div class="flex flex-wrap gap-2">
                <Link
                    v-if="rodada.status === 'closed' || rodada.status === 'canceled'"
                    :href="`/admin/rodadas/${rodada.uuid}/relatorio`"
                    class="rounded bg-papel px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
                >
                    Relatório de fechamento
                </Link>
                <button
                    v-if="rodada.status === 'draft'"
                    type="button"
                    class="rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
                    @click="abrir"
                >
                    Abrir apostas
                </button>
                <button
                    v-if="rodada.status === 'running'"
                    type="button"
                    class="rounded border border-vidro/40 px-4 py-2 font-display text-14 font-bold uppercase text-vidro"
                    @click="encerrar"
                >
                    Encerrar rodada
                </button>
                <button
                    v-if="rodada.status !== 'closed' && rodada.status !== 'canceled'"
                    type="button"
                    class="rounded border border-erro/40 px-4 py-2 font-display text-14 font-bold uppercase text-erro"
                    @click="mostrandoCancelamento = !mostrandoCancelamento"
                >
                    Cancelar rodada
                </button>
            </div>
        </div>

        <div v-if="mostrandoCancelamento" class="mt-4 rounded-lg border border-erro/40 bg-noite p-4">
            <label class="block text-14 text-vidro" for="motivo-cancelamento">
                Motivo do cancelamento (fica na auditoria)
            </label>
            <input
                id="motivo-cancelamento"
                v-model="motivoCancelamento"
                type="text"
                class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-16 focus:border-aceso focus:outline-none"
            />
            <button
                type="button"
                class="mt-3 rounded bg-erro px-4 py-2 font-display text-14 font-bold uppercase text-papel"
                @click="cancelar"
            >
                Confirmar cancelamento
            </button>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div class="rounded-lg bg-noite p-4">
                <p class="text-12 uppercase text-vidro">Pote</p>
                <p class="mt-1 font-mono text-20 font-tabular text-jade">{{ brl(rodada.poteCents) }}</p>
                <p v-if="rodada.rolloverCents > 0" class="text-12 text-vidro">
                    inclui {{ brl(rodada.rolloverCents) }} herdados
                </p>
            </div>
            <div class="rounded-lg bg-noite p-4">
                <p class="text-12 uppercase text-vidro">Cartelas</p>
                <p class="mt-1 font-mono text-20 font-tabular">{{ rodada.apostasPagas }} pagas</p>
                <p class="text-12 text-vidro">{{ rodada.apostasPendentes }} pendentes</p>
            </div>
            <div class="rounded-lg bg-noite p-4">
                <p class="text-12 uppercase text-vidro">Divisão</p>
                <p class="mt-1 font-mono text-16 font-tabular">
                    {{ rodada.pctMain }}/{{ rodada.pctSecond }}/{{ rodada.pctAdmin }}
                </p>
                <p class="text-12 text-vidro">
                    {{ rodada.maxSorteios === 0 ? 'Sorteios até alguém ganhar' : `Até ${rodada.maxSorteios} sorteios · ${rodada.politicaSemVencedor}` }}
                </p>
            </div>
            <div class="rounded-lg bg-noite p-4">
                <p class="text-12 uppercase text-vidro">Valor da cartela</p>
                <p class="mt-1 font-mono text-20 font-tabular">{{ brl(rodada.valorCents) }}</p>
            </div>
        </div>

        <div class="mt-6 rounded-lg bg-noite p-4">
            <h2 class="font-display text-16 font-bold uppercase">Grupo do WhatsApp</h2>
            <form class="mt-2 flex flex-wrap items-end gap-2" @submit.prevent="salvarWhatsapp">
                <div class="min-w-64 flex-1">
                    <label class="block text-12 uppercase text-vidro" for="whatsapp_group_url">
                        Link do grupo (aparece na página de acompanhamento)
                    </label>
                    <input
                        id="whatsapp_group_url"
                        v-model="whatsappForm.whatsapp_group_url"
                        type="url"
                        placeholder="https://chat.whatsapp.com/..."
                        class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-16 focus:border-aceso focus:outline-none"
                    />
                    <p v-if="whatsappForm.errors.whatsapp_group_url" class="mt-1 text-12 text-erro">
                        {{ whatsappForm.errors.whatsapp_group_url }}
                    </p>
                </div>
                <button
                    type="submit"
                    :disabled="whatsappForm.processing"
                    class="rounded bg-jade px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-50"
                >
                    Salvar link
                </button>
            </form>
        </div>

        <div v-if="payouts.length" class="mt-6 rounded-lg bg-noite p-4">
            <h2 class="font-display text-16 font-bold uppercase text-jade">Prêmios</h2>
            <table class="mt-2 w-full text-left text-14">
                <tbody>
                    <tr v-for="p in payouts" :key="p.id" class="border-b border-vidro/10 last:border-0 align-top">
                        <td class="py-2">{{ p.categoria }}</td>
                        <td class="py-2">{{ p.nome }}</td>
                        <td class="py-2 font-mono font-tabular text-jade">{{ brl(p.valorCents) }}</td>
                        <td class="py-2">
                            <span v-if="p.pagoEm" class="text-jade">
                                Pago em {{ dataHora(p.pagoEm) }}
                                <span v-if="p.observacoes" class="text-vidro"> · {{ p.observacoes }}</span>
                            </span>
                            <div v-else class="flex flex-wrap items-center gap-2">
                                <input
                                    v-model="obsPagamento[p.id]"
                                    type="text"
                                    placeholder="Observação (ex.: PIX 30/07)"
                                    :aria-label="`Observação do pagamento de ${p.nome}`"
                                    class="rounded border border-vidro/30 bg-tinta px-2 py-1 text-12 focus:border-aceso focus:outline-none"
                                />
                                <button
                                    type="button"
                                    class="rounded bg-jade px-3 py-1 font-display text-12 font-bold uppercase text-tinta"
                                    @click="registrarPagamento(p.id)"
                                >
                                    Registrar pagamento
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <section v-if="rodada.status === 'running'" class="mt-8 rounded-lg bg-noite p-4">
            <h2 class="font-display text-16 font-bold uppercase">Lançar sorteio</h2>
            <div class="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                    <label class="block text-14 text-vidro" for="concurso">Número do concurso</label>
                    <input
                        id="concurso"
                        v-model.number="sorteioForm.contest_number"
                        type="number"
                        min="1"
                        class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"
                    />
                    <p v-if="sorteioForm.errors.contest_number" class="mt-1 text-12 text-erro">
                        {{ sorteioForm.errors.contest_number }}
                    </p>
                </div>
                <div>
                    <label class="block text-14 text-vidro" for="drawn_on">Data do sorteio</label>
                    <input
                        id="drawn_on"
                        v-model="sorteioForm.drawn_on"
                        type="date"
                        class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-16 focus:border-aceso focus:outline-none"
                    />
                    <p v-if="sorteioForm.errors.drawn_on" class="mt-1 text-12 text-erro">
                        {{ sorteioForm.errors.drawn_on }}
                    </p>
                </div>
            </div>
            <div class="mt-4">
                <p class="text-14 text-vidro">As 6 dezenas</p>
                <div class="mt-1 flex flex-wrap gap-2">
                    <input
                        v-for="i in 6"
                        :key="i"
                        v-model="sorteioForm.numbers[i - 1]"
                        type="number"
                        min="1"
                        max="60"
                        :aria-label="`Dezena ${i}`"
                        class="w-16 rounded border border-vidro/30 bg-tinta px-2 py-2 text-center font-mono text-16 font-tabular focus:border-aceso focus:outline-none"
                    />
                </div>
                <p v-if="sorteioForm.errors.numbers" class="mt-1 text-12 text-erro">{{ sorteioForm.errors.numbers }}</p>
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    class="rounded border border-aceso px-4 py-2 font-display text-14 font-bold uppercase text-aceso"
                    @click="verPrevia"
                >
                    Ver prévia
                </button>
                <button
                    type="button"
                    :disabled="!previa || sorteioForm.processing"
                    class="rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-50"
                    @click="publicar"
                >
                    Publicar sorteio
                </button>
                <p v-if="!previa" class="text-12 text-vidro">A prévia é obrigatória antes de publicar.</p>
            </div>

            <p v-if="previaErro" class="mt-3 rounded border border-erro/40 bg-erro/10 px-3 py-2 text-14 text-erro">
                {{ previaErro }}
            </p>
            <div v-if="previa" class="mt-3 rounded border border-aceso/40 bg-tinta px-4 py-3 text-14" role="status">
                <p>
                    <strong class="font-mono font-tabular">{{ previa.cartelasQuePontuam }}</strong> cartelas pontuam ·
                    <strong class="font-mono font-tabular">{{ previa.cartelasQueChegamADez }}</strong> chegam a 10 pontos
                    <template v-if="previa.rodadaSeraEncerrada">
                        · a rodada será <strong class="text-aceso">ENCERRADA</strong>
                    </template>
                </p>
                <p v-if="previa.cartelasQueChegamADez > 0" class="mt-1 text-jade">
                    Prêmio de {{ brl(previa.premioPrincipalCents) }} dividido entre
                    {{ previa.cartelasQueChegamADez }} — {{ brl(previa.cotaPorGanhadorCents) }} cada.
                </p>
            </div>
        </section>

        <section class="mt-8">
            <h2 class="font-display text-16 font-bold uppercase">Sorteios publicados</h2>
            <div v-if="sorteios.length === 0" class="mt-2 rounded-lg bg-noite p-4 text-14 text-vidro">
                Nenhum sorteio publicado ainda.
            </div>
            <div v-for="s in sorteios" :key="s.id" class="mt-2 rounded-lg bg-noite p-4">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <p class="text-14">
                        <span class="font-display font-bold">Concurso {{ s.concurso }}</span>
                        <span class="text-vidro"> · {{ dataCurta(s.data + 'T12:00:00') }} · {{ s.sequencia }}º da rodada</span>
                    </p>
                    <div class="flex gap-1">
                        <span
                            v-for="n in s.dezenas"
                            :key="n"
                            class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-aceso font-mono text-14 font-bold font-tabular text-tinta"
                        >
                            {{ dezena(n) }}
                        </span>
                    </div>
                </div>
                <p v-if="s.corrigidoEm" class="mt-2 text-12 text-brasa">
                    Corrigido em {{ dataHora(s.corrigidoEm) }}: {{ s.motivoCorrecao }}
                </p>
            </div>
        </section>

        <section class="mt-8">
            <h2 class="font-display text-16 font-bold uppercase">Classificação</h2>
            <div v-if="ranking.length === 0" class="mt-2 rounded-lg bg-noite p-4 text-14 text-vidro">
                Nenhuma cartela paga ainda.
            </div>
            <ol v-else class="mt-2 space-y-1">
                <li
                    v-for="item in ranking"
                    :key="item.betUuid"
                    class="flex flex-wrap items-center gap-3 rounded bg-noite px-3 py-2 text-14"
                >
                    <span class="w-8 font-mono font-tabular text-vidro">{{ item.position }}º</span>
                    <span class="min-w-32">{{ item.displayName }}</span>
                    <span class="font-mono text-12 font-tabular text-vidro">{{ item.maskedPhone }}</span>
                    <span class="flex flex-wrap gap-1">
                        <span
                            v-for="n in item.numbers"
                            :key="n.number"
                            class="inline-flex h-6 w-6 items-center justify-center rounded-full font-mono text-12 font-tabular"
                            :class="n.matchedDrawId ? 'bg-aceso font-bold text-tinta' : 'border border-vidro/30 text-vidro'"
                        >
                            {{ dezena(n.number) }}
                        </span>
                    </span>
                    <span class="ml-auto font-mono font-tabular" :class="item.hitsCount >= 9 ? 'text-aceso' : ''">
                        {{ item.hitsCount }} pts
                    </span>
                </li>
            </ol>
        </section>
    </AdminLayout>
</template>
