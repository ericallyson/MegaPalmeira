<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';

const form = useForm({
    slug: '',
    senha: '',
});

function entrar() {
    form.post('/vendedor/entrar');
}
</script>

<template>
    <Head title="Área do vendedor" />
    <div class="min-h-screen bg-tinta text-papel">
        <header class="bg-papel text-tinta">
            <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
                <Link href="/">
                    <img src="/logoMega.png" alt="MegaPalmeira" class="h-12 w-auto" />
                </Link>
            </div>
        </header>

        <main class="mx-auto flex max-w-sm flex-col px-4 pt-16">
            <h1 class="font-display text-28 font-black uppercase tracking-tight">Área do vendedor</h1>
            <p class="mt-1 text-14 text-vidro">Entre com seu usuário e senha.</p>

            <form class="mt-6" @submit.prevent="entrar">
                <label class="block text-12 uppercase text-vidro" for="slug">Usuário (slug)</label>
                <input
                    id="slug"
                    v-model="form.slug"
                    type="text"
                    autocomplete="username"
                    placeholder="joao-silva"
                    class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"
                />
                <p v-if="form.errors.slug" class="mt-1 text-12 text-erro">{{ form.errors.slug }}</p>

                <label class="mt-4 block text-12 uppercase text-vidro" for="senha">Senha</label>
                <input
                    id="senha"
                    v-model="form.senha"
                    type="password"
                    autocomplete="current-password"
                    class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-16 focus:border-aceso focus:outline-none"
                />
                <p v-if="form.errors.senha" class="mt-1 text-12 text-erro">{{ form.errors.senha }}</p>

                <button
                    type="submit"
                    :disabled="form.processing"
                    class="mt-4 w-full rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-50"
                >
                    Entrar
                </button>
            </form>
        </main>
    </div>
</template>
