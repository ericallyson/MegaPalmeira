<script setup lang="ts">
import { onMounted, ref } from 'vue';

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const visivel = ref(false);
let deferido: BeforeInstallPromptEvent | null = null;

onMounted(() => {
    if (localStorage.getItem('bd-install-recusado') === '1') return;

    // conta visitas por sessão: o convite só aparece a partir da segunda
    if (sessionStorage.getItem('bd-visita-contada') !== '1') {
        sessionStorage.setItem('bd-visita-contada', '1');
        const visitas = Number(localStorage.getItem('bd-visitas') ?? '0') + 1;
        localStorage.setItem('bd-visitas', String(visitas));
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferido = e as BeforeInstallPromptEvent;
        if (Number(localStorage.getItem('bd-visitas') ?? '0') >= 2) {
            visivel.value = true;
        }
    });
});

async function instalar() {
    if (!deferido) return;
    visivel.value = false;
    await deferido.prompt();
    deferido = null;
}

function dispensar() {
    visivel.value = false;
    localStorage.setItem('bd-install-recusado', '1');
}
</script>

<template>
    <div
        v-if="visivel"
        class="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-md items-center gap-3 rounded-lg border border-vidro/30 bg-noite p-3 shadow-lg print:hidden"
        role="dialog"
        aria-label="Instalar o aplicativo"
    >
        <p class="flex-1 text-14 text-papel">
            Instale o Bolão Dez na tela inicial e abra o placar num toque.
        </p>
        <button
            type="button"
            class="rounded bg-aceso px-3 py-1.5 font-display text-12 font-bold uppercase text-tinta"
            @click="instalar"
        >
            Instalar
        </button>
        <button
            type="button"
            class="text-14 text-vidro underline"
            @click="dispensar"
        >
            Agora não
        </button>
    </div>
</template>
