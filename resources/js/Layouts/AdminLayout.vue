<script setup lang="ts">
import { computed } from 'vue';
import { Link, router, usePage } from '@inertiajs/vue3';

const page = usePage();
const flash = computed(() => page.props.flash as { sucesso?: string; erro?: string });
const user = computed(() => (page.props.auth as { user?: { name: string } }).user);

function sair() {
    router.post('/logout');
}
</script>

<template>
    <div class="min-h-screen bg-tinta text-papel">
        <header class="bg-papel text-tinta">
            <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
                <Link href="/admin" class="flex items-center gap-2">
                    <img src="/logoMega.png" alt="MegaPalmeira" class="h-14 w-auto" />
                    <span class="font-display text-16 font-black uppercase tracking-tight text-tinta">Admin</span>
                </Link>
                <nav class="flex items-center gap-4 text-14">
                    <Link href="/admin" class="text-noite/70 hover:text-tinta">Painel</Link>
                    <Link href="/admin/rodadas" class="text-noite/70 hover:text-tinta">Rodadas</Link>
                    <Link href="/admin/apostas" class="text-noite/70 hover:text-tinta">Apostas</Link>
                    <Link href="/admin/vendedores" class="text-noite/70 hover:text-tinta">Vendedores</Link>
                    <Link href="/admin/usuarios" class="text-noite/70 hover:text-tinta">Usuários</Link>
                    <Link href="/admin/configuracoes" class="text-noite/70 hover:text-tinta">Configurações</Link>
                    <button type="button" class="text-noite/70 hover:text-tinta" @click="sair">
                        Sair<span v-if="user" class="hidden sm:inline"> ({{ user.name }})</span>
                    </button>
                </nav>
            </div>
        </header>

        <div v-if="flash.sucesso" class="mx-auto mt-4 max-w-6xl px-4">
            <p class="rounded border border-jade/40 bg-jade/10 px-3 py-2 text-14 text-jade" role="status">
                {{ flash.sucesso }}
            </p>
        </div>
        <div v-if="flash.erro" class="mx-auto mt-4 max-w-6xl px-4">
            <p class="rounded border border-erro/40 bg-erro/10 px-3 py-2 text-14 text-erro" role="alert">
                {{ flash.erro }}
            </p>
        </div>

        <main class="mx-auto max-w-6xl px-4 py-6">
            <slot />
        </main>
    </div>
</template>
