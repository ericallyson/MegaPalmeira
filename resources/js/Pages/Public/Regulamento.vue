<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';

const props = defineProps<{
    versao: string;
    rodada: {
        nome: string;
        pctMain: number;
        pctSecond: number;
        pctAdmin: number;
        maxSorteios: number;
        maxCartelasPorPessoa: number;
        politicaSemVencedor: string;
    } | null;
}>();

const pctMain = props.rodada?.pctMain ?? 70;
const pctSecond = props.rodada?.pctSecond ?? 15;
const pctAdmin = props.rodada?.pctAdmin ?? 15;
const maxSorteios = props.rodada?.maxSorteios ?? 15;
const maxCartelas = props.rodada?.maxCartelasPorPessoa ?? 5;
const acumula = props.rodada?.politicaSemVencedor === 'rollover';
</script>

<template>
    <Head title="Regulamento" />
    <div class="min-h-screen bg-tinta text-papel">
        <header class="border-b border-noite">
            <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
                <Link href="/" class="font-display text-16 font-black uppercase tracking-tight text-aceso">
                    Bolão Dez
                </Link>
                <p class="text-14 text-vidro">Regulamento · versão {{ versao }}</p>
            </div>
        </header>

        <main class="mx-auto max-w-3xl px-4 pb-16">
            <h1 class="mt-6 font-display text-28 font-black uppercase tracking-tight">Regulamento</h1>
            <p v-if="rodada" class="mt-1 text-14 text-vidro">Vigente para a rodada "{{ rodada.nome }}".</p>

            <div class="mt-6 space-y-6 text-16 leading-relaxed">
                <section>
                    <h2 class="font-display text-20 font-bold uppercase text-aceso">1. Como funciona</h2>
                    <p class="mt-2">
                        Cada cartela tem 10 dezenas distintas, de 1 a 60, escolhidas pelo apostador. A cada concurso
                        da Mega-Sena lançado pela administração, as dezenas sorteadas "acendem" nas cartelas que as
                        contêm. Dezena acesa nunca apaga, e dezena repetida em concurso posterior não pontua de novo.
                        Ganha o prêmio principal quem acender as 10 dezenas primeiro.
                    </p>
                </section>

                <section>
                    <h2 class="font-display text-20 font-bold uppercase text-aceso">2. Apostas</h2>
                    <ul class="mt-2 list-disc space-y-1 pl-5">
                        <li>A aposta só vale depois do pagamento confirmado dentro do prazo.</li>
                        <li>Apostas são aceitas até o horário de encerramento publicado na página da rodada.</li>
                        <li>
                            Pagamento aprovado depois do encerramento não entra na rodada e é devolvido pela
                            administração.
                        </li>
                        <li>Limite de {{ maxCartelas }} cartelas por pessoa.</li>
                        <li>Cartelas idênticas de pessoas diferentes são permitidas.</li>
                        <li>QR PIX não pago expira e a aposta é cancelada automaticamente.</li>
                    </ul>
                </section>

                <section>
                    <h2 class="font-display text-20 font-bold uppercase text-aceso">3. Premiação</h2>
                    <ul class="mt-2 list-disc space-y-1 pl-5">
                        <li>O pote é a soma de todas as cartelas pagas (mais valores herdados de rodada anterior).</li>
                        <li>{{ pctMain }}% do pote vai para quem fizer 10 pontos.</li>
                        <li>
                            Se mais de uma cartela fechar 10 no mesmo concurso, o prêmio principal é dividido em
                            partes iguais.
                        </li>
                        <li>{{ pctSecond }}% vai para o 2º colocado, apurado no encerramento da rodada.</li>
                        <li>{{ pctAdmin }}% fica com a administração.</li>
                        <li>
                            <strong>Sobras de centavos de qualquer divisão são somadas à parcela da administração.</strong>
                        </li>
                        <li>
                            Se ninguém fizer 10 pontos em até {{ maxSorteios }} concursos,
                            <template v-if="acumula">
                                o prêmio principal acumula para a rodada seguinte e a rodada atual paga apenas o 2º
                                lugar e a administração.
                            </template>
                            <template v-else>
                                o prêmio principal vai para a maior pontuação, aplicando os critérios de desempate.
                            </template>
                        </li>
                        <li>O prêmio é pago pela administração fora do sistema, por PIX, com registro público do pagamento.</li>
                    </ul>
                </section>

                <section>
                    <h2 class="font-display text-20 font-bold uppercase text-aceso">4. Desempate</h2>
                    <p class="mt-2">Em caso de empate em pontos, a ordem de classificação considera, nesta ordem:</p>
                    <ol class="mt-2 list-decimal space-y-1 pl-5">
                        <li>Quem alcançou a pontuação no concurso mais antigo;</li>
                        <li>Quem confirmou o pagamento primeiro;</li>
                        <li>Ordem alfabética do nome.</li>
                    </ol>
                </section>

                <section>
                    <h2 class="font-display text-20 font-bold uppercase text-aceso">5. Correções e auditoria</h2>
                    <p class="mt-2">
                        Se um concurso for lançado com erro, a administração corrige as dezenas, toda a rodada é
                        recalculada desde o primeiro concurso e a correção fica registrada e visível nesta página de
                        acompanhamento. Todas as cartelas pagas são públicas (com telefone mascarado) para conferência
                        de qualquer participante.
                    </p>
                </section>

                <section>
                    <h2 class="font-display text-20 font-bold uppercase text-aceso">6. Idade mínima e dados</h2>
                    <ul class="mt-2 list-disc space-y-1 pl-5">
                        <li>Apostas são permitidas apenas para maiores de 18 anos.</li>
                        <li>
                            Coletamos somente nome e celular (e-mail é opcional), usados para identificar as cartelas
                            e contatar ganhadores. O telefone aparece sempre mascarado em qualquer página pública.
                        </li>
                        <li>Os dados são mantidos por 24 meses após o encerramento e excluídos mediante pedido.</li>
                    </ul>
                </section>

                <section>
                    <h2 class="font-display text-20 font-bold uppercase text-aceso">7. Jogo responsável</h2>
                    <p class="mt-2">
                        Este bolão é entretenimento entre pessoas que se conhecem, não investimento. Aposte apenas o
                        que não fará falta. Se o jogo deixou de ser diversão, procure ajuda.
                    </p>
                </section>
            </div>

            <Link href="/" class="mt-10 inline-block text-14 text-vidro underline">Voltar ao acompanhamento</Link>
        </main>
    </div>
</template>
