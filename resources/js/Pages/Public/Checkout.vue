<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import Ball from '@/Components/Ball.vue';
import { brl } from '@/lib/format';

const props = defineProps<{
    aposta: {
        uuid: string;
        dezenas: number[];
        valorCents: number;
        status: string;
        statusLabel: string;
    };
    rodada: { nome: string };
    pagamento: {
        qrCode: string | null;
        qrCodeBase64: string | null;
        ticketUrl: string | null;
        expiraEm: string | null;
    } | null;
    linkCartelas: string | null;
}>();

const status = ref(props.aposta.status);
const linkCartelas = ref(props.linkCartelas);
const copiado = ref(false);
const agora = ref(Date.now());

let poll: ReturnType<typeof setInterval> | null = null;
let clock: ReturnType<typeof setInterval> | null = null;

const pago = computed(() => status.value === 'paid');
const foraDoPrazo = computed(() => status.value === 'paid_late');
const expirado = computed(() => {
    if (status.value === 'expired') return true;
    if (!props.pagamento?.expiraEm || pago.value || foraDoPrazo.value) return false;
    return new Date(props.pagamento.expiraEm).getTime() <= agora.value;
});

const restante = computed(() => {
    if (!props.pagamento?.expiraEm) return null;
    const diff = new Date(props.pagamento.expiraEm).getTime() - agora.value;
    if (diff <= 0) return '00:00';
    const m = Math.floor(diff / 60_000);
    const s = Math.floor((diff % 60_000) / 1000);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
});

async function verificar() {
    try {
        const resposta = await fetch(`/apostas/${props.aposta.uuid}/status`, {
            headers: { Accept: 'application/json' },
        });
        const dados = await resposta.json();
        status.value = dados.status;
        if (dados.linkCartelas) linkCartelas.value = dados.linkCartelas;
        if (dados.status !== 'awaiting_payment' && poll) clearInterval(poll);
    } catch {
        // rede instável: o próximo tick tenta de novo
    }
}

async function copiar() {
    if (!props.pagamento?.qrCode) return;
    await navigator.clipboard.writeText(props.pagamento.qrCode);
    copiado.value = true;
    setTimeout(() => (copiado.value = false), 2500);
}

function gerarNovoQr() {
    router.post(`/apostas/${props.aposta.uuid}/qr`);
}

onMounted(() => {
    if (status.value === 'awaiting_payment') {
        poll = setInterval(verificar, 3000);
    }
    clock = setInterval(() => (agora.value = Date.now()), 1000);
});

onUnmounted(() => {
    if (poll) clearInterval(poll);
    if (clock) clearInterval(clock);
});
</script>

<template>
    <Head title="Pagar com PIX" />
    <div class="min-h-screen bg-tinta text-papel">
        <header class="bg-papel text-tinta">
            <div class="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
                <Link href="/">
                    <img src="/logoMega.png" alt="MegaPalmeira" class="h-12 w-auto" />
                </Link>
                <p class="text-14 text-noite/70">{{ rodada.nome }}</p>
            </div>
        </header>

        <main class="mx-auto max-w-xl px-4 pb-16">
            <!-- aposta confirmada -->
            <section v-if="pago" class="mt-10 rounded-lg border border-jade/50 bg-noite p-6 text-center" role="status">
                <p class="font-display text-28 font-black uppercase tracking-tight text-jade">Aposta confirmada</p>
                <p class="mt-2 text-16 text-vidro">Sua cartela está valendo. Boa sorte!</p>
                <div class="mt-4 flex flex-wrap justify-center gap-2">
                    <Ball v-for="n in aposta.dezenas" :key="n" :n="n" size="md" />
                </div>
                <a
                    v-if="linkCartelas"
                    :href="linkCartelas"
                    class="mt-6 inline-block rounded bg-jade px-5 py-2.5 font-display text-14 font-bold uppercase text-tinta"
                >
                    Ver minhas cartelas
                </a>
                <p class="mt-3 text-12 text-vidro">
                    Guarde esse link: é o seu acesso às suas cartelas até o fim da rodada.
                </p>
                <Link href="/" class="mt-4 block text-14 text-vidro underline">Acompanhar o bolão</Link>
            </section>

            <!-- pagamento fora do prazo -->
            <section v-else-if="foraDoPrazo" class="mt-10 rounded-lg border border-brasa/50 bg-noite p-6" role="alert">
                <p class="font-display text-20 font-black uppercase text-brasa">Pagamento fora do prazo</p>
                <p class="mt-2 text-14 text-vidro">
                    Seu PIX foi aprovado depois do encerramento das apostas, então a cartela não entrou nesta rodada.
                    O valor será estornado pela administração.
                </p>
            </section>

            <!-- QR expirado -->
            <section v-else-if="expirado" class="mt-10 rounded-lg bg-noite p-6 text-center">
                <p class="font-display text-20 font-black uppercase text-vidro">O QR venceu</p>
                <p class="mt-2 text-14 text-vidro">Sem problema: gere um novo e pague em até 30 minutos.</p>
                <button
                    type="button"
                    class="mt-4 rounded bg-aceso px-5 py-2.5 font-display text-14 font-bold uppercase text-tinta"
                    @click="gerarNovoQr"
                >
                    Gerar novo QR
                </button>
            </section>

            <!-- aguardando pagamento -->
            <section v-else-if="pagamento" class="mt-8">
                <h1 class="font-display text-28 font-black uppercase tracking-tight">Pagar com PIX</h1>
                <p class="mt-1 text-14 text-vidro">
                    Escaneie o QR ou use o copia-e-cola. Assim que o pagamento cair, esta tela confirma sozinha.
                </p>

                <div class="mt-5 rounded-lg bg-noite p-5 text-center">
                    <p class="font-mono text-40 font-tabular text-jade">{{ brl(aposta.valorCents) }}</p>
                    <p v-if="restante" class="mt-1 text-14 text-vidro">
                        QR válido por <span class="font-mono font-tabular text-brasa">{{ restante }}</span>
                    </p>

                    <img
                        v-if="pagamento.qrCodeBase64"
                        :src="`data:image/png;base64,${pagamento.qrCodeBase64}`"
                        alt="QR Code PIX para pagamento"
                        class="mx-auto mt-4 h-56 w-56 rounded bg-papel p-2"
                    />

                    <button
                        type="button"
                        class="mt-4 w-full rounded bg-aceso px-4 py-2.5 font-display text-14 font-bold uppercase text-tinta"
                        @click="copiar"
                    >
                        {{ copiado ? 'Copiado!' : 'Copiar código PIX' }}
                    </button>
                    <p class="mt-2 break-all font-mono text-12 text-vidro">{{ pagamento.qrCode }}</p>
                </div>

                <div class="mt-5 rounded-lg bg-noite p-4">
                    <p class="text-14 text-vidro">Sua cartela:</p>
                    <div class="mt-2 flex flex-wrap gap-1.5">
                        <Ball v-for="n in aposta.dezenas" :key="n" :n="n" size="md" />
                    </div>
                </div>

                <p class="mt-4 text-center text-14 text-vidro" role="status">
                    Aguardando confirmação do pagamento…
                </p>
            </section>

            <!-- sem pagamento gerado (falha na criação do QR) -->
            <section v-else class="mt-10 rounded-lg bg-noite p-6 text-center">
                <p class="text-16 text-vidro">Não conseguimos gerar o QR do PIX.</p>
                <button
                    type="button"
                    class="mt-4 rounded bg-aceso px-5 py-2.5 font-display text-14 font-bold uppercase text-tinta"
                    @click="gerarNovoQr"
                >
                    Tentar de novo
                </button>
            </section>
        </main>
    </div>
</template>
