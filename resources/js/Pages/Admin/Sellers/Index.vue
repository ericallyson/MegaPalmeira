<script setup lang="ts">
import { ref } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps<{
    vendedores: {
        data: Array<{
            uuid: string;
            nome: string;
            slug: string;
            telefone: string | null;
            comissaoPct: number;
            grupoUrl: string | null;
            link: string;
            apostas: number;
            apostasPagas: number;
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filtros: { busca?: string };
}>();

const busca = ref(props.filtros.busca ?? '');
const copiado = ref<string | null>(null);

function filtrar() {
    router.get(
        '/admin/vendedores',
        { busca: busca.value || undefined },
        { preserveState: true, replace: true },
    );
}

function copiarLink(uuid: string, link: string) {
    navigator.clipboard?.writeText(link).then(() => {
        copiado.value = uuid;
        setTimeout(() => (copiado.value = null), 1500);
    });
}

function excluir(uuid: string, nome: string) {
    if (!confirm(`Excluir o vendedor ${nome}? As apostas já feitas continuam, mas sem vínculo com ele.`)) return;
    router.delete(`/admin/vendedores/${uuid}`);
}
</script>

<template>
    <Head title="Vendedores" />
    <AdminLayout>
        <div class="flex flex-wrap items-center justify-between gap-3">
            <h1 class="font-display text-28 font-black uppercase tracking-tight">Vendedores</h1>
            <Link
                href="/admin/vendedores/criar"
                class="rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
            >
                Novo vendedor
            </Link>
        </div>

        <form class="mt-4 flex flex-wrap items-end gap-3" @submit.prevent="filtrar">
            <div>
                <label class="block text-12 uppercase text-vidro" for="filtro-busca">Nome ou slug</label>
                <input
                    id="filtro-busca"
                    v-model="busca"
                    type="search"
                    class="mt-1 rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                />
            </div>
            <button
                type="submit"
                aria-label="Filtrar"
                class="inline-flex items-center gap-2 rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
            >
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Filtrar
            </button>
        </form>

        <div class="mt-4 overflow-x-auto rounded-lg bg-noite">
            <table class="w-full text-left text-14">
                <thead>
                    <tr class="border-b border-vidro/20 text-12 uppercase text-vidro">
                        <th class="px-3 py-2">Nome</th>
                        <th class="px-3 py-2">Link</th>
                        <th class="px-3 py-2">Telefone</th>
                        <th class="px-3 py-2">Comissão</th>
                        <th class="px-3 py-2">Apostas</th>
                        <th class="px-3 py-2">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="v in vendedores.data" :key="v.uuid" class="border-b border-vidro/10">
                        <td class="px-3 py-2">
                            <p>{{ v.nome }}</p>
                            <p class="font-mono text-12 font-tabular text-vidro">/{{ v.slug }}</p>
                        </td>
                        <td class="px-3 py-2">
                            <button
                                type="button"
                                class="text-aceso underline"
                                @click="copiarLink(v.uuid, v.link)"
                            >
                                {{ copiado === v.uuid ? 'Copiado!' : 'Copiar link' }}
                            </button>
                            <a
                                v-if="v.grupoUrl"
                                :href="v.grupoUrl"
                                target="_blank"
                                rel="noopener"
                                class="ml-3 text-jade underline"
                            >
                                Grupo
                            </a>
                        </td>
                        <td class="px-3 py-2 font-mono text-12 font-tabular text-vidro">{{ v.telefone ?? '—' }}</td>
                        <td class="px-3 py-2 font-mono font-tabular">{{ v.comissaoPct }}%</td>
                        <td class="px-3 py-2 font-mono text-12 font-tabular">
                            {{ v.apostasPagas }} pagas
                            <span class="text-vidro">/ {{ v.apostas }} total</span>
                        </td>
                        <td class="px-3 py-2">
                            <div class="flex flex-wrap gap-3">
                                <Link :href="`/admin/vendedores/${v.uuid}/rodadas`" class="text-aceso underline">Rodadas</Link>
                                <Link :href="`/admin/vendedores/${v.uuid}/editar`" class="text-aceso underline">Editar</Link>
                                <button type="button" class="text-erro underline" @click="excluir(v.uuid, v.nome)">
                                    Excluir
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="vendedores.data.length === 0">
                        <td colspan="6" class="px-3 py-6 text-vidro">Nenhum vendedor cadastrado.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <nav v-if="vendedores.links.length > 3" class="mt-4 flex flex-wrap gap-1" aria-label="Paginação">
            <template v-for="(link, i) in vendedores.links" :key="i">
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
