<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import Ball from '@/Components/Ball.vue';
import { brl } from '@/lib/format';

defineProps<{
    apostador: {
        nome: string;
        telefoneMascarado: string;
        totalApostadoCents: number;
    };
    cartelas: Array<{
        uuid: string;
        rodada: string;
        status: string;
        statusLabel: string;
        pontos: number;
        valorCents: number;
        numeros: Array<{ number: number; matchedDrawId: number | null }>;
    }>;
}>();
</script>

<template>
    <Head title="Minhas cartelas" />
    <div class="min-h-screen bg-tinta text-papel">
        <header class="bg-papel text-tinta">
            <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
                <Link href="/">
                    <img src="/logoMega.png" alt="MegaPalmeira" class="h-12 w-auto" />
                </Link>
            </div>
        </header>

        <main class="mx-auto max-w-3xl px-4 pb-16">
            <h1 class="mt-6 font-display text-28 font-black uppercase tracking-tight">
                Minhas cartelas
            </h1>
            <p class="mt-1 text-14 text-vidro">
                {{ apostador.nome }} · {{ apostador.telefoneMascarado }}
            </p>

            <div v-if="cartelas.length === 0" class="mt-8 rounded-lg bg-noite p-6">
                <p class="text-16 text-vidro">Nenhuma cartela ainda. Seja o primeiro.</p>
            </div>

            <div v-for="cartela in cartelas" :key="cartela.uuid" class="mt-4 rounded-lg bg-noite p-4">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <p class="text-14 text-vidro">{{ cartela.rodada }}</p>
                    <p class="text-14">
                        <span
                            :class="cartela.status === 'paid'
                                ? 'text-jade'
                                : cartela.status === 'paid_late'
                                    ? 'text-brasa'
                                    : 'text-vidro'"
                        >
                            {{ cartela.statusLabel }}
                        </span>
                        <span v-if="cartela.status === 'paid'" class="ml-2 font-mono font-tabular text-aceso">
                            {{ cartela.pontos }} pts
                        </span>
                    </p>
                </div>
                <div class="mt-3 flex flex-wrap gap-1.5">
                    <Ball
                        v-for="n in cartela.numeros"
                        :key="n.number"
                        :n="n.number"
                        :lit="n.matchedDrawId !== null"
                        size="md"
                    />
                </div>
            </div>

            <footer class="mt-10 border-t border-noite pt-4 text-14 text-vidro">
                <p>
                    Você já apostou
                    <span class="font-mono font-tabular text-papel">{{ brl(apostador.totalApostadoCents) }}</span>
                    nesta rodada. Jogo é entretenimento: aposte com responsabilidade.
                </p>
            </footer>
        </main>
    </div>
</template>
