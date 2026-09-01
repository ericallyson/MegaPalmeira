<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { brl } from '@/lib/format';

defineProps<{
    vendedor: { uuid: string; nome: string };
    rodadas: Array<{
        uuid: string;
        nome: string;
        status: string;
        statusLabel: string;
        apostas: number;
        apostasPagas: number;
        valorPagoCents: number;
    }>;
}>();
</script>

<template>
    <Head :title="`Rodadas de ${vendedor.nome}`" />
    <AdminLayout>
        <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
                <h1 class="font-display text-28 font-black uppercase tracking-tight">
                    Rodadas de {{ vendedor.nome }}
                </h1>
                <p class="text-14 text-vidro">Apenas rodadas em que o vendedor tem apostas.</p>
            </div>
            <Link href="/admin/vendedores" class="text-14 text-aceso underline">Voltar aos vendedores</Link>
        </div>

        <div class="mt-4 overflow-x-auto rounded-lg bg-noite">
            <table class="w-full text-left text-14">
                <thead>
                    <tr class="border-b border-vidro/20 text-12 uppercase text-vidro">
                        <th class="px-3 py-2">Rodada</th>
                        <th class="px-3 py-2">Status</th>
                        <th class="px-3 py-2">Apostas do vendedor</th>
                        <th class="px-3 py-2">Valor pago</th>
                        <th class="px-3 py-2">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="r in rodadas" :key="r.uuid" class="border-b border-vidro/10">
                        <td class="px-3 py-2">{{ r.nome }}</td>
                        <td class="px-3 py-2 text-vidro">{{ r.statusLabel }}</td>
                        <td class="px-3 py-2 font-mono text-12 font-tabular">
                            {{ r.apostasPagas }} pagas
                            <span class="text-vidro">/ {{ r.apostas }} total</span>
                        </td>
                        <td class="px-3 py-2 font-mono font-tabular">{{ brl(r.valorPagoCents) }}</td>
                        <td class="px-3 py-2">
                            <Link
                                :href="`/admin/apostas?rodada=${r.uuid}&vendedor=${vendedor.uuid}`"
                                class="text-aceso underline"
                            >
                                Apostas
                            </Link>
                        </td>
                    </tr>
                    <tr v-if="rodadas.length === 0">
                        <td colspan="5" class="px-3 py-6 text-vidro">
                            Este vendedor ainda não tem apostas em nenhuma rodada.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </AdminLayout>
</template>
