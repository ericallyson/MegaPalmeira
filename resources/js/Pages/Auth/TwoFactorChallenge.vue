<script setup lang="ts">
import { ref } from 'vue';
import { Head, useForm } from '@inertiajs/vue3';

const usandoRecuperacao = ref(false);

const form = useForm({
    code: '',
    recovery_code: '',
});

function confirmar() {
    form.post('/two-factor-challenge');
}
</script>

<template>
    <Head title="Verificação em duas etapas" />
    <div class="flex min-h-screen items-center justify-center bg-tinta px-4">
        <form class="w-full max-w-sm rounded-lg bg-noite p-6" @submit.prevent="confirmar">
            <h1 class="font-display text-20 font-black uppercase tracking-tight text-aceso">Verificação</h1>
            <p class="mt-1 text-14 text-vidro">
                {{ usandoRecuperacao ? 'Informe um código de recuperação.' : 'Informe o código do seu aplicativo autenticador.' }}
            </p>

            <template v-if="!usandoRecuperacao">
                <label class="mt-6 block text-14 text-vidro" for="code">Código</label>
                <input
                    id="code"
                    v-model="form.code"
                    type="text"
                    inputmode="numeric"
                    autocomplete="one-time-code"
                    class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 font-mono text-16 text-papel focus:border-aceso focus:outline-none"
                />
                <p v-if="form.errors.code" class="mt-1 text-12 text-erro">{{ form.errors.code }}</p>
            </template>
            <template v-else>
                <label class="mt-6 block text-14 text-vidro" for="recovery_code">Código de recuperação</label>
                <input
                    id="recovery_code"
                    v-model="form.recovery_code"
                    type="text"
                    class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 font-mono text-16 text-papel focus:border-aceso focus:outline-none"
                />
                <p v-if="form.errors.recovery_code" class="mt-1 text-12 text-erro">{{ form.errors.recovery_code }}</p>
            </template>

            <button
                type="submit"
                :disabled="form.processing"
                class="mt-6 w-full rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase tracking-tight text-tinta disabled:opacity-60"
            >
                Confirmar
            </button>

            <button
                type="button"
                class="mt-3 w-full text-center text-14 text-vidro underline"
                @click="usandoRecuperacao = !usandoRecuperacao"
            >
                {{ usandoRecuperacao ? 'Usar código do aplicativo' : 'Usar código de recuperação' }}
            </button>
        </form>
    </div>
</template>
