<script setup lang="ts">
import { ref } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { dataHora } from '@/lib/format';

const props = defineProps<{
    usuarios: {
        data: Array<{
            id: number;
            nome: string;
            email: string;
            telefone: string | null;
            admin: boolean;
            doisFatoresAtivo: boolean;
            criadoEm: string | null;
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filtros: { busca?: string };
    usuarioAtualId: number | null;
}>();

const busca = ref(props.filtros.busca ?? '');

function filtrar() {
    router.get(
        '/admin/usuarios',
        { busca: busca.value || undefined },
        { preserveState: true, replace: true },
    );
}

function excluir(id: number, nome: string) {
    if (!confirm(`Excluir o usuário ${nome}? Esta ação não pode ser desfeita.`)) return;
    router.delete(`/admin/usuarios/${id}`);
}

function resetar2fa(id: number, nome: string) {
    if (!confirm(`Resetar o 2FA de ${nome}? Ele precisará reconfigurar no próximo acesso ao admin.`)) return;
    router.post(`/admin/usuarios/${id}/reset-2fa`, {}, { preserveScroll: true });
}
</script>

<template>
    <Head title="Usuários" />
    <AdminLayout>
        <div class="flex flex-wrap items-center justify-between gap-3">
            <h1 class="font-display text-28 font-black uppercase tracking-tight">Usuários</h1>
            <Link
                href="/admin/usuarios/criar"
                class="rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
            >
                Novo usuário
            </Link>
        </div>

        <form class="mt-4 flex flex-wrap items-end gap-3" @submit.prevent="filtrar">
            <div>
                <label class="block text-12 uppercase text-vidro" for="filtro-busca">Nome ou e-mail</label>
                <input
                    id="filtro-busca"
                    v-model="busca"
                    type="search"
                    class="mt-1 rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
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
                        <th class="px-3 py-2">Nome</th>
                        <th class="px-3 py-2">E-mail</th>
                        <th class="px-3 py-2">Telefone</th>
                        <th class="px-3 py-2">Perfil</th>
                        <th class="px-3 py-2">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="u in usuarios.data" :key="u.id" class="border-b border-vidro/10">
                        <td class="px-3 py-2">
                            {{ u.nome }}
                            <span v-if="u.id === usuarioAtualId" class="ml-1 text-12 text-vidro">(você)</span>
                        </td>
                        <td class="px-3 py-2 text-vidro">{{ u.email }}</td>
                        <td class="px-3 py-2 font-mono text-12 font-tabular text-vidro">{{ u.telefone ?? '—' }}</td>
                        <td class="px-3 py-2">
                            <span :class="u.admin ? 'text-jade' : 'text-vidro'">
                                {{ u.admin ? 'Administrador' : 'Comum' }}
                            </span>
                            <span v-if="u.admin" class="block text-12" :class="u.doisFatoresAtivo ? 'text-vidro' : 'text-brasa'">
                                {{ u.doisFatoresAtivo ? '2FA ativo' : '2FA pendente' }}
                            </span>
                        </td>
                        <td class="px-3 py-2">
                            <div class="flex flex-wrap gap-3">
                                <Link :href="`/admin/usuarios/${u.id}/editar`" class="text-aceso underline">Editar</Link>
                                <button
                                    v-if="u.doisFatoresAtivo"
                                    type="button"
                                    class="text-brasa underline"
                                    @click="resetar2fa(u.id, u.nome)"
                                >
                                    Resetar 2FA
                                </button>
                                <button
                                    v-if="u.id !== usuarioAtualId"
                                    type="button"
                                    class="text-erro underline"
                                    @click="excluir(u.id, u.nome)"
                                >
                                    Excluir
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="usuarios.data.length === 0">
                        <td colspan="5" class="px-3 py-6 text-vidro">Nenhum usuário encontrado.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <nav v-if="usuarios.links.length > 3" class="mt-4 flex flex-wrap gap-1" aria-label="Paginação">
            <template v-for="(link, i) in usuarios.links" :key="i">
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
