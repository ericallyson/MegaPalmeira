<script setup lang="ts">
import { computed } from 'vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps<{
    usuario: {
        id: number;
        nome: string;
        email: string;
        telefone: string | null;
        admin: boolean;
    } | null;
}>();

const editando = computed(() => props.usuario !== null);

const form = useForm({
    name: props.usuario?.nome ?? '',
    email: props.usuario?.email ?? '',
    phone: props.usuario?.telefone ?? '',
    password: '',
    password_confirmation: '',
    is_admin: props.usuario?.admin ?? false,
});

function salvar() {
    if (editando.value) {
        form.put(`/admin/usuarios/${props.usuario!.id}`);
    } else {
        form.post('/admin/usuarios');
    }
}
</script>

<template>
    <Head :title="editando ? 'Editar usuário' : 'Novo usuário'" />
    <AdminLayout>
        <div class="flex items-center gap-3">
            <Link href="/admin/usuarios" class="text-14 text-vidro hover:text-papel">← Usuários</Link>
        </div>
        <h1 class="mt-2 font-display text-28 font-black uppercase tracking-tight">
            {{ editando ? 'Editar usuário' : 'Novo usuário' }}
        </h1>

        <form class="mt-6 max-w-lg space-y-4" @submit.prevent="salvar">
            <div>
                <label class="block text-12 uppercase text-vidro" for="name">Nome</label>
                <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                />
                <p v-if="form.errors.name" class="mt-1 text-12 text-erro">{{ form.errors.name }}</p>
            </div>

            <div>
                <label class="block text-12 uppercase text-vidro" for="email">E-mail</label>
                <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                />
                <p v-if="form.errors.email" class="mt-1 text-12 text-erro">{{ form.errors.email }}</p>
            </div>

            <div>
                <label class="block text-12 uppercase text-vidro" for="phone">Telefone (opcional)</label>
                <input
                    id="phone"
                    v-model="form.phone"
                    type="text"
                    class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                />
                <p v-if="form.errors.phone" class="mt-1 text-12 text-erro">{{ form.errors.phone }}</p>
            </div>

            <div>
                <label class="block text-12 uppercase text-vidro" for="password">
                    {{ editando ? 'Nova senha (deixe em branco para manter)' : 'Senha' }}
                </label>
                <input
                    id="password"
                    v-model="form.password"
                    type="password"
                    autocomplete="new-password"
                    class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                />
                <p v-if="form.errors.password" class="mt-1 text-12 text-erro">{{ form.errors.password }}</p>
            </div>

            <div>
                <label class="block text-12 uppercase text-vidro" for="password_confirmation">Confirmar senha</label>
                <input
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    type="password"
                    autocomplete="new-password"
                    class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                />
            </div>

            <label class="flex items-center gap-2 text-14">
                <input v-model="form.is_admin" type="checkbox" class="h-4 w-4" />
                Administrador (acesso ao painel)
            </label>

            <div class="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    :disabled="form.processing"
                    class="rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-50"
                >
                    {{ editando ? 'Salvar' : 'Criar' }}
                </button>
                <Link href="/admin/usuarios" class="text-14 text-vidro hover:text-papel">Cancelar</Link>
            </div>
        </form>
    </AdminLayout>
</template>
