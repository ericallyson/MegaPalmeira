<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { brl, dezena } from '@/lib/format';

defineProps<{
    rodadaUuid: string;
    relatorio: {
        identificacao: {
            nome: string;
            slug: string;
            status: string;
            inicio: string;
            encerradaEm: string | null;
            numeroDeSorteios: number;
            versaoRegulamento: string;
        };
        financeiro: {
            cartelasPagas: number;
            valorCartelaCents: number;
            arrecadacaoCents: number;
            rolloverEntradaCents: number;
            poteCents: number;
            premioPrincipalPagoCents: number;
            premioSegundoPagoCents: number;
            totalPagoCents: number;
            rolloverSaidaCents: number;
            administracaoCents: number;
            sobraCents: number;
            conferenciaFecha: boolean;
        };
        baixas: {
            automaticas: { quantidade: number; valorCents: number };
            manuais: { quantidade: number; valorCents: number };
            porVendedor: Array<{
                nome: string;
                slug: string | null;
                apostasPagas: number;
                baixasAutomaticas: number;
                baixasManuais: number;
                arrecadacaoCents: number;
                comissaoPct: number;
                comissaoCents: number;
            }>;
        };
        ganhadores: Array<{
            categoria: string;
            nome: string;
            telefone: string;
            cartela: number[];
            sorteioFechamento: number | null;
            cotaCents: number;
            pagoEm: string | null;
            observacoes: string | null;
        }>;
        classificacao: Array<{
            posicao: number;
            nome: string;
            telefone: string;
            pontos: number;
            dezenas: number[];
        }>;
        sorteios: Array<{
            sequencia: number;
            concurso: number;
            data: string;
            dezenas: number[];
            cartelasQuePontuaram: number;
            corrigidoEm: string | null;
            motivoCorrecao: string | null;
        }>;
        auditoria: Array<{
            tipo: string;
            alvo: string;
            motivo: string;
            responsavel: string | null;
            quando: string;
        }>;
    };
    hash: string;
}>();

function imprimir() {
    window.print();
}
</script>

<template>
    <Head :title="`Relatório — ${relatorio.identificacao.nome}`" />
    <!-- documento, não painel: paleta papel -->
    <div class="min-h-screen bg-papel font-sans text-tinta">
        <header class="border-b border-tinta/15 print:hidden">
            <div class="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-6 py-4">
                <Link :href="`/admin/rodadas/${rodadaUuid}`" class="text-14 underline">← Voltar à rodada</Link>
                <div class="flex gap-2">
                    <a
                        :href="`/admin/rodadas/${rodadaUuid}/relatorio.csv`"
                        class="rounded border border-tinta/30 px-4 py-2 font-display text-14 font-bold uppercase"
                    >
                        Baixar CSV
                    </a>
                    <button
                        type="button"
                        class="rounded bg-tinta px-4 py-2 font-display text-14 font-bold uppercase text-papel"
                        @click="imprimir"
                    >
                        Imprimir / PDF
                    </button>
                </div>
            </div>
        </header>

        <main class="mx-auto max-w-4xl px-6 py-8">
            <h1 class="font-display text-28 font-black uppercase tracking-tight">
                Relatório de fechamento
            </h1>

            <!-- 1. identificação -->
            <section class="mt-4 text-14 leading-relaxed">
                <p><strong>Rodada:</strong> {{ relatorio.identificacao.nome }} ({{ relatorio.identificacao.status }})</p>
                <p>
                    <strong>Período:</strong> {{ relatorio.identificacao.inicio }} a
                    {{ relatorio.identificacao.encerradaEm ?? '—' }}
                    · <strong>Sorteios:</strong> {{ relatorio.identificacao.numeroDeSorteios }}
                    · <strong>Regulamento:</strong> versão {{ relatorio.identificacao.versaoRegulamento }}
                </p>
            </section>

            <!-- 2. financeiro -->
            <section class="mt-8">
                <h2 class="border-b border-tinta/20 pb-1 font-display text-16 font-bold uppercase">Financeiro</h2>
                <table class="mt-3 w-full text-14">
                    <tbody>
                        <tr>
                            <td class="py-1">Cartelas pagas</td>
                            <td class="py-1 text-right font-mono font-tabular">
                                {{ relatorio.financeiro.cartelasPagas }} × {{ brl(relatorio.financeiro.valorCartelaCents) }}
                                = {{ brl(relatorio.financeiro.arrecadacaoCents) }}
                            </td>
                        </tr>
                        <tr v-if="relatorio.financeiro.rolloverEntradaCents > 0">
                            <td class="py-1">Valor herdado da rodada anterior</td>
                            <td class="py-1 text-right font-mono font-tabular">{{ brl(relatorio.financeiro.rolloverEntradaCents) }}</td>
                        </tr>
                        <tr class="border-t border-tinta/10 font-bold">
                            <td class="py-1">Pote</td>
                            <td class="py-1 text-right font-mono font-tabular">{{ brl(relatorio.financeiro.poteCents) }}</td>
                        </tr>
                        <tr>
                            <td class="py-1">Prêmio principal pago</td>
                            <td class="py-1 text-right font-mono font-tabular">{{ brl(relatorio.financeiro.premioPrincipalPagoCents) }}</td>
                        </tr>
                        <tr>
                            <td class="py-1">2º lugar pago</td>
                            <td class="py-1 text-right font-mono font-tabular">{{ brl(relatorio.financeiro.premioSegundoPagoCents) }}</td>
                        </tr>
                        <tr v-if="relatorio.financeiro.rolloverSaidaCents > 0">
                            <td class="py-1">Acumulado para a próxima rodada</td>
                            <td class="py-1 text-right font-mono font-tabular">{{ brl(relatorio.financeiro.rolloverSaidaCents) }}</td>
                        </tr>
                        <tr>
                            <td class="py-1">
                                Administração
                                <span class="text-tinta/60">(inclui {{ brl(relatorio.financeiro.sobraCents) }} de sobras de divisão)</span>
                            </td>
                            <td class="py-1 text-right font-mono font-tabular">{{ brl(relatorio.financeiro.administracaoCents) }}</td>
                        </tr>
                        <tr class="border-t border-tinta/20 font-bold">
                            <td class="py-1">Conferência de fechamento</td>
                            <td class="py-1 text-right" :class="relatorio.financeiro.conferenciaFecha ? '' : 'text-erro'">
                                {{ relatorio.financeiro.conferenciaFecha ? 'FECHA EXATA' : 'NÃO FECHA — investigar' }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <!-- 3. baixas / prestação de contas -->
            <section class="mt-8">
                <h2 class="border-b border-tinta/20 pb-1 font-display text-16 font-bold uppercase">
                    Baixas — prestação de contas
                </h2>
                <table class="mt-3 w-full text-14">
                    <tbody>
                        <tr>
                            <td class="py-1">Baixas automáticas (PIX)</td>
                            <td class="py-1 text-right font-mono font-tabular">
                                {{ relatorio.baixas.automaticas.quantidade }} · {{ brl(relatorio.baixas.automaticas.valorCents) }}
                            </td>
                        </tr>
                        <tr class="border-b border-tinta/10">
                            <td class="py-1">Baixas manuais</td>
                            <td class="py-1 text-right font-mono font-tabular">
                                {{ relatorio.baixas.manuais.quantidade }} · {{ brl(relatorio.baixas.manuais.valorCents) }}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <h3 class="mt-4 font-display text-14 font-bold uppercase text-tinta/70">Por vendedor</h3>
                <p v-if="relatorio.baixas.porVendedor.length === 0" class="mt-2 text-14 text-tinta/60">
                    Nenhuma aposta paga nesta rodada.
                </p>
                <table v-else class="mt-2 w-full text-left text-14">
                    <thead>
                        <tr class="border-b border-tinta/10 text-12 uppercase text-tinta/60">
                            <th class="py-1 pr-2">Vendedor</th>
                            <th class="py-1 pr-2 text-right">Pagas</th>
                            <th class="py-1 pr-2 text-right">Autom.</th>
                            <th class="py-1 pr-2 text-right">Manuais</th>
                            <th class="py-1 pr-2 text-right">Arrecadação</th>
                            <th class="py-1 pr-2 text-right">Comissão</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(v, i) in relatorio.baixas.porVendedor" :key="i" class="border-b border-tinta/5">
                            <td class="py-1.5 pr-2">{{ v.nome }}</td>
                            <td class="py-1.5 pr-2 text-right font-mono font-tabular">{{ v.apostasPagas }}</td>
                            <td class="py-1.5 pr-2 text-right font-mono font-tabular">{{ v.baixasAutomaticas }}</td>
                            <td class="py-1.5 pr-2 text-right font-mono font-tabular">{{ v.baixasManuais }}</td>
                            <td class="py-1.5 pr-2 text-right font-mono font-tabular">{{ brl(v.arrecadacaoCents) }}</td>
                            <td class="py-1.5 pr-2 text-right font-mono font-tabular">
                                {{ brl(v.comissaoCents) }}
                                <span class="text-tinta/50">({{ v.comissaoPct }}%)</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <!-- 4. ganhadores -->
            <section class="mt-8">
                <h2 class="border-b border-tinta/20 pb-1 font-display text-16 font-bold uppercase">Ganhadores</h2>
                <p v-if="relatorio.ganhadores.length === 0" class="mt-2 text-14 text-tinta/60">
                    Nenhum prêmio pago nesta rodada.
                </p>
                <table v-else class="mt-3 w-full text-left text-14">
                    <thead>
                        <tr class="border-b border-tinta/10 text-12 uppercase text-tinta/60">
                            <th class="py-1 pr-2">Categoria</th>
                            <th class="py-1 pr-2">Nome</th>
                            <th class="py-1 pr-2">Telefone</th>
                            <th class="py-1 pr-2">Cartela</th>
                            <th class="py-1 pr-2">Fechou no</th>
                            <th class="py-1 pr-2 text-right">Cota</th>
                            <th class="py-1">Pagamento</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(g, i) in relatorio.ganhadores" :key="i" class="border-b border-tinta/5 align-top">
                            <td class="py-1.5 pr-2">{{ g.categoria }}</td>
                            <td class="py-1.5 pr-2">{{ g.nome }}</td>
                            <td class="py-1.5 pr-2 font-mono text-12 font-tabular">{{ g.telefone }}</td>
                            <td class="py-1.5 pr-2 font-mono text-12 font-tabular">{{ g.cartela.map(dezena).join(' ') }}</td>
                            <td class="py-1.5 pr-2 font-mono font-tabular">{{ g.sorteioFechamento ?? '—' }}</td>
                            <td class="py-1.5 pr-2 text-right font-mono font-tabular">{{ brl(g.cotaCents) }}</td>
                            <td class="py-1.5">
                                {{ g.pagoEm ? `pago em ${g.pagoEm}` : 'a pagar' }}
                                <span v-if="g.observacoes" class="text-tinta/60"> · {{ g.observacoes }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <!-- 4. classificação -->
            <section class="mt-8">
                <h2 class="border-b border-tinta/20 pb-1 font-display text-16 font-bold uppercase">
                    Classificação completa
                </h2>
                <table class="mt-3 w-full text-left text-14">
                    <thead>
                        <tr class="border-b border-tinta/10 text-12 uppercase text-tinta/60">
                            <th class="py-1 pr-2">#</th>
                            <th class="py-1 pr-2">Nome</th>
                            <th class="py-1 pr-2">Telefone</th>
                            <th class="py-1 pr-2">Pts</th>
                            <th class="py-1">Cartela</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="c in relatorio.classificacao" :key="c.posicao" class="border-b border-tinta/5">
                            <td class="py-1 pr-2 font-mono font-tabular">{{ c.posicao }}º</td>
                            <td class="py-1 pr-2">{{ c.nome }}</td>
                            <td class="py-1 pr-2 font-mono text-12 font-tabular">{{ c.telefone }}</td>
                            <td class="py-1 pr-2 font-mono font-tabular">{{ c.pontos }}</td>
                            <td class="py-1 font-mono text-12 font-tabular">{{ c.dezenas.map(dezena).join(' ') }}</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <!-- 5. sorteios -->
            <section class="mt-8">
                <h2 class="border-b border-tinta/20 pb-1 font-display text-16 font-bold uppercase">
                    Histórico de sorteios
                </h2>
                <table class="mt-3 w-full text-left text-14">
                    <thead>
                        <tr class="border-b border-tinta/10 text-12 uppercase text-tinta/60">
                            <th class="py-1 pr-2">Ordem</th>
                            <th class="py-1 pr-2">Concurso</th>
                            <th class="py-1 pr-2">Data</th>
                            <th class="py-1 pr-2">Dezenas</th>
                            <th class="py-1">Cartelas que pontuaram</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="s in relatorio.sorteios" :key="s.sequencia" class="border-b border-tinta/5">
                            <td class="py-1 pr-2 font-mono font-tabular">{{ s.sequencia }}º</td>
                            <td class="py-1 pr-2 font-mono font-tabular">{{ s.concurso }}</td>
                            <td class="py-1 pr-2 font-mono text-12 font-tabular">{{ s.data }}</td>
                            <td class="py-1 pr-2 font-mono text-12 font-tabular">
                                {{ s.dezenas.map(dezena).join(' ') }}
                                <span v-if="s.corrigidoEm" class="text-erro">(corrigido: {{ s.motivoCorrecao }})</span>
                            </td>
                            <td class="py-1 font-mono font-tabular">{{ s.cartelasQuePontuaram }}</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <!-- 6. auditoria -->
            <section class="mt-8">
                <h2 class="border-b border-tinta/20 pb-1 font-display text-16 font-bold uppercase">Auditoria</h2>
                <p v-if="relatorio.auditoria.length === 0" class="mt-2 text-14 text-tinta/60">
                    Nenhuma intervenção manual nesta rodada.
                </p>
                <table v-else class="mt-3 w-full text-left text-14">
                    <thead>
                        <tr class="border-b border-tinta/10 text-12 uppercase text-tinta/60">
                            <th class="py-1 pr-2">Tipo</th>
                            <th class="py-1 pr-2">Alvo</th>
                            <th class="py-1 pr-2">Motivo</th>
                            <th class="py-1 pr-2">Responsável</th>
                            <th class="py-1">Quando</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(a, i) in relatorio.auditoria" :key="i" class="border-b border-tinta/5">
                            <td class="py-1 pr-2">{{ a.tipo }}</td>
                            <td class="py-1 pr-2">{{ a.alvo }}</td>
                            <td class="py-1 pr-2">{{ a.motivo }}</td>
                            <td class="py-1 pr-2">{{ a.responsavel ?? '—' }}</td>
                            <td class="py-1 font-mono text-12 font-tabular">{{ a.quando }}</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <!-- 7. hash -->
            <footer class="mt-10 border-t border-tinta/20 pt-4">
                <p class="text-12 text-tinta/60">
                    Integridade do documento — SHA-256 do conteúdo do fechamento (reimpressões geram o mesmo hash):
                </p>
                <p class="mt-1 break-all font-mono text-12 font-tabular">{{ hash }}</p>
            </footer>
        </main>
    </div>
</template>
