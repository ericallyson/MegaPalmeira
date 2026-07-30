<script setup lang="ts">
import { computed } from 'vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { brl, dataHora, dezena } from '@/lib/format';

const props = defineProps<{
    rodada: {
        nome: string;
        valorCents: number;
        encerramentoApostas: string;
        maxCartelasPorPessoa: number;
        versaoRegulamento: string;
    };
}>();

const form = useForm({
    nome: '',
    celular: '',
    email: '',
    numbers: [] as number[],
    aceite_maioridade: false,
    aceite_regulamento: false,
});

const faltam = computed(() => 10 - form.numbers.length);

function alternar(n: number) {
    const i = form.numbers.indexOf(n);
    if (i >= 0) {
        form.numbers.splice(i, 1);
    } else if (form.numbers.length < 10) {
        form.numbers.push(n);
    }
}

function surpresinha() {
    const todos = Array.from({ length: 60 }, (_, i) => i + 1);
    for (let i = todos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [todos[i], todos[j]] = [todos[j], todos[i]];
    }
    form.numbers = todos.slice(0, 10).sort((a, b) => a - b);
}

function pagar() {
    form.post('/apostas');
}
</script>

<template>
    <Head title="Fazer minha aposta" />
    <div class="min-h-screen bg-tinta text-papel">
        <header class="border-b border-noite">
            <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
                <Link href="/" class="font-display text-16 font-black uppercase tracking-tight text-aceso">
                    Bolão Dez
                </Link>
                <p class="text-14 text-vidro">{{ rodada.nome }}</p>
            </div>
        </header>

        <main class="mx-auto max-w-3xl px-4 pb-16">
            <h1 class="mt-6 font-display text-28 font-black uppercase tracking-tight">Fazer minha aposta</h1>
            <p class="mt-1 text-14 text-vidro">
                {{ brl(rodada.valorCents) }} por cartela · apostas até {{ dataHora(rodada.encerramentoApostas) }}
                · máximo de {{ rodada.maxCartelasPorPessoa }} cartelas por pessoa
            </p>

            <form class="mt-6 space-y-6" @submit.prevent="pagar">
                <section aria-labelledby="dezenas-label">
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <p id="dezenas-label" class="text-16">
                            Escolha 10 dezenas
                            <span class="font-mono font-tabular" :class="faltam === 0 ? 'text-jade' : 'text-aceso'">
                                {{ faltam === 0 ? '· cartela completa' : `· faltam ${faltam}` }}
                            </span>
                        </p>
                        <button
                            type="button"
                            class="rounded border border-aceso px-3 py-1.5 font-display text-12 font-bold uppercase text-aceso"
                            @click="surpresinha"
                        >
                            Surpresinha
                        </button>
                    </div>
                    <div class="mt-3 grid grid-cols-6 gap-1.5 sm:grid-cols-10" role="group" aria-label="Dezenas de 1 a 60">
                        <button
                            v-for="n in 60"
                            :key="n"
                            type="button"
                            :aria-pressed="form.numbers.includes(n)"
                            :aria-label="`Dezena ${n}`"
                            class="flex h-10 items-center justify-center rounded-full font-mono text-14 font-tabular focus:outline-none focus-visible:ring-2 focus-visible:ring-aceso"
                            :class="form.numbers.includes(n)
                                ? 'border border-aceso bg-aceso font-bold text-tinta'
                                : 'border border-vidro/30 bg-noite text-vidro hover:border-vidro'"
                            @click="alternar(n)"
                        >
                            {{ dezena(n) }}
                        </button>
                    </div>
                    <p v-if="form.errors.numbers" class="mt-2 text-14 text-erro">{{ form.errors.numbers }}</p>
                </section>

                <section class="rounded-lg bg-noite p-4">
                    <div class="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label class="block text-14 text-vidro" for="nome">Nome completo</label>
                            <input
                                id="nome"
                                v-model="form.nome"
                                type="text"
                                required
                                autocomplete="name"
                                class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-16 focus:border-aceso focus:outline-none"
                            />
                            <p v-if="form.errors.nome" class="mt-1 text-12 text-erro">{{ form.errors.nome }}</p>
                        </div>
                        <div>
                            <label class="block text-14 text-vidro" for="celular">Celular com DDD</label>
                            <input
                                id="celular"
                                v-model="form.celular"
                                type="tel"
                                required
                                autocomplete="tel-national"
                                placeholder="(82) 99123-4589"
                                class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"
                            />
                            <p v-if="form.errors.celular" class="mt-1 text-12 text-erro">{{ form.errors.celular }}</p>
                        </div>
                    </div>
                    <div class="mt-4">
                        <label class="block text-14 text-vidro" for="email">E-mail (opcional, para o comprovante)</label>
                        <input
                            id="email"
                            v-model="form.email"
                            type="email"
                            autocomplete="email"
                            class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-16 focus:border-aceso focus:outline-none"
                        />
                        <p v-if="form.errors.email" class="mt-1 text-12 text-erro">{{ form.errors.email }}</p>
                    </div>

                    <label class="mt-4 flex items-start gap-2 text-14">
                        <input v-model="form.aceite_maioridade" type="checkbox" class="mt-1 accent-aceso" />
                        <span>Tenho 18 anos ou mais.</span>
                    </label>
                    <p v-if="form.errors.aceite_maioridade" class="mt-1 text-12 text-erro">{{ form.errors.aceite_maioridade }}</p>
                    <label class="mt-2 flex items-start gap-2 text-14">
                        <input v-model="form.aceite_regulamento" type="checkbox" class="mt-1 accent-aceso" />
                        <span>
                            Li e aceito o
                            <Link href="/regulamento" class="text-aceso underline" target="_blank">regulamento</Link>
                            (versão {{ rodada.versaoRegulamento }}).
                        </span>
                    </label>
                    <p v-if="form.errors.aceite_regulamento" class="mt-1 text-12 text-erro">{{ form.errors.aceite_regulamento }}</p>
                </section>

                <button
                    type="submit"
                    :disabled="form.processing || faltam > 0"
                    class="w-full rounded bg-aceso px-6 py-3 font-display text-16 font-bold uppercase tracking-tight text-tinta disabled:opacity-50 sm:w-auto"
                >
                    Pagar com PIX · {{ brl(rodada.valorCents) }}
                </button>
            </form>
        </main>
    </div>
</template>
