<script setup lang="ts">
import { ref } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { brl, dataHora, dezena } from '@/lib/format';

const props = defineProps<{
    apostas: {
        data: Array<{
            uuid: string;
            nome: string;
            telefone: string;
            rodada: string;
            dezenas: number[];
            valorCents: number;
            status: string;
            statusLabel: string;
            pontos: number;
            pagaEm: string | null;
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filtros: { status?: string; busca?: string; dezena?: string };
    statusDisponiveis: Array<{ value: string; label: string }>;
}>();

const status = ref(props.filtros.status ?? '');
const busca = ref(props.filtros.busca ?? '');
const filtroDezena = ref(props.filtros.dezena ?? '');
const motivos = ref<Record<string, string>>({});
const abertaParaBaixa = ref<string | null>(null);

function filtrar() {
    router.get(
        '/admin/apostas',
        { status: status.value || undefined, busca: busca.value || undefined, dezena: filtroDezena.value || undefined },
        { preserveState: true, replace: true },
    );
}

function darBaixa(uuid: string) {
    router.post(
        `/admin/apostas/${uuid}/baixa`,
        { motivo: motivos.value[uuid] ?? '' },
        { onSuccess: () => (abertaParaBaixa.value = null) },
    );
}
</script>

<template>
    <Head title="Apostas" />
    <AdminLayout>
        <h1 class="font-display text-28 font-black uppercase tracking-tight">Apostas</h1>

        <form class="mt-4 flex flex-wrap items-end gap-3" @submit.prevent="filtrar">
            <div>
                <label class="block text-12 uppercase text-vidro" for="filtro-status">Status</label>
                <select
                    id="filtro-status"
                    v-model="status"
                    class="mt-1 rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                    @change="filtrar"
                >
                    <option value="">Todos</option>
                    <option v-for="s in statusDisponiveis" :key="s.value" :value="s.value">{{ s.label }}</option>
                </select>
            </div>
            <div>
                <label class="block text-12 uppercase text-vidro" for="filtro-busca">Nome ou telefone</label>
                <input
                    id="filtro-busca"
                    v-model="busca"
                    type="search"
                    class="mt-1 rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                />
            </div>
            <div>
                <label class="block text-12 uppercase text-vidro" for="filtro-dezena">Dezena</label>
                <input
                    id="filtro-dezena"
                    v-model="filtroDezena"
                    type="number"
                    min="1"
                    max="60"
                    class="mt-1 w-20 rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-14 font-tabular focus:border-aceso focus:outline-none"
                />
            </div>
            <button type="submit" class="rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta">
                Filtrar
            </button>
        </form>

        <div class="mt-4 overflow-x-auto rounded-lg bg-noite">
            <table class="w-full text-left text-14">
                <thead>
                    <tr class="border-b border-vidro/20 text-12 uppercase text-vidro">
                        <th class="px-3 py-2">Apostador</th>
                        <th class="px-3 py-2">Dezenas</th>
                        <th class="px-3 py-2">Valor</th>
                        <th class="px-3 py-2">Status</th>
                        <th class="px-3 py-2">Pts</th>
                        <th class="px-3 py-2">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="aposta in apostas.data" :key="aposta.uuid">
                        <tr
                            class="border-b border-vidro/10"
                            :class="aposta.status === 'paid_late' ? 'bg-brasa/10' : ''"
                        >
                            <td class="px-3 py-2">
                                <p>{{ aposta.nome }}</p>
                                <p class="font-mono text-12 font-tabular text-vidro">{{ aposta.telefone }}</p>
                            </td>
                            <td class="px-3 py-2 font-mono text-12 font-tabular">
                                {{ aposta.dezenas.map(dezena).join(' ') }}
                            </td>
                            <td class="px-3 py-2 font-mono font-tabular">{{ brl(aposta.valorCents) }}</td>
                            <td class="px-3 py-2">
                                <span :class="aposta.status === 'paid' ? 'text-jade' : aposta.status === 'paid_late' ? 'text-brasa' : 'text-vidro'">
                                    {{ aposta.statusLabel }}
                                </span>
                                <p v-if="aposta.pagaEm" class="text-12 text-vidro">{{ dataHora(aposta.pagaEm) }}</p>
                            </td>
                            <td class="px-3 py-2 font-mono font-tabular">{{ aposta.pontos }}</td>
                            <td class="px-3 py-2">
                                <button
                                    v-if="aposta.status === 'awaiting_payment' || aposta.status === 'expired'"
                                    type="button"
                                    class="text-14 text-aceso underline"
                                    @click="abertaParaBaixa = abertaParaBaixa === aposta.uuid ? null : aposta.uuid"
                                >
                                    Dar baixa
                                </button>
                            </td>
                        </tr>
                        <tr v-if="abertaParaBaixa === aposta.uuid" class="border-b border-vidro/10 bg-tinta/40">
                            <td colspan="6" class="px-3 py-3">
                                <label class="block text-12 uppercase text-vidro" :for="`motivo-${aposta.uuid}`">
                                    Motivo da baixa manual (obrigatório)
                                </label>
                                <div class="mt-1 flex gap-2">
                                    <input
                                        :id="`motivo-${aposta.uuid}`"
                                        v-model="motivos[aposta.uuid]"
                                        type="text"
                                        placeholder="Ex.: pagou em dinheiro na portaria"
                                        class="w-full max-w-md rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        class="rounded bg-jade px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
                                        @click="darBaixa(aposta.uuid)"
                                    >
                                        Confirmar baixa
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </template>
                    <tr v-if="apostas.data.length === 0">
                        <td colspan="6" class="px-3 py-6 text-vidro">Nenhuma aposta encontrada com esses filtros.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <nav v-if="apostas.links.length > 3" class="mt-4 flex flex-wrap gap-1" aria-label="Paginação">
            <template v-for="(link, i) in apostas.links" :key="i">
                <Link
                    v-if="link.url"
                    :href="link.url"
                    class="rounded px-3 py-1 text-14"
                    :class="link.active ? 'bg-aceso font-bold text-tinta' : 'text-vidro hover:text-papel'"
                    v-html="link.label"
                />
                <span v-else class="px-3 py-1 text-14 text-vidro/40" v-html="link.label" />
            </template>
        </nav>
    </AdminLayout>
</template>
