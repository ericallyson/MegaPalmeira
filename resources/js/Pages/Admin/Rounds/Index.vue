<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { brl, dataCurta } from '@/lib/format';

defineProps<{
    rodadas: Array<{
        uuid: string;
        nome: string;
        status: string;
        statusLabel: string;
        inicio: string;
        valorCents: number;
        apostasPagas: number;
        sorteios: number;
    }>;
}>();
</script>

<template>
    <Head title="Rodadas" />
    <AdminLayout>
        <div class="flex items-center justify-between">
            <h1 class="font-display text-28 font-black uppercase tracking-tight">Rodadas</h1>
            <Link
                href="/admin/rodadas/criar"
                class="rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
            >
                Criar rodada
            </Link>
        </div>

        <div class="mt-6 overflow-x-auto rounded-lg bg-noite">
            <table class="w-full text-left text-14">
                <thead>
                    <tr class="border-b border-vidro/20 text-12 uppercase text-vidro">
                        <th class="px-4 py-3">Rodada</th>
                        <th class="px-4 py-3">Status</th>
                        <th class="px-4 py-3">Início</th>
                        <th class="px-4 py-3">Valor</th>
                        <th class="px-4 py-3">Pagas</th>
                        <th class="px-4 py-3">Sorteios</th>
                        <th class="px-4 py-3">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="r in rodadas" :key="r.uuid" class="border-b border-vidro/10 hover:bg-tinta/40">
                        <td class="px-4 py-3">
                            <Link :href="`/admin/rodadas/${r.uuid}`" class="text-aceso underline">{{ r.nome }}</Link>
                        </td>
                        <td class="px-4 py-3">{{ r.statusLabel }}</td>
                        <td class="px-4 py-3 font-mono font-tabular">{{ dataCurta(r.inicio + 'T12:00:00') }}</td>
                        <td class="px-4 py-3 font-mono font-tabular">{{ brl(r.valorCents) }}</td>
                        <td class="px-4 py-3 font-mono font-tabular">{{ r.apostasPagas }}</td>
                        <td class="px-4 py-3 font-mono font-tabular">{{ r.sorteios }}</td>
                        <td class="px-4 py-3">
                            <Link
                                :href="`/admin/apostas?rodada=${r.uuid}`"
                                class="inline-flex items-center gap-1.5 text-aceso hover:underline"
                                :title="`Ver apostas da ${r.nome}`"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="h-4 w-4"
                                    aria-hidden="true"
                                >
                                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                                    <path d="M13 5v2" />
                                    <path d="M13 17v2" />
                                    <path d="M13 11v2" />
                                </svg>
                                Apostas
                            </Link>
                        </td>
                    </tr>
                    <tr v-if="rodadas.length === 0">
                        <td colspan="7" class="px-4 py-6 text-vidro">Nenhuma rodada ainda. Crie a primeira.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </AdminLayout>
</template>
