<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';

const form = useForm({
    password: '',
});

function confirmar() {
    form.post('/user/confirm-password');
}
</script>

<template>
    <Head title="Confirmar senha" />
    <div class="flex min-h-screen items-center justify-center bg-tinta px-4">
        <form class="w-full max-w-sm rounded-lg bg-noite p-6" @submit.prevent="confirmar">
            <h1 class="font-display text-20 font-black uppercase tracking-tight text-aceso">Confirme sua senha</h1>
            <p class="mt-1 text-14 text-vidro">Esta ação sensível pede a senha de novo.</p>

            <label class="mt-6 block text-14 text-vidro" for="password">Senha</label>
            <input
                id="password"
                v-model="form.password"
                type="password"
                required
                autocomplete="current-password"
                class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-16 text-papel focus:border-aceso focus:outline-none"
            />
            <p v-if="form.errors.password" class="mt-1 text-12 text-erro">{{ form.errors.password }}</p>

            <button
                type="submit"
                :disabled="form.processing"
                class="mt-6 w-full rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase tracking-tight text-tinta disabled:opacity-60"
            >
                Confirmar
            </button>
        </form>
    </div>
</template>
