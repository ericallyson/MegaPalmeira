<script setup lang="ts">
import { ref } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import axios from 'axios';

const props = defineProps<{
    enabled: boolean;
    confirmed: boolean;
}>();

const qrSvg = ref<string | null>(null);
const codigo = ref('');
const senha = ref('');
const pedindoSenha = ref(false);
const erro = ref<string | null>(null);
const recuperacao = ref<string[]>([]);
const carregando = ref(false);

async function ativar() {
    erro.value = null;
    carregando.value = true;
    try {
        await axios.post('/user/two-factor-authentication');
        await carregarQr();
    } catch (e: unknown) {
        tratarErro(e);
    } finally {
        carregando.value = false;
    }
}

async function carregarQr() {
    const { data } = await axios.get('/user/two-factor-qr-code');
    qrSvg.value = data.svg;
}

async function confirmarCodigo() {
    erro.value = null;
    carregando.value = true;
    try {
        await axios.post('/user/confirmed-two-factor-authentication', { code: codigo.value });
        const { data } = await axios.get('/user/two-factor-recovery-codes');
        recuperacao.value = data;
    } catch (e: unknown) {
        tratarErro(e);
    } finally {
        carregando.value = false;
    }
}

async function confirmarSenha() {
    erro.value = null;
    carregando.value = true;
    try {
        await axios.post('/user/confirm-password', { password: senha.value });
        pedindoSenha.value = false;
        senha.value = '';
        await ativar();
    } catch (e: unknown) {
        tratarErro(e);
    } finally {
        carregando.value = false;
    }
}

function tratarErro(e: unknown) {
    const err = e as { response?: { status?: number; data?: { message?: string } } };
    if (err.response?.status === 423) {
        pedindoSenha.value = true;
        return;
    }
    erro.value = err.response?.data?.message ?? 'Algo deu errado. Tente de novo.';
}

function irParaPainel() {
    router.visit('/admin');
}
</script>

<template>
    <Head title="Ativar verificação em duas etapas" />
    <div class="flex min-h-screen items-center justify-center bg-tinta px-4">
        <div class="w-full max-w-md rounded-lg bg-noite p-6">
            <h1 class="font-display text-20 font-black uppercase tracking-tight text-aceso">
                Verificação em duas etapas
            </h1>
            <p class="mt-2 text-14 text-vidro">
                A conta do admin movimenta dinheiro. O painel só abre com a verificação em duas etapas ativa.
            </p>

            <p v-if="erro" class="mt-4 rounded border border-erro/40 bg-erro/10 px-3 py-2 text-14 text-erro" role="alert">
                {{ erro }}
            </p>

            <div v-if="recuperacao.length" class="mt-6">
                <p class="text-14 text-jade">Verificação ativada. Guarde os códigos de recuperação:</p>
                <ul class="mt-3 grid grid-cols-2 gap-2 font-mono text-14 font-tabular">
                    <li v-for="code in recuperacao" :key="code" class="rounded bg-tinta px-2 py-1">{{ code }}</li>
                </ul>
                <button
                    type="button"
                    class="mt-6 w-full rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
                    @click="irParaPainel"
                >
                    Ir para o painel
                </button>
            </div>

            <div v-else-if="pedindoSenha" class="mt-6">
                <label class="block text-14 text-vidro" for="senha">Confirme sua senha para continuar</label>
                <input
                    id="senha"
                    v-model="senha"
                    type="password"
                    autocomplete="current-password"
                    class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-16 text-papel focus:border-aceso focus:outline-none"
                    @keyup.enter="confirmarSenha"
                />
                <button
                    type="button"
                    :disabled="carregando"
                    class="mt-4 w-full rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-60"
                    @click="confirmarSenha"
                >
                    Confirmar senha
                </button>
            </div>

            <div v-else-if="qrSvg" class="mt-6">
                <p class="text-14 text-vidro">1. Escaneie o QR no seu aplicativo autenticador:</p>
                <div class="mt-3 flex justify-center rounded bg-papel p-4" v-html="qrSvg" />
                <p class="mt-4 text-14 text-vidro">2. Digite o código de 6 dígitos gerado:</p>
                <input
                    v-model="codigo"
                    type="text"
                    inputmode="numeric"
                    autocomplete="one-time-code"
                    aria-label="Código do aplicativo autenticador"
                    class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 font-mono text-16 text-papel focus:border-aceso focus:outline-none"
                    @keyup.enter="confirmarCodigo"
                />
                <button
                    type="button"
                    :disabled="carregando"
                    class="mt-4 w-full rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-60"
                    @click="confirmarCodigo"
                >
                    Ativar verificação
                </button>
            </div>

            <div v-else class="mt-6">
                <button
                    type="button"
                    :disabled="carregando"
                    class="w-full rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-60"
                    @click="props.enabled ? carregarQr() : ativar()"
                >
                    Ativar verificação em duas etapas
                </button>
            </div>
        </div>
    </div>
</template>
