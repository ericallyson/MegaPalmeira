<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { brl, dataHora } from '@/lib/format';

defineProps<{
    rodada: {
        uuid: string;
        nome: string;
        status: string;
        statusLabel: string;
        poteCents: number;
        premioPrincipalCents: number;
        apostasPagas: number;
        apostasPendentes: number;
        apostasForaDoPrazo: number;
        sorteios: number;
        maxSorteios: number;
        encerramentoApostas: string;
    } | null;
    ultimaEncerrada: string | null;
}>();
</script>

<template>
    <Head title="Painel" />
    <AdminLayout>
        <h1 class="font-display text-28 font-black uppercase tracking-tight">Painel</h1>

        <template v-if="rodada">
            <div class="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div class="rounded-lg bg-noite p-4">
                    <p class="text-12 uppercase text-vidro">Pote atual</p>
                    <p class="mt-1 font-mono text-28 font-tabular text-jade">{{ brl(rodada.poteCents) }}</p>
                </div>
                <div class="rounded-lg bg-noite p-4">
                    <p class="text-12 uppercase text-vidro">Prêmio de 10 pontos</p>
                    <p class="mt-1 font-mono text-28 font-tabular text-aceso">{{ brl(rodada.premioPrincipalCents) }}</p>
                </div>
                <div class="rounded-lg bg-noite p-4">
                    <p class="text-12 uppercase text-vidro">Cartelas pagas</p>
                    <p class="mt-1 font-mono text-28 font-tabular">{{ rodada.apostasPagas }}</p>
                    <p class="text-12 text-vidro">{{ rodada.apostasPendentes }} aguardando pagamento</p>
                </div>
                <div class="rounded-lg bg-noite p-4">
                    <p class="text-12 uppercase text-vidro">Sorteios</p>
                    <p class="mt-1 font-mono text-28 font-tabular">{{ rodada.sorteios }}/{{ rodada.maxSorteios }}</p>
                </div>
            </div>

            <p
                v-if="rodada.apostasForaDoPrazo > 0"
                class="mt-4 rounded border border-brasa/50 bg-brasa/10 px-3 py-2 text-14 text-brasa"
                role="alert"
            >
                {{ rodada.apostasForaDoPrazo }} aposta(s) paga(s) fora do prazo aguardando estorno.
                <Link href="/admin/apostas?status=paid_late" class="underline">Ver fila de estorno</Link>
            </p>

            <div class="mt-6 rounded-lg bg-noite p-4">
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p class="font-display text-16 font-bold uppercase">{{ rodada.nome }}</p>
                        <p class="text-14 text-vidro">
                            {{ rodada.statusLabel }} · apostas até {{ dataHora(rodada.encerramentoApostas) }}
                        </p>
                    </div>
                    <Link
                        :href="`/admin/rodadas/${rodada.uuid}`"
                        class="rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
                    >
                        Gerenciar rodada
                    </Link>
                </div>
            </div>
        </template>

        <div v-else class="mt-6 rounded-lg bg-noite p-6">
            <p class="text-16 text-vidro">
                Nenhuma rodada aberta ou em andamento.
                <span v-if="ultimaEncerrada">A última encerrada foi "{{ ultimaEncerrada }}".</span>
            </p>
            <Link
                href="/admin/rodadas/criar"
                class="mt-4 inline-block rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
            >
                Criar rodada
            </Link>
        </div>
    </AdminLayout>
</template>
