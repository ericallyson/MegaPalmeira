<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

function entrar() {
    form.post('/login');
}
</script>

<template>
    <Head title="Entrar" />
    <div class="flex min-h-screen items-center justify-center bg-tinta px-4">
        <form class="w-full max-w-sm rounded-lg bg-noite p-6" @submit.prevent="entrar">
            <img src="/logoMega.png" alt="MegaPalmeira" class="h-16 w-auto" />
            <p class="mt-2 text-14 text-vidro">Acesso do administrador</p>

            <label class="mt-6 block text-14 text-vidro" for="email">E-mail</label>
            <input
                id="email"
                v-model="form.email"
                type="email"
                required
                autocomplete="email"
                class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-16 text-papel focus:border-aceso focus:outline-none"
            />
            <p v-if="form.errors.email" class="mt-1 text-12 text-erro">{{ form.errors.email }}</p>

            <label class="mt-4 block text-14 text-vidro" for="password">Senha</label>
            <input
                id="password"
                v-model="form.password"
                type="password"
                required
                autocomplete="current-password"
                class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-16 text-papel focus:border-aceso focus:outline-none"
            />
            <p v-if="form.errors.password" class="mt-1 text-12 text-erro">{{ form.errors.password }}</p>

            <label class="mt-4 flex items-center gap-2 text-14 text-vidro">
                <input v-model="form.remember" type="checkbox" class="accent-aceso" />
                Continuar conectado
            </label>

            <button
                type="submit"
                :disabled="form.processing"
                class="mt-6 w-full rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase tracking-tight text-tinta disabled:opacity-60"
            >
                Entrar
            </button>
        </form>
    </div>
</template>
