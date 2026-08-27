<?php

namespace App\Domain\Bolao\Services;

use App\Domain\Bolao\Enums\BetStatus;
use App\Domain\Bolao\Enums\NoWinnerPolicy;
use App\Domain\Bolao\Enums\PaidMethod;
use App\Domain\Bolao\Enums\PayoutCategory;
use App\Models\Bet;
use App\Models\BetStatusLog;
use App\Models\Draw;
use App\Models\Payout;
use App\Models\Round;
use App\Models\Seller;
use App\Models\User;
use App\Support\PhoneMask;
use Illuminate\Support\Facades\DB;

class RelatorioService
{
    public function __construct(
        private readonly RankingService $ranking,
    ) {}

    /**
     * Relatório de fechamento: estrutura canônica e determinística.
     * O mesmo estado da rodada produz sempre o mesmo conteúdo — é isso
     * que torna o hash reproduzível a cada reimpressão.
     *
     * @return array<string, mixed>
     */
    public function gerar(Round $round): array
    {
        return [
            'identificacao' => $this->identificacao($round),
            'financeiro' => $this->financeiro($round),
            'baixas' => $this->baixas($round),
            'ganhadores' => $this->ganhadores($round),
            'classificacao' => $this->classificacao($round),
            'sorteios' => $this->sorteios($round),
            'auditoria' => $this->auditoria($round),
        ];
    }

    /**
     * SHA-256 do conteúdo do fechamento. O registro posterior do
     * pagamento dos prêmios (pagoEm/observacoes) fica fora do hash:
     * reimprimir o mesmo fechamento gera sempre o mesmo hash.
     *
     * @param  array<string, mixed>  $relatorio
     */
    public function hash(array $relatorio): string
    {
        $imutavel = $relatorio;
        $imutavel['ganhadores'] = array_map(function (array $ganhador): array {
            unset($ganhador['pagoEm'], $ganhador['observacoes']);

            return $ganhador;
        }, $imutavel['ganhadores']);

        return hash('sha256', (string) json_encode($imutavel, JSON_UNESCAPED_UNICODE));
    }

    /**
     * @param  array<string, mixed>  $relatorio
     */
    public function csv(array $relatorio): string
    {
        $out = fopen('php://temp', 'r+');
        if ($out === false) {
            return '';
        }

        $linha = function (array $campos) use ($out): void {
            fputcsv($out, $campos, ';', '"', '\\');
        };

        $id = $relatorio['identificacao'];
        $linha(['IDENTIFICAÇÃO']);
        $linha(['Rodada', $id['nome']]);
        $linha(['Período', $id['inicio'].' a '.($id['encerradaEm'] ?? '—')]);
        $linha(['Sorteios', $id['numeroDeSorteios']]);
        $linha(['Regulamento', 'versão '.$id['versaoRegulamento']]);
        $linha([]);

        $fin = $relatorio['financeiro'];
        $linha(['FINANCEIRO']);
        $linha(['Cartelas pagas', $fin['cartelasPagas'].' × '.$this->reais($fin['valorCartelaCents'])]);
        $linha(['Arrecadação', $this->reais($fin['arrecadacaoCents'])]);
        $linha(['Valor herdado', $this->reais($fin['rolloverEntradaCents'])]);
        $linha(['Pote', $this->reais($fin['poteCents'])]);
        $linha(['Prêmio principal pago', $this->reais($fin['premioPrincipalPagoCents'])]);
        $linha(['2º lugar pago', $this->reais($fin['premioSegundoPagoCents'])]);
        $linha(['Acumulado para a próxima rodada', $this->reais($fin['rolloverSaidaCents'])]);
        $linha(['Administração', $this->reais($fin['administracaoCents'])]);
        $linha(['Sobra de centavos (na administração)', $this->reais($fin['sobraCents'])]);
        $linha(['Conferência (prêmios + administração + acumulado = pote)', $fin['conferenciaFecha'] ? 'FECHA EXATA' : 'NÃO FECHA']);
        $linha([]);

        $baixas = $relatorio['baixas'];
        $linha(['BAIXAS (PRESTAÇÃO DE CONTAS)']);
        $linha(['Baixas automáticas (PIX)', $baixas['automaticas']['quantidade'], $this->reais($baixas['automaticas']['valorCents'])]);
        $linha(['Baixas manuais', $baixas['manuais']['quantidade'], $this->reais($baixas['manuais']['valorCents'])]);
        $linha([]);
        $linha(['Vendedor', 'Pagas', 'Automáticas', 'Manuais', 'Arrecadação', 'Comissão %', 'Comissão']);
        foreach ($baixas['porVendedor'] as $v) {
            $linha([
                $v['nome'], $v['apostasPagas'], $v['baixasAutomaticas'], $v['baixasManuais'],
                $this->reais($v['arrecadacaoCents']), $v['comissaoPct'].'%', $this->reais($v['comissaoCents']),
            ]);
        }
        $linha([]);

        $linha(['GANHADORES']);
        $linha(['Categoria', 'Nome', 'Telefone', 'Cartela', 'Sorteio de fechamento', 'Cota', 'Pagamento']);
        foreach ($relatorio['ganhadores'] as $g) {
            $linha([
                $g['categoria'], $g['nome'], $g['telefone'],
                implode(' ', array_map(fn (int $n): string => str_pad((string) $n, 2, '0', STR_PAD_LEFT), $g['cartela'])),
                $g['sorteioFechamento'] ?? '—',
                $this->reais($g['cotaCents']),
                $g['pagoEm'] ?? 'a pagar',
            ]);
        }
        $linha([]);

        $linha(['CLASSIFICAÇÃO']);
        $linha(['Posição', 'Nome', 'Telefone', 'Pontos', 'Cartela']);
        foreach ($relatorio['classificacao'] as $c) {
            $linha([
                $c['posicao'], $c['nome'], $c['telefone'], $c['pontos'],
                implode(' ', array_map(fn (int $n): string => str_pad((string) $n, 2, '0', STR_PAD_LEFT), $c['dezenas'])),
            ]);
        }
        $linha([]);

        $linha(['SORTEIOS']);
        $linha(['Ordem', 'Concurso', 'Data', 'Dezenas', 'Cartelas que pontuaram', 'Correção']);
        foreach ($relatorio['sorteios'] as $s) {
            $linha([
                $s['sequencia'], $s['concurso'], $s['data'],
                implode(' ', array_map(fn (int $n): string => str_pad((string) $n, 2, '0', STR_PAD_LEFT), $s['dezenas'])),
                $s['cartelasQuePontuaram'],
                $s['motivoCorrecao'] ?? '—',
            ]);
        }
        $linha([]);

        $linha(['AUDITORIA']);
        $linha(['Tipo', 'Apostador/Alvo', 'Motivo', 'Responsável', 'Quando']);
        foreach ($relatorio['auditoria'] as $a) {
            $linha([$a['tipo'], $a['alvo'], $a['motivo'], $a['responsavel'] ?? '—', $a['quando']]);
        }
        $linha([]);

        $linha(['HASH SHA-256', $this->hash($relatorio)]);

        rewind($out);
        $csv = (string) stream_get_contents($out);
        fclose($out);

        return $csv;
    }

    /**
     * @return array<string, mixed>
     */
    private function identificacao(Round $round): array
    {
        return [
            'nome' => $round->name,
            'slug' => $round->slug,
            'status' => $round->status->label(),
            'inicio' => $round->starts_on->toDateString(),
            'encerradaEm' => $round->closed_at?->toDateTimeString(),
            'numeroDeSorteios' => $round->draws()->count(),
            'versaoRegulamento' => $round->rules_version,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function financeiro(Round $round): array
    {
        $cartelasPagas = $round->bets()->where('status', BetStatus::Paid)->count();
        $arrecadacao = (int) $round->bets()->where('status', BetStatus::Paid)->sum('amount_cents');
        $pote = $arrecadacao + $round->rollover_in_cents;

        $pagoPrincipal = (int) $round->payouts()->where('category', PayoutCategory::Main)->sum('amount_cents');
        $pagoSegundo = (int) $round->payouts()->where('category', PayoutCategory::Second)->sum('amount_cents');
        $totalPago = $pagoPrincipal + $pagoSegundo;

        $houveVencedor = $round->bets()
            ->where('status', BetStatus::Paid)
            ->where('hits_count', 10)
            ->exists();

        $rolloverSaida = (! $houveVencedor
            && $pagoPrincipal === 0
            && $round->no_winner_policy === NoWinnerPolicy::Rollover
            && $pote > 0)
            ? intdiv($pote * $round->pct_main, 100)
            : 0;

        $administracao = $pote - $totalPago - $rolloverSaida;
        $sobra = $administracao - intdiv($pote * $round->pct_admin, 100);

        return [
            'cartelasPagas' => $cartelasPagas,
            'valorCartelaCents' => $round->bet_amount_cents,
            'arrecadacaoCents' => $arrecadacao,
            'rolloverEntradaCents' => $round->rollover_in_cents,
            'poteCents' => $pote,
            'premioPrincipalPagoCents' => $pagoPrincipal,
            'premioSegundoPagoCents' => $pagoSegundo,
            'totalPagoCents' => $totalPago,
            'rolloverSaidaCents' => $rolloverSaida,
            'administracaoCents' => $administracao,
            'sobraCents' => $sobra,
            'conferenciaFecha' => ($totalPago + $administracao + $rolloverSaida) === $pote,
        ];
    }

    /**
     * Prestação de contas das baixas: separa as pagas por PIX (automáticas)
     * das baixas manuais, e detalha por vendedor — arrecadação, comissão e
     * quantas baixas cada um deu na mão.
     *
     * @return array<string, mixed>
     */
    private function baixas(Round $round): array
    {
        $pagas = $round->bets()
            ->where('status', BetStatus::Paid)
            ->get(['id', 'seller_id', 'amount_cents', 'paid_method']);

        $vendedores = Seller::query()
            ->whereIn('id', $pagas->pluck('seller_id')->filter()->unique())
            ->get()
            ->keyBy('id')
            ->all();

        $manuais = $pagas->where('paid_method', PaidMethod::Manual);
        $automaticas = $pagas->reject(fn (Bet $bet): bool => $bet->paid_method === PaidMethod::Manual);

        $porVendedor = $pagas
            ->groupBy(fn (Bet $bet): int => $bet->seller_id ?? 0)
            ->map(function ($grupo, int $key) use ($vendedores): array {
                $arrecadacao = (int) $grupo->sum('amount_cents');

                if (isset($vendedores[$key])) {
                    $nome = $vendedores[$key]->name;
                    $slug = $vendedores[$key]->slug;
                    $pct = $vendedores[$key]->commission_pct;
                } else {
                    $nome = 'Sem vendedor (link geral)';
                    $slug = null;
                    $pct = 0;
                }

                return [
                    'nome' => $nome,
                    'slug' => $slug,
                    'apostasPagas' => $grupo->count(),
                    'baixasAutomaticas' => $grupo->reject(fn (Bet $b): bool => $b->paid_method === PaidMethod::Manual)->count(),
                    'baixasManuais' => $grupo->where('paid_method', PaidMethod::Manual)->count(),
                    'arrecadacaoCents' => $arrecadacao,
                    'comissaoPct' => $pct,
                    'comissaoCents' => intdiv($arrecadacao * $pct, 100),
                ];
            })
            ->sortBy('nome')
            ->values()
            ->all();

        return [
            'automaticas' => [
                'quantidade' => $automaticas->count(),
                'valorCents' => (int) $automaticas->sum('amount_cents'),
            ],
            'manuais' => [
                'quantidade' => $manuais->count(),
                'valorCents' => (int) $manuais->sum('amount_cents'),
            ],
            'porVendedor' => $porVendedor,
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function ganhadores(Round $round): array
    {
        return $round->payouts()
            ->with(['bet.bettor', 'bet.completedAtDraw'])
            ->orderBy('position')
            ->orderBy('id')
            ->get()
            ->map(fn (Payout $payout): array => [
                'categoria' => $payout->category->label(),
                'nome' => $payout->bet->bettor->name,
                'telefone' => PhoneMask::mask($payout->bet->bettor->phone),
                'cartela' => $payout->bet->numbers,
                'sorteioFechamento' => $payout->bet->completedAtDraw?->contest_number,
                'cotaCents' => $payout->amount_cents,
                'pagoEm' => $payout->paid_at?->toDateTimeString(),
                'observacoes' => $payout->notes,
            ])
            ->all();
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function classificacao(Round $round): array
    {
        return $this->ranking->orderedBets($round)
            ->values()
            ->map(fn (Bet $bet, int $index): array => [
                'posicao' => $index + 1,
                'nome' => $bet->bettor->name,
                'telefone' => PhoneMask::mask($bet->bettor->phone),
                'pontos' => $bet->hits_count,
                'dezenas' => $bet->numbers,
            ])
            ->all();
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function sorteios(Round $round): array
    {
        $pontuaramPorSorteio = DB::table('bet_numbers')
            ->join('draws', 'draws.id', '=', 'bet_numbers.matched_draw_id')
            ->where('draws.round_id', $round->id)
            ->groupBy('bet_numbers.matched_draw_id')
            ->select('bet_numbers.matched_draw_id', DB::raw('COUNT(DISTINCT bet_numbers.bet_id) as cartelas'))
            ->pluck('cartelas', 'matched_draw_id');

        return $round->draws()
            ->orderBy('sequence')
            ->get()
            ->map(fn (Draw $draw): array => [
                'sequencia' => $draw->sequence,
                'concurso' => $draw->contest_number,
                'data' => $draw->drawn_on->toDateString(),
                'dezenas' => $draw->numbers,
                'cartelasQuePontuaram' => (int) ($pontuaramPorSorteio[$draw->id] ?? 0),
                'corrigidoEm' => $draw->corrected_at?->toDateTimeString(),
                'motivoCorrecao' => $draw->correction_reason,
            ])
            ->all();
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function auditoria(Round $round): array
    {
        $tipos = [
            BetStatus::Paid->value => 'Baixa manual',
            BetStatus::Canceled->value => 'Cancelamento',
            BetStatus::Refunded->value => 'Estorno',
        ];

        $logs = BetStatusLog::query()
            ->whereIn('to_status', array_keys($tipos))
            ->whereIn('actor_type', ['user', 'seller'])
            ->whereHas('bet', fn ($query) => $query->where('round_id', $round->id))
            ->with('bet.bettor')
            ->orderBy('id')
            ->get();

        $usuarios = User::query()
            ->whereIn('id', $logs->where('actor_type', 'user')->pluck('actor_id')->filter()->unique())
            ->pluck('name', 'id');

        $vendedores = Seller::query()
            ->whereIn('id', $logs->where('actor_type', 'seller')->pluck('actor_id')->filter()->unique())
            ->pluck('name', 'id');

        $eventos = $logs->map(function (BetStatusLog $log) use ($tipos, $usuarios, $vendedores): array {
            $responsavel = null;
            if ($log->actor_id !== null) {
                $responsavel = $log->actor_type === 'seller'
                    ? ($vendedores[$log->actor_id] ?? null).' (vendedor)'
                    : $usuarios[$log->actor_id] ?? null;
            }

            return [
                'tipo' => $tipos[$log->to_status],
                'alvo' => $log->bet->bettor->name,
                'motivo' => (string) $log->reason,
                'responsavel' => $responsavel,
                'quando' => $log->created_at?->toDateTimeString() ?? '',
            ];
        });

        $correcoes = $round->draws()
            ->whereNotNull('corrected_at')
            ->orderBy('sequence')
            ->get()
            ->map(fn (Draw $draw): array => [
                'tipo' => 'Correção de sorteio',
                'alvo' => "Concurso {$draw->contest_number}",
                'motivo' => (string) $draw->correction_reason,
                'responsavel' => null,
                'quando' => $draw->corrected_at?->toDateTimeString() ?? '',
            ]);

        return $eventos->concat($correcoes)->values()->all();
    }

    private function reais(int $cents): string
    {
        return 'R$ '.number_format($cents / 100, 2, ',', '.');
    }
}
