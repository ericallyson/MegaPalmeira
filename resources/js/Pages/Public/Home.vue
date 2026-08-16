<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import Ball from '@/Components/Ball.vue';
import InstallPrompt from '@/Components/InstallPrompt.vue';
import { brl, dataCurta, dataHora } from '@/lib/format';

type RankingItem = {
    position: number;
    betUuid: string;
    displayName: string;
    maskedPhone: string;
    numbers: Array<{ number: number; matchedDrawId: number | null }>;
    hitsCount: number;
};

type Sorteio = {
    id: number;
    concurso: number;
    data: string;
    dezenas: number[];
    corrigidoEm: string | null;
    motivoCorrecao: string | null;
};

type Rodada = {
    uuid: string;
    nome: string;
    status: string;
    statusLabel: string;
    poteCents: number;
    premioPrincipalCents: number;
    valorCartelaCents: number;
    cartelasPagas: number;
    encerramentoApostas: string;
    sorteiosPublicados: number;
    maxSorteios: number;
    rolloverCents: number;
    encerradaEm: string | null;
};

type Snapshot = {
    rodada: Rodada;
    sorteios: Sorteio[];
    ranking: RankingItem[];
    ganhadores: Array<{ categoria: string; nome: string; valorCents: number }>;
    sorteio?: { id: number; concurso: number; data: string; dezenas: number[] };
};

const props = defineProps<{
    rodada: Rodada | null;
    sorteios: Sorteio[];
    ranking: RankingItem[];
    ganhadores: Array<{ categoria: string; nome: string; valorCents: number }>;
}>();

// Estado vivo: começa com os props e passa a ser alimentado pelo socket.
const rodada = ref<Rodada | null>(props.rodada);
const sorteios = ref<Sorteio[]>([...props.sorteios]);
const ranking = ref<RankingItem[]>(props.ranking.map((r) => ({ ...r, numbers: r.numbers.map((n) => ({ ...n })) })));
const ganhadores = ref([...props.ganhadores]);

const busca = ref('');
const buscaCartelas = ref('');

// ---- o acendimento ----
const aoVivo = ref<{ concurso: number; data: string; dezenas: number[] } | null>(null);
const recemAcesas = ref<Set<string>>(new Set());
const subiram = ref<Set<string>>(new Set());
const cartelaCampea = ref<RankingItem | null>(null);
const timeouts: Array<ReturnType<typeof setTimeout>> = [];

const reduzMovimento = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function aplicarSnapshot(payload: Snapshot) {
    rodada.value = payload.rodada;
    sorteios.value = payload.sorteios;
    ranking.value = payload.ranking;
    ganhadores.value = payload.ganhadores;
}

function acendimento(payload: Snapshot) {
    const sorteio = payload.sorteio;

    if (!sorteio || reduzMovimento()) {
        aplicarSnapshot(payload);
        return;
    }

    const posicaoAntiga = new Map(ranking.value.map((r) => [r.betUuid, r.position]));
    aoVivo.value = { concurso: sorteio.concurso, data: sorteio.data, dezenas: [] };

    sorteio.dezenas.forEach((dezena, i) => {
        timeouts.push(
            setTimeout(() => {
                // 1. a dezena entra no topo com bloom
                aoVivo.value?.dezenas.push(dezena);

                // 2. todas as cartelas que a contêm acendem ao mesmo tempo
                for (const item of ranking.value) {
                    const bola = item.numbers.find(
                        (n) => n.number === dezena && n.matchedDrawId === null,
                    );
                    if (bola) {
                        bola.matchedDrawId = sorteio.id;
                        item.hitsCount += 1;
                        recemAcesas.value.add(`${item.betUuid}:${dezena}`);
                    }
                }
                recemAcesas.value = new Set(recemAcesas.value);
            }, i * 400),
        );
    });

    const aposDezenas = sorteio.dezenas.length * 400 + 700;

    // 3. o ranking re-ordena com FLIP e quem subiu ganha realce
    timeouts.push(
        setTimeout(() => {
            aplicarSnapshot(payload);
            aoVivo.value = null;

            const sobem = new Set<string>();
            for (const item of payload.ranking) {
                const antes = posicaoAntiga.get(item.betUuid);
                if (antes !== undefined && item.position < antes) sobem.add(item.betUuid);
            }
            subiram.value = sobem;
            timeouts.push(setTimeout(() => (subiram.value = new Set()), 2000));
            timeouts.push(setTimeout(() => (recemAcesas.value = new Set()), 1300));

            // 4. quem fechou 10 vai para tela cheia por 4s
            const campea = payload.ranking.find((r) => r.hitsCount === 10);
            if (campea) {
                cartelaCampea.value = campea;
                timeouts.push(setTimeout(() => (cartelaCampea.value = null), 4000));
            }
        }, aposDezenas),
    );
}

// ---- socket + fallback: o placar nunca fica mudo ----
let pollTimer: ReturnType<typeof setInterval> | null = null;

async function pollFallback() {
    try {
        const resposta = await fetch('/api/rodada-atual/ranking', {
            headers: { Accept: 'application/json' },
        });
        const dados = await resposta.json();
        if (dados.rodada) aplicarSnapshot(dados);
    } catch {
        // sem rede: o próximo tick tenta de novo
    }
}

let sairDoCanal: (() => void) | null = null;

onMounted(async () => {
    if (!props.rodada) return;

    const canal = `rodada.${props.rodada.uuid}`;

    // pusher-js é pesado: carrega depois da primeira pintura
    let conectado: (() => boolean) | null = null;

    try {
        const { getEcho, socketConectado } = await import('@/lib/echo');
        conectado = socketConectado;
        getEcho()
            .channel(canal)
            .listen('.sorteio.publicado', (payload: Snapshot) => acendimento(payload));
        sairDoCanal = () => getEcho().leaveChannel(canal);
    } catch {
        // Echo indisponível: cai direto para o polling
    }

    timeouts.push(
        setTimeout(() => {
            if (!(conectado?.() ?? false) && pollTimer === null) {
                pollTimer = setInterval(pollFallback, 15000);
            }
        }, 5000),
    );
});

onUnmounted(() => {
    timeouts.forEach(clearTimeout);
    if (pollTimer) clearInterval(pollTimer);
    try {
        sairDoCanal?.();
    } catch {
        // já desconectado
    }
});

// ---- derivados de exibição ----
const lider = computed(() => ranking.value[0] ?? null);
const faltam = computed(() => (lider.value ? 10 - lider.value.hitsCount : 10));

const rankingFiltrado = computed(() =>
    ranking.value.filter((item) =>
        item.displayName.toLowerCase().includes(busca.value.toLowerCase()),
    ),
);

const cartelasOrdenadas = computed(() =>
    [...ranking.value]
        .sort((a, b) => a.displayName.localeCompare(b.displayName, 'pt-BR'))
        .filter((item) =>
            item.displayName.toLowerCase().includes(buscaCartelas.value.toLowerCase()),
        ),
);

const ultimoSorteio = computed(() => sorteios.value[0] ?? null);
const sorteiosAnteriores = computed(() => sorteios.value.slice(1));
const correcoes = computed(() => sorteios.value.filter((s) => s.corrigidoEm));

function imprimir() {
    window.print();
}

// offline: o placar avisa que pode estar desatualizado
const offline = ref(false);
const marcarOffline = () => (offline.value = true);
const marcarOnline = () => (offline.value = false);

onMounted(() => {
    offline.value = !navigator.onLine;
    window.addEventListener('offline', marcarOffline);
    window.addEventListener('online', marcarOnline);
});
onUnmounted(() => {
    window.removeEventListener('offline', marcarOffline);
    window.removeEventListener('online', marcarOnline);
});

function recarregar() {
    window.location.reload();
}

// contador para o encerramento das apostas quando a rodada está aberta
const agora = ref(Date.now());
let clock: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
    clock = setInterval(() => (agora.value = Date.now()), 1000);
});
onUnmounted(() => {
    if (clock) clearInterval(clock);
});

const contagem = computed(() => {
    if (!rodada.value || rodada.value.status !== 'open') return null;
    const diff = new Date(rodada.value.encerramentoApostas).getTime() - agora.value;
    if (diff <= 0) return 'Apostas encerradas';
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
});
</script>

<template>
    <Head :title="rodada ? rodada.nome : 'MegaPalmeira'" />
    <div class="min-h-screen bg-tinta text-papel">
        <!-- 4. cartela campeã em tela cheia -->
        <div
            v-if="cartelaCampea"
            class="fixed inset-0 z-50 flex items-center justify-center bg-tinta/95 px-4"
            role="alertdialog"
            aria-label="Cartela campeã"
        >
            <div class="text-center">
                <p class="font-display text-72 font-black uppercase leading-none tracking-tight text-aceso">
                    Fechou!
                </p>
                <p class="mt-4 text-28">{{ cartelaCampea.displayName }}</p>
                <p class="font-mono text-14 font-tabular text-vidro">{{ cartelaCampea.maskedPhone }}</p>
                <div class="mt-6 flex flex-wrap justify-center gap-2">
                    <Ball v-for="n in cartelaCampea.numbers" :key="n.number" :n="n.number" lit size="hero" />
                </div>
            </div>
        </div>

        <div
            v-if="offline"
            class="border-b border-brasa/50 bg-brasa/10 px-4 py-2 text-center text-14 text-brasa print:hidden"
            role="alert"
        >
            Você está offline — o placar pode estar desatualizado.
            <button type="button" class="ml-2 underline" @click="recarregar">Recarregar</button>
        </div>

        <header class="border-b border-noite print:hidden">
            <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                <img src="/logoMega.png" alt="MegaPalmeira" class="h-9 w-auto" />
                <p v-if="rodada" class="text-14 text-vidro">{{ rodada.nome }} · {{ rodada.statusLabel }}</p>
            </div>
        </header>

        <InstallPrompt />

        <main v-if="rodada" class="mx-auto max-w-5xl px-4 pb-16">
            <!-- aviso de correção -->
            <p
                v-for="s in correcoes"
                :key="`corr-${s.id}`"
                class="mt-4 rounded border border-brasa/50 bg-brasa/10 px-3 py-2 text-14 text-brasa print:hidden"
                role="status"
            >
                Concurso {{ s.concurso }} corrigido em {{ dataHora(s.corrigidoEm!) }}: {{ s.motivoCorrecao }}
            </p>

            <!-- sorteio entrando ao vivo -->
            <section
                v-if="aoVivo"
                class="mt-6 rounded-lg border border-aceso/60 bg-noite p-4 print:hidden"
                aria-live="polite"
                aria-label="Sorteio sendo publicado agora"
            >
                <p class="text-14 text-vidro">
                    Saiu o concurso <span class="font-mono font-tabular text-papel">{{ aoVivo.concurso }}</span>…
                </p>
                <div class="mt-3 flex min-h-12 flex-wrap gap-2">
                    <Ball
                        v-for="n in aoVivo.dezenas"
                        :key="n"
                        :n="n"
                        lit
                        bloom
                        size="hero"
                        :contest="aoVivo.concurso"
                    />
                </div>
            </section>

            <!-- hero: quem está mais perto -->
            <section v-if="lider" class="mt-8 print:hidden" aria-labelledby="hero-titulo">
                <h1 id="hero-titulo" class="text-14 uppercase tracking-wide text-vidro">
                    {{ rodada.status === 'closed' ? 'Cartela campeã' : 'Quem está mais perto' }}
                </h1>
                <div class="mt-3 rounded-lg bg-noite p-5">
                    <div class="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p class="font-display text-28 font-black uppercase tracking-tight">
                                {{ lider.displayName }}
                            </p>
                            <p class="font-mono text-14 font-tabular text-vidro">{{ lider.maskedPhone }}</p>
                        </div>
                        <p
                            v-if="faltam > 0"
                            class="font-display text-72 font-black uppercase leading-none tracking-tight text-aceso"
                        >
                            faltam {{ faltam }}
                        </p>
                        <p v-else class="font-display text-72 font-black uppercase leading-none text-aceso">
                            fechou!
                        </p>
                    </div>
                    <div class="mt-4 grid grid-cols-5 gap-2 sm:flex sm:flex-wrap">
                        <Ball
                            v-for="n in lider.numbers"
                            :key="n.number"
                            :n="n.number"
                            :lit="n.matchedDrawId !== null"
                            :just-lit="recemAcesas.has(`${lider.betUuid}:${n.number}`)"
                            size="hero"
                        />
                    </div>
                </div>
            </section>

            <section v-else class="mt-8 rounded-lg bg-noite p-6 print:hidden">
                <p class="text-20 text-vidro">Nenhuma cartela ainda. Seja o primeiro.</p>
            </section>

            <!-- chamada para apostar -->
            <section v-if="rodada.status === 'open'" class="mt-6 print:hidden">
                <Link
                    href="/apostar"
                    class="block rounded-lg bg-aceso px-6 py-4 text-center font-display text-20 font-black uppercase tracking-tight text-tinta"
                >
                    Fazer minha aposta · {{ brl(rodada.valorCartelaCents) }}
                </Link>
            </section>

            <!-- ganhadores (rodada encerrada) -->
            <section v-if="ganhadores.length" class="mt-6 rounded-lg border border-jade/40 bg-noite p-4 print:hidden">
                <h2 class="font-display text-16 font-bold uppercase text-jade">Premiação</h2>
                <ul class="mt-2 space-y-1 text-14">
                    <li v-for="(g, i) in ganhadores" :key="i" class="flex justify-between gap-4">
                        <span>{{ g.categoria }} — {{ g.nome }}</span>
                        <span class="font-mono font-tabular text-jade">{{ brl(g.valorCents) }}</span>
                    </li>
                </ul>
            </section>

            <!-- barra de estado -->
            <section class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 print:hidden" aria-label="Resumo da rodada">
                <div class="rounded-lg bg-noite p-4">
                    <p class="text-12 uppercase text-vidro">Pote</p>
                    <p class="mt-1 font-mono text-20 font-tabular text-jade">{{ brl(rodada.poteCents) }}</p>
                    <p v-if="rodada.rolloverCents > 0" class="text-12 text-vidro">
                        inclui {{ brl(rodada.rolloverCents) }} da rodada anterior
                    </p>
                </div>
                <div class="rounded-lg bg-noite p-4">
                    <p class="text-12 uppercase text-vidro">Prêmio de 10 pontos</p>
                    <p class="mt-1 font-mono text-20 font-tabular text-aceso">{{ brl(rodada.premioPrincipalCents) }}</p>
                </div>
                <div class="rounded-lg bg-noite p-4">
                    <p class="text-12 uppercase text-vidro">Cartelas</p>
                    <p class="mt-1 font-mono text-20 font-tabular">{{ rodada.cartelasPagas }}</p>
                    <p class="text-12 text-vidro">{{ brl(rodada.valorCartelaCents) }} cada</p>
                </div>
                <div class="rounded-lg bg-noite p-4">
                    <template v-if="rodada.status === 'open'">
                        <p class="text-12 uppercase text-vidro">Apostas encerram em</p>
                        <p class="mt-1 font-mono text-20 font-tabular text-brasa">{{ contagem }}</p>
                    </template>
                    <template v-else>
                        <p class="text-12 uppercase text-vidro">Sorteios</p>
                        <p class="mt-1 font-mono text-20 font-tabular">
                            {{ rodada.sorteiosPublicados }}<template v-if="rodada.maxSorteios > 0">/{{ rodada.maxSorteios }}</template>
                        </p>
                        <p v-if="rodada.maxSorteios === 0" class="text-12 text-vidro">até alguém ganhar</p>
                    </template>
                </div>
            </section>

            <!-- últimas dezenas -->
            <section v-if="ultimoSorteio && !aoVivo" class="mt-8 print:hidden" aria-labelledby="dezenas-titulo">
                <h2 id="dezenas-titulo" class="text-14 uppercase tracking-wide text-vidro">Últimas dezenas</h2>
                <div class="mt-3 rounded-lg bg-noite p-4">
                    <p class="text-14 text-vidro">
                        Concurso <span class="font-mono font-tabular text-papel">{{ ultimoSorteio.concurso }}</span>
                        · {{ dataCurta(ultimoSorteio.data + 'T12:00:00') }}
                    </p>
                    <div class="mt-3 flex flex-wrap gap-2">
                        <Ball
                            v-for="n in ultimoSorteio.dezenas"
                            :key="n"
                            :n="n"
                            lit
                            size="hero"
                            :contest="ultimoSorteio.concurso"
                        />
                    </div>
                </div>
                <div v-if="sorteiosAnteriores.length" class="mt-2 flex gap-2 overflow-x-auto pb-2">
                    <div
                        v-for="s in sorteiosAnteriores"
                        :key="s.id"
                        class="shrink-0 rounded-lg bg-noite px-3 py-2"
                    >
                        <p class="text-12 text-vidro">
                            {{ s.concurso }} · {{ dataCurta(s.data + 'T12:00:00') }}
                        </p>
                        <p class="mt-1 font-mono text-14 font-tabular">
                            {{ s.dezenas.map((n) => String(n).padStart(2, '0')).join(' ') }}
                        </p>
                    </div>
                </div>
            </section>

            <!-- ranking -->
            <section v-if="ranking.length" class="mt-8 print:hidden" aria-labelledby="ranking-titulo">
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <h2 id="ranking-titulo" class="text-14 uppercase tracking-wide text-vidro">Ranking</h2>
                    <input
                        v-model="busca"
                        type="search"
                        placeholder="Buscar por nome"
                        aria-label="Buscar cartela por nome"
                        class="rounded border border-vidro/30 bg-noite px-3 py-1.5 text-14 focus:border-aceso focus:outline-none"
                    />
                </div>
                <TransitionGroup tag="ol" name="fila" class="mt-3 space-y-2">
                    <li
                        v-for="item in rankingFiltrado"
                        :key="item.betUuid"
                        class="rounded-lg bg-noite p-3"
                        :class="{
                            'border border-aceso/60': item.hitsCount === 9,
                            'destaque-subiu': subiram.has(item.betUuid),
                        }"
                    >
                        <div class="flex flex-wrap items-center gap-3">
                            <span class="w-8 font-mono text-14 font-tabular text-vidro">{{ item.position }}º</span>
                            <span class="text-16">{{ item.displayName }}</span>
                            <span class="font-mono text-12 font-tabular text-vidro">{{ item.maskedPhone }}</span>
                            <span
                                v-if="item.hitsCount === 9"
                                class="rounded bg-aceso/15 px-2 py-0.5 text-12 font-bold uppercase text-aceso"
                            >
                                um número
                            </span>
                            <span class="ml-auto font-mono text-16 font-tabular" :class="item.hitsCount >= 9 ? 'text-aceso' : ''">
                                {{ item.hitsCount }} pts
                            </span>
                        </div>
                        <div class="mt-2 flex flex-wrap gap-1.5">
                            <Ball
                                v-for="n in item.numbers"
                                :key="n.number"
                                :n="n.number"
                                :lit="n.matchedDrawId !== null"
                                :just-lit="recemAcesas.has(`${item.betUuid}:${n.number}`)"
                                size="md"
                            />
                        </div>
                    </li>
                </TransitionGroup>
            </section>

            <!-- todas as cartelas pagas (lista densa, imprimível) -->
            <section v-if="ranking.length" class="mt-8" aria-labelledby="cartelas-titulo">
                <div class="flex flex-wrap items-center justify-between gap-3 print:hidden">
                    <h2 id="cartelas-titulo" class="text-14 uppercase tracking-wide text-vidro">
                        Todas as cartelas pagas ({{ ranking.length }})
                    </h2>
                    <div class="flex items-center gap-2">
                        <input
                            v-model="buscaCartelas"
                            type="search"
                            placeholder="Buscar"
                            aria-label="Buscar na lista de cartelas"
                            class="rounded border border-vidro/30 bg-noite px-3 py-1.5 text-14 focus:border-aceso focus:outline-none"
                        />
                        <button
                            type="button"
                            class="rounded border border-vidro/40 px-3 py-1.5 text-14 text-vidro hover:text-papel"
                            @click="imprimir"
                        >
                            Imprimir
                        </button>
                    </div>
                </div>
                <h2 class="hidden font-display text-20 font-black uppercase print:block">
                    MegaPalmeira — {{ rodada.nome }} — cartelas pagas
                </h2>
                <ul class="mt-3 divide-y divide-vidro/10 rounded-lg bg-noite px-4 font-mono text-14 font-tabular print:divide-black/20 print:bg-papel print:text-black">
                    <li v-for="item in cartelasOrdenadas" :key="`lista-${item.betUuid}`" class="py-2">
                        {{ item.displayName }} — {{ item.maskedPhone }} —
                        {{ item.numbers.map((n) => String(n.number).padStart(2, '0')).join(' ') }}
                    </li>
                </ul>
            </section>

            <!-- rodapé -->
            <footer class="mt-12 border-t border-noite pt-6 text-14 text-vidro print:hidden">
                <p>
                    Jogo é entretenimento: aposte com responsabilidade e somente se tiver 18 anos ou mais.
                </p>
                <p class="mt-2">
                    <Link href="/regulamento" class="underline">Regulamento</Link>
                    · Sobras de centavos de qualquer divisão vão para a administração.
                </p>
            </footer>
        </main>

        <main v-else class="mx-auto max-w-5xl px-4">
            <div class="mt-16 rounded-lg bg-noite p-8 text-center">
                <img src="/logoMega.png" alt="MegaPalmeira" class="mx-auto h-16 w-auto" />
                <p class="mt-3 text-16 text-vidro">
                    Nenhuma rodada em andamento no momento. Volte em breve — a próxima está chegando.
                </p>
            </div>
        </main>
    </div>
</template>
