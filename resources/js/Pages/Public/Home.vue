<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import Ball from '@/Components/Ball.vue';
import { brl, dataCurta, dataHora } from '@/lib/format';

type RankingItem = {
    position: number;
    betUuid: string;
    displayName: string;
    maskedPhone: string;
    numbers: Array<{ number: number; matchedDrawId: number | null }>;
    hitsCount: number;
};

const props = defineProps<{
    rodada: {
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
    } | null;
    sorteios: Array<{
        id: number;
        concurso: number;
        data: string;
        dezenas: number[];
        corrigidoEm: string | null;
        motivoCorrecao: string | null;
    }>;
    ranking: RankingItem[];
    ganhadores: Array<{ categoria: string; nome: string; valorCents: number }>;
}>();

const busca = ref('');
const buscaCartelas = ref('');

const lider = computed(() => props.ranking[0] ?? null);
const faltam = computed(() => (lider.value ? 10 - lider.value.hitsCount : 10));

const rankingFiltrado = computed(() =>
    props.ranking.filter((item) =>
        item.displayName.toLowerCase().includes(busca.value.toLowerCase()),
    ),
);

const cartelasOrdenadas = computed(() =>
    [...props.ranking]
        .sort((a, b) => a.displayName.localeCompare(b.displayName, 'pt-BR'))
        .filter((item) =>
            item.displayName.toLowerCase().includes(buscaCartelas.value.toLowerCase()),
        ),
);

const ultimoSorteio = computed(() => props.sorteios[0] ?? null);
const sorteiosAnteriores = computed(() => props.sorteios.slice(1));
const correcoes = computed(() => props.sorteios.filter((s) => s.corrigidoEm));

// contador para o encerramento das apostas quando a rodada está aberta
const agora = ref(Date.now());
let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
    timer = setInterval(() => (agora.value = Date.now()), 1000);
});
onUnmounted(() => {
    if (timer) clearInterval(timer);
});

function imprimir() {
    window.print();
}

const contagem = computed(() => {
    if (!props.rodada || props.rodada.status !== 'open') return null;
    const diff = new Date(props.rodada.encerramentoApostas).getTime() - agora.value;
    if (diff <= 0) return 'Apostas encerradas';
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
});
</script>

<template>
    <Head :title="rodada ? rodada.nome : 'Bolão Dez'" />
    <div class="min-h-screen bg-tinta text-papel">
        <header class="border-b border-noite print:hidden">
            <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                <p class="font-display text-16 font-black uppercase tracking-tight text-aceso">Bolão Dez</p>
                <p v-if="rodada" class="text-14 text-vidro">{{ rodada.nome }} · {{ rodada.statusLabel }}</p>
            </div>
        </header>

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
                            size="hero"
                        />
                    </div>
                </div>
            </section>

            <section v-else class="mt-8 rounded-lg bg-noite p-6 print:hidden">
                <p class="text-20 text-vidro">Nenhuma cartela ainda. Seja o primeiro.</p>
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
                            {{ rodada.sorteiosPublicados }}/{{ rodada.maxSorteios }}
                        </p>
                    </template>
                </div>
            </section>

            <!-- últimas dezenas -->
            <section v-if="ultimoSorteio" class="mt-8 print:hidden" aria-labelledby="dezenas-titulo">
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
                <ol class="mt-3 space-y-2">
                    <li
                        v-for="item in rankingFiltrado"
                        :key="item.betUuid"
                        class="rounded-lg bg-noite p-3"
                        :class="item.hitsCount === 9 ? 'border border-aceso/60' : ''"
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
                                size="md"
                            />
                        </div>
                    </li>
                </ol>
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
                    Bolão Dez — {{ rodada.nome }} — cartelas pagas
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
                    Prêmio de 10 pontos: {{ brl(rodada.premioPrincipalCents) }} ({{ rodada.statusLabel.toLowerCase() }}).
                    Sobras de centavos de qualquer divisão vão para a administração.
                </p>
            </footer>
        </main>

        <main v-else class="mx-auto max-w-5xl px-4">
            <div class="mt-16 rounded-lg bg-noite p-8 text-center">
                <p class="font-display text-28 font-black uppercase tracking-tight text-aceso">Bolão Dez</p>
                <p class="mt-3 text-16 text-vidro">
                    Nenhuma rodada em andamento no momento. Volte em breve — a próxima está chegando.
                </p>
            </div>
        </main>
    </div>
</template>
