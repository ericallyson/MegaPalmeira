<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';

const form = useForm({
    celular: '',
    data_nascimento: '',
});

function entrar() {
    form.post('/apostador/entrar');
}
</script>

<template>
    <Head title="Minhas apostas" />
    <div class="min-h-screen bg-tinta text-papel">
        <header class="bg-papel text-tinta">
            <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
                <Link href="/">
                    <img src="/logoMega.png" alt="MegaPalmeira" class="h-12 w-auto" />
                </Link>
            </div>
        </header>

        <main class="mx-auto flex max-w-sm flex-col px-4 pt-16">
            <h1 class="font-display text-28 font-black uppercase tracking-tight">Minhas apostas</h1>
            <p class="mt-1 text-14 text-vidro">
                Entre com o celular e a data de nascimento que você usou para apostar.
            </p>

            <form class="mt-6" @submit.prevent="entrar">
                <label class="block text-12 uppercase text-vidro" for="celular">Celular com DDD</label>
                <input
                    id="celular"
                    v-model="form.celular"
                    type="tel"
                    inputmode="tel"
                    autocomplete="tel"
                    placeholder="(82) 99123-4589"
                    class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-16 focus:border-aceso focus:outline-none"
                />
                <p v-if="form.errors.celular" class="mt-1 text-12 text-erro">{{ form.errors.celular }}</p>

                <label class="mt-4 block text-12 uppercase text-vidro" for="data_nascimento">Data de nascimento</label>
                <input
                    id="data_nascimento"
                    v-model="form.data_nascimento"
                    type="date"
                    autocomplete="bday"
                    class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-16 focus:border-aceso focus:outline-none"
                />
                <p v-if="form.errors.data_nascimento" class="mt-1 text-12 text-erro">{{ form.errors.data_nascimento }}</p>

                <button
                    type="submit"
                    :disabled="form.processing"
                    class="mt-4 w-full rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-50"
                >
                    Entrar
                </button>
            </form>

            <p class="mt-6 text-12 text-vidro">
                Ainda não apostou?
                <Link href="/apostar" class="text-aceso underline">Fazer uma aposta</Link>.
            </p>
        </main>
    </div>
</template>
