# Prompt de implementação — Bolão Dez

> Cole o conteúdo abaixo (a partir de "## Contexto") no Claude Code na raiz de um diretório vazio. Se você tiver o arquivo `prd-bolao-dez.md`, coloque-o em `docs/prd.md` antes de começar e o agente vai usá-lo como fonte de verdade complementar.

---

## Contexto

Você vai construir, do zero até deployável, o **Bolão Dez**: um bolão web em que cada apostador escolhe **10 dezenas de 1 a 60** e a pontuação **acumula** a cada concurso da Mega-Sena lançado manualmente pelo administrador. Ganha quem acender as 10 bolas primeiro.

O produto é um **painel de acompanhamento**, não um checkout. As pessoas abrem no celular três vezes por semana para ver quantas bolas faltam. Otimize para isso.

Aplicação web responsiva, mobile-first, instalável como PWA, em **português do Brasil** (código e identificadores em inglês; strings de interface, rotas públicas e mensagens em pt-BR).

## Stack obrigatória

- **Laravel 12** (PHP 8.3+)
- **Inertia.js + Vue 3** (Composition API, `<script setup>`, TypeScript)
- **Tailwind CSS 4**
- **MySQL 8** · **Redis** (cache + filas)
- **Laravel Reverb** + Laravel Echo (tempo real)
- **Pest 3** (testes) · **Larastan** nível 6 · **Laravel Pint**
- **Mercado Pago** (PIX QR dinâmico) via HTTP client do Laravel — não instale SDK
- `vite-plugin-pwa` (Workbox) · `spatie/laravel-activitylog` · `spatie/laravel-data` (DTOs)
- Sem Livewire. Sem Bootstrap. Sem biblioteca de componentes pronta (nem shadcn, nem PrimeVue): os componentes são poucos e específicos, escreva-os.

## Regras de trabalho — leia antes de escrever a primeira linha

1. **Domínio primeiro, tela por último.** A ordem das fases abaixo não é sugestão. Não abra um `.vue` antes da fase 3 estar liberada.
2. **TDD no domínio.** Toda regra de pontuação, desempate e rateio nasce como teste Pest que falha, depois como implementação. Sem exceção.
3. **Dinheiro é `int` em centavos.** Nenhum `float`, nenhum `decimal` de PHP em cálculo. Colunas `_cents` como `unsignedBigInteger`.
4. **Regra de negócio nunca mora em controller, model, request ou componente Vue.** Mora em `app/Domain/Bolao/`.
5. **Pare nos checkpoints.** Ao fim de cada fase, rode a suíte, rode o Pint, rode o Larastan, faça o commit e **relate para mim o que foi feito, o que ficou pendente e qualquer decisão que você tomou por conta própria.** Só então siga.
6. **Conventional commits**, um commit por unidade coerente (`feat(apuracao): ...`, `test(rateio): ...`, `fix(webhook): ...`). Nunca um commit gigante por fase.
7. **Se um requisito for ambíguo, pergunte antes de assumir** — exceto nos itens da seção "Decisões já tomadas", que estão fechados.
8. **Não instale nada que não esteja na lista da stack** sem me perguntar primeiro.

---

## Modelo de dados

Gere as migrations exatamente com estas tabelas e colunas. Índices onde indicado.

```
users                  id, name, email, password, phone, is_admin (bool),
                       two_factor_* (Fortify), timestamps

bettors                id, uuid, name, phone (E.164, index), email nullable,
                       timestamps
                       -- apostador NÃO autentica; nunca misture com users

rounds                 id, uuid, name, slug,
                       starts_on (date), bets_close_at (datetime),
                       bet_amount_cents,
                       pct_main (default 70), pct_second (15), pct_admin (15),
                       max_draws (15), max_bets_per_person (5), min_paid_bets (10),
                       no_winner_policy enum(highest_score, rollover),
                       rollover_in_cents (default 0),
                       status enum(draft, open, running, closed, canceled),
                       rules_version, closed_at, created_by, timestamps

bets                   id, uuid, round_id, bettor_id,
                       numbers json,            -- snapshot imutável, ordem crescente
                       amount_cents,
                       status enum(awaiting_payment, paid, paid_late, expired,
                                   canceled, refunded),
                       paid_at, paid_method enum(pix, manual) nullable,
                       hits_count (unsignedTinyInteger, default 0),
                       completed_at_draw_id nullable,
                       accepted_rules_version, accepted_ip, accepted_at,
                       created_by nullable, timestamps
                       index (round_id, status, hits_count)

bet_numbers            id, bet_id, number (unsignedTinyInteger),
                       matched_draw_id nullable
                       unique (bet_id, number), index (matched_draw_id)
                       -- 10 linhas por cartela. Fonte do ranking e dos desempates.

draws                  id, round_id, contest_number, drawn_on (date),
                       numbers json (6 dezenas), sequence,
                       published_at, created_by,
                       corrected_at, correction_reason, timestamps
                       unique (round_id, contest_number)

payments               id, uuid, bet_id, provider enum(mercado_pago),
                       provider_payment_id (index), amount_cents, status,
                       qr_code (text), qr_code_base64 (longText), ticket_url,
                       expires_at, paid_at, payload json, timestamps

payment_webhook_events id, provider, provider_event_id (UNIQUE), type,
                       payload json, processed_at, error, timestamps

payouts                id, round_id, bet_id, category enum(main, second),
                       position, amount_cents, paid_at, notes, timestamps

bet_status_logs        id, bet_id, from_status, to_status, reason,
                       actor_type, actor_id, timestamps
```

**Por que `bet_numbers` existe:** o `numbers json` é só exibição. Toda a lógica lê `bet_numbers`, porque é lá que fica *em qual sorteio cada bola acendeu* — o que dá ranking, desempate por antiguidade e recálculo após correção em `SELECT`, não em loop PHP. Não otimize isso para fora.

---

## Regras de negócio — implemente literalmente

### Aposta
- Exatamente 10 dezenas, **distintas**, entre 1 e 60. Valide com uma `Rule` dedicada (`ValidBetNumbers`), usada no request e reutilizada no admin.
- Persistir em **ordem crescente**.
- Cartelas idênticas de pessoas diferentes são permitidas.
- Cadastro do apostador: nome + celular (obrigatórios), e-mail opcional. Sem senha.
- Nasce `awaiting_payment` e **não conta no pote**.
- Aceita até `bets_close_at` (18h da data de início, por default). Depois disso o endpoint retorna 422 e a UI fecha o formulário.
- Aceite de 18+ e do regulamento obrigatório, com `accepted_rules_version`, IP e timestamp gravados.

### Pontuação (`ApuracaoService`)
```
para cada aposta com status=paid da rodada:
    para cada uma das 6 dezenas do sorteio:
        se existe bet_numbers(bet, dezena) com matched_draw_id IS NULL:
            matched_draw_id = draw.id
    hits_count = count(bet_numbers where matched_draw_id IS NOT NULL)
```
- Dezena repetida em concurso posterior **não pontua de novo**.
- Pontuação é cumulativa e monotônica. Máximo 10.
- Toda a apuração de um sorteio roda em **uma transação**, com `SELECT ... FOR UPDATE` na rodada.
- **Idempotente**: publicar o mesmo `contest_number` duas vezes não altera nada.
- `RecalcularRodada`: limpa todos os `matched_draw_id` da rodada e reapura na ordem de `sequence`. Usado quando o admin corrige um sorteio já publicado. Registra `corrected_at` + `correction_reason` e exibe aviso na página pública.

### Ranking — ordem de desempate, nesta ordem
1. `hits_count` desc
2. Menor `matched_draw_id` do **último** ponto conquistado (chegou antes)
3. `paid_at` mais antigo
4. Nome (alfabético) — determinístico até o fim

### Encerramento
- Alguém atinge 10 pontos → rodada encerra **naquele sorteio**; não aceita mais sorteios.
- `max_draws` atingido sem ninguém em 10 → `no_winner_policy`:
  - `highest_score`: prêmio principal vai para a maior pontuação (mesmos desempates);
  - `rollover`: prêmio principal não é pago e vira `rollover_in_cents` da próxima rodada; a atual paga só 2º lugar e administração.

### Rateio (`RateioService`)
- `pote = soma(amount_cents das apostas paid) + rollover_in_cents`
- `premio_principal = intdiv(pote * pct_main, 100)`
- N ganhadores no mesmo sorteio: `cota = intdiv(premio_principal, N)`
- **Toda sobra de centavos de qualquer divisão vai para a administração.** Regra única, documentada na tela de regulamento.
- Invariante testada: `soma(payouts) + administracao == pote`. Sempre. Um teste com valores primos e 3 ganhadores.
- 2º lugar apurado **só no encerramento**.

### Pagamento PIX (Mercado Pago)
1. `POST /apostas` cria a aposta e chama `POST https://api.mercadopago.com/v1/payments` com `payment_method_id: "pix"`, header `X-Idempotency-Key` = uuid da aposta, `date_of_expiration` = **min(agora + 30min, bets_close_at)**.
2. Tela de checkout: QR (base64), copia-e-cola com botão de copiar, valor, contador de expiração. Polling em `GET /apostas/{uuid}/status` a cada 3s.
3. `POST /webhooks/mercadopago` (fora do CSRF):
   - valida o header `x-signature` (HMAC-SHA256 de `id:...;request-id:...;ts:...;` com `MP_WEBHOOK_SECRET`) — assinatura inválida retorna 401 e não processa;
   - grava em `payment_webhook_events` com unique em `provider_event_id` → **idempotência**;
   - responde 200 imediatamente e despacha job;
   - o job **re-consulta o pagamento na API** (`GET /v1/payments/{id}`) e nunca confia no payload; se `approved`, marca a aposta `paid` em transação, atualiza o pote e dispara `ApostaConfirmada`.
4. Command `bolao:reconciliar-pagamentos` a cada 2 min (Scheduler): varre `awaiting_payment` não expiradas e consulta o provider. Cobre webhook perdido.
5. Job `bolao:expirar-apostas`: `awaiting_payment` com `expires_at` vencido → `expired`.
6. Aprovado **depois** de `bets_close_at` → status `paid_late`: **fora do pote, fora do ranking**, e aparece numa fila de estorno destacada no admin.
7. Toda transição de status escreve em `bet_status_logs`.

### Máscara de telefone
`(82) 99xxx-xx89` — mantém DDD, os 2 primeiros dígitos após o DDD e os 2 últimos; o resto vira `x`. Implementação única em `app/Support/PhoneMask.php`, com teste cobrindo 8 e 9 dígitos. **Nenhum endpoint público pode retornar telefone completo** — escreva um teste de contrato que falha se o JSON público contiver o número cru.

### Nome exibido
Primeiro nome. Se houver homônimo na mesma rodada, primeiro nome + inicial do sobrenome ("Rafael S.", "Rafael M.").

---

## Arquitetura

```
app/
  Domain/Bolao/
    Actions/        CriarRodada, AbrirRodada, PublicarSorteio, CorrigirSorteio,
                    RecalcularRodada, EncerrarRodada, RegistrarAposta,
                    ConfirmarPagamento, DarBaixaManual, CancelarAposta
    Services/       ApuracaoService, RankingService, RateioService
    Data/           RodadaData, ApostaData, SorteioData, RankingItemData, PreviaSorteioData
    Events/         ApostaConfirmada, SorteioPublicado, RankingAtualizado, RodadaEncerrada
    Enums/          RoundStatus, BetStatus, PayoutCategory, NoWinnerPolicy
    Exceptions/
  Http/Controllers/{Public,Admin,Webhooks}
  Support/PhoneMask.php
```

- **Filas Redis:** `payments`, `apuracao`, `notifications`. `ShouldBeUnique` no job de apuração por rodada.
- **Tempo real:** Reverb, canal público `rodada.{uuid}`, evento `SorteioPublicado` com o ranking completo no payload (o cliente não precisa de round-trip). Fallback: se o socket não conectar em 5s, polling de `/api/rodada-atual/ranking` a cada 15s. O placar nunca fica mudo.
- **Cache:** ranking em Redis (`rodada:{id}:ranking`), invalidado por evento. A home tem que aguentar o pico dos 10 minutos após o sorteio sem tocar no MySQL a cada request.
- **Admin:** Fortify + **2FA obrigatório**. Rotas sob `middleware('can:administrar-bolao')`.
- **Rate limits:** `POST /apostas` 5/min por IP; reenvio de link "minhas cartelas" 3/hora por IP+telefone, resposta idêntica exista ou não o número.
- **Acesso do apostador:** `URL::temporarySignedRoute` válida até o fim da rodada, entregue na tela de sucesso.

---

## Interface

### Tokens (defina como `@theme` no Tailwind 4 e use só isso)

```css
--color-tinta:  #0D1330;  /* fundo — a noite do sorteio */
--color-noite:  #182352;  /* superfícies, cards */
--color-vidro:  #97A4CE;  /* texto secundário, bola apagada */
--color-aceso:  #FFC24B;  /* bola acesa — o acento, tungstênio de estúdio */
--color-brasa:  #FF8A3D;  /* só no glow da bola recém-acesa */
--color-jade:   #35D0A5;  /* dinheiro confirmado, pote, "pago" */
--color-papel:  #F6F4EF;  /* exclusivo de relatório e impressão */
```
Vermelho de erro: um só tom, fora dessa paleta, nunca decorativo. **Não use verde de loteria** — a intenção é não parecer clone do canal oficial.

**Tipografia** (Fontsource, self-hosted, sem CDN):
- Display: **Archivo Expanded** — caixa alta, tracking negativo, peso 700–900.
- Corpo: **Instrument Sans** — sentence case.
- Números: **Martian Mono** com `font-variant-numeric: tabular-nums`. Toda dezena, pontuação e valor. O placar não pode dançar entre renders.
- Escala: `12 / 14 / 16 / 20 / 28 / 40 / 72`. O `72` só no "faltam 3" do hero e no valor do prêmio.

**Componente `<Ball>`** — o átomo do produto:
- `rounded-full`, tamanhos `48 / 32 / 24` px (hero / ranking / lista densa).
- Apagada: fundo `noite`, borda 1px `vidro/30`, número em `vidro`, peso regular.
- Acesa: fundo `aceso`, número em `tinta`, peso bold, `box-shadow` de duas camadas (halo curto opaco + halo longo translúcido em `brasa`).
- Acesa **neste sorteio**: anel externo animado por 1,2s.
- Acessibilidade: a diferença **nunca é só cor** — peso de fonte e borda também mudam. `aria-label="12, sorteado no concurso 2847"` / `aria-label="12, não sorteado"`.

### Home = acompanhamento (não existe landing institucional)

1. **Hero "quem está mais perto":** a cartela do líder em tamanho grande, bolas acesas em ouro, as que faltam vazadas, e **"faltam 3"** no tamanho 72. É a cartela de uma pessoa real, não um big-number de pote.
2. **Barra de estado:** pote · prêmio de 10 pontos · nº de cartelas · próximo sorteio (ou contador para as 18h quando a rodada está `open`).
3. **Últimas dezenas:** as 6 do concurso mais recente, com número do concurso e data; concursos anteriores em faixa horizontal navegável.
4. **Ranking:** cards com nome, telefone mascarado e as 10 bolas. Busca por nome. Destaque para quem está com 9 pontos ("um número").
5. **Todas as cartelas pagas:** lista densa no formato `Rafael — (82) 99xxx-xx89 — 12 15 19 22 40 45 51 53 55 59`, com busca e folha de estilo de impressão. Essa lista é a auditoria social do bolão; precisa ser fácil de conferir.
6. Rodapé: regulamento, nota de jogo responsável, e para o próprio apostador o total que ele já apostou na rodada.

### Elemento-assinatura: **o acendimento**
Quando o admin publica um sorteio, quem está com a página aberta vê, via WebSocket:
1. As 6 dezenas entram no topo em sequência, uma a cada 400ms, cada uma com um *bloom* curto.
2. A cada dezena, **todas as cartelas que a contêm acendem a bola correspondente simultaneamente** — a tela inteira pisca em padrões diferentes e cada pessoa vê a sua.
3. Terminadas as 6, o ranking **re-ordena com transição FLIP** (posição animada, não fade), e quem subiu ganha realce de 2s.
4. Se alguém fechou 10, a cartela vai para tela cheia por 4s.

Essa é a única ousadia do produto. Todo o resto é placar disciplinado — corte qualquer outra animação decorativa.

`prefers-reduced-motion: reduce` → estados finais aplicados instantaneamente: sem bloom, sem FLIP, sem tela cheia. Sem exceção.

### Voz da interface
Verbo ativo e o mesmo nome do começo ao fim do fluxo: "Fazer minha aposta" → "Pagar com PIX" → "Aposta confirmada". Nunca "Enviar"/"Submeter". Erro diz o que houve e o que fazer: *"Faltam 3 números. Escolha 10 para continuar."* — nunca "Validação falhou". Estado vazio é convite: *"Nenhuma cartela ainda. Seja o primeiro."*

### Admin
Mesma paleta, densidade maior, zero animação.
- **Dashboard:** pote, pagas/pendentes, próximo sorteio, alertas (`paid_late`, apostas expirando).
- **Rodadas:** criar/editar/abrir/cancelar/encerrar, ver relatório. Validação: `pct_main + pct_second + pct_admin == 100`.
- **Sorteios:** lançar (concurso, data, 6 dezenas) com **prévia obrigatória antes de publicar** — *"38 cartelas pontuam · 2 chegam a 10 pontos · a rodada será ENCERRADA · prêmio de R$ 4.200,00 dividido entre 2"*. Corrigir sorteio publicado exige motivo e dispara recálculo total.
- **Apostas:** tabela com filtros (status, nome, telefone, dezena), **baixa manual com motivo obrigatório**, cancelar, marcar estorno, exportar CSV.
- **Relatório de fechamento** (§ abaixo), **Configurações** (defaults, texto do regulamento, credenciais MP).

### PWA
`vite-plugin-pwa` com `registerType: 'autoUpdate'`; manifest (nome, ícones 192/512/maskable, `theme_color: #0D1330`, `display: standalone`, `orientation: portrait`); precache do app shell; **network-first** para dados de rodada e ranking (dados velhos de placar são pior que tela vazia); tela offline informando que o placar está desatualizado, com botão de recarregar; prompt de instalação discreto, exibido só na segunda visita. Sem push notifications na v1.

---

## Relatório de fechamento

Gerado automaticamente ao encerrar. Visível no admin, exportável em **PDF e CSV**, na paleta `papel` (é documento, não painel). Conteúdo:

1. Identificação: rodada, período, nº de sorteios, versão do regulamento.
2. Financeiro: cartelas pagas × valor, valor herdado, pote, prêmio principal, 2º lugar, administração, sobra de centavos, **conferência de fechamento**.
3. Ganhadores: nome, telefone mascarado, cartela, sorteio de fechamento, cota, status do pagamento.
4. Classificação completa com pontos.
5. Histórico de sorteios: concurso, data, dezenas, quantas cartelas pontuaram.
6. Auditoria: baixas manuais (responsável + motivo), correções de sorteio, cancelamentos, estornos.
7. **Hash SHA-256** do conteúdo no rodapé — reimpressão do mesmo relatório gera o mesmo hash.

---

## Testes obrigatórios (Pest)

Nenhuma fase é entregue sem estes verdes:

**Domínio**
- [ ] Pontuação cumulativa ao longo de vários sorteios
- [ ] Dezena repetida em concurso posterior não pontua duas vezes
- [ ] Publicar o mesmo concurso duas vezes não altera nada (idempotência)
- [ ] Correção de sorteio recalcula a rodada inteira corretamente
- [ ] Cada um dos 4 critérios de desempate, isoladamente
- [ ] Rateio com 1, 2 e 3 ganhadores; sobra de centavos vai para administração
- [ ] Invariante `soma(payouts) + administracao == pote` com valores primos
- [ ] `highest_score` e `rollover` quando ninguém fecha 10
- [ ] Rodada encerra no sorteio em que alguém atinge 10 e recusa novos sorteios
- [ ] Percentuais que não somam 100 são rejeitados

**Aplicação**
- [ ] Aposta com 9, 11 ou dezenas repetidas é rejeitada
- [ ] Aposta paga 1 minuto após `bets_close_at` fica `paid_late` e fora do pote/ranking
- [ ] Webhook duplicado processa uma única vez
- [ ] Webhook com assinatura inválida retorna 401 e não altera nada
- [ ] Job de confirmação re-consulta a API e ignora payload adulterado
- [ ] Reconciliação confirma aposta cujo webhook nunca chegou
- [ ] Máscara de telefone (8 e 9 dígitos)
- [ ] **Contrato:** nenhum endpoint público retorna telefone completo
- [ ] Rota de admin sem 2FA é bloqueada
- [ ] Limite de cartelas por pessoa é respeitado

Fake da API do Mercado Pago com `Http::fake()`; nunca chame a API real em teste. Factories para tudo, incluindo uma `RoundFactory` com estado `comSorteios(int $n)`.

---

## Fases — pare e relate ao fim de cada uma

**Fase 1 — Núcleo (sem pagamento, sem tela pública)**
Migrations, models, enums, DTOs, factories, `ApuracaoService`, `RankingService`, `RateioService`, actions de rodada e sorteio, baixa manual, e **toda a suíte de domínio verde**. Admin funcional em Inertia: criar rodada, lançar sorteio com prévia, listar apostas, dar baixa manual. Um seeder `DemoSeeder` com 1 rodada, 40 cartelas e 3 sorteios, para dar o que ver.
*Checkpoint: `pest` verde, `pint`, `larastan`, e um resumo do que o motor de apuração faz com o seeder.*

**Fase 2 — Cobrança**
Integração Mercado Pago, checkout PIX, webhook assinado e idempotente, job de confirmação com re-consulta, reconciliação agendada, expiração, `paid_late` e fila de estorno.
*Checkpoint: testes de pagamento verdes + instruções de como testar com credenciais de sandbox.*

**Fase 3 — Interface pública**
Home/acompanhamento, `<Ball>`, cartelas, ranking, lista pública com máscara, formulário de aposta (grid 1–60 + surpresinha), Reverb, **o acendimento**, PWA, folha de impressão, regulamento.
*Checkpoint: Lighthouse ≥ 95 em Performance e Acessibilidade na home; navegação completa por teclado; `prefers-reduced-motion` verificado.*

**Fase 4 — Fechamento**
Encerramento automático, `payouts`, relatório PDF/CSV com hash, auditoria, estornos.
*Checkpoint: relatório de uma rodada do seeder, com a conferência financeira fechando exata.*

**Fase 5 — Entrega**
`README.md` (setup local, variáveis, comandos, como rodar Reverb e as filas), `docs/regras-de-negocio.md` (a lógica de apuração explicada para um leigo poder auditar), `.env.example`, Dockerfile/compose para Coolify, checklist de go-live.

---

## Decisões já tomadas (não pergunte, implemente)

- Prêmio de 10 pontos: **70%** do pote, dividido igualmente se houver mais de um no mesmo sorteio.
- Restante: 15% para 2º lugar + 15% administração (configuráveis por rodada).
- Apostas até **18h da data de início**.
- Limite default de **15 sorteios** por rodada.
- Até **5 cartelas** por pessoa.
- Uma única rodada `open`/`running` por vez na v1 (sem multi-tenant).
- Sorteios são lançados **manualmente**. Não integre nenhuma API de loterias nesta versão.
- Sobra de centavos vai para a administração.
- Sem carteira, sem saldo, sem saque: o prêmio é pago fora do sistema e o admin só registra o `payouts.paid_at`.

## O que **não** fazer

- Não crie landing page institucional — a home é o acompanhamento.
- Não coloque lógica de pontuação em Vue "para ficar mais rápido".
- Não confie em nenhum valor monetário vindo do cliente.
- Não publique sorteio automaticamente por API externa.
- Não exponha telefone completo, CPF ou e-mail em resposta pública.
- Não adicione animação além do acendimento.
- Não gere `README` genérico de framework: o README é operacional, para quem vai rodar isso em produção.
- Não deixe `TODO` no código. O que não foi feito vai no relatório do checkpoint, não escondido em comentário.

## Variáveis de ambiente esperadas

```
APP_URL, APP_TIMEZONE=America/Maceio, APP_LOCALE=pt_BR
DB_*, REDIS_*, QUEUE_CONNECTION=redis, CACHE_STORE=redis
REVERB_APP_ID, REVERB_APP_KEY, REVERB_APP_SECRET, REVERB_HOST, REVERB_PORT, REVERB_SCHEME
VITE_REVERB_APP_KEY, VITE_REVERB_HOST, VITE_REVERB_PORT, VITE_REVERB_SCHEME
MP_ACCESS_TOKEN, MP_WEBHOOK_SECRET, MP_NOTIFICATION_URL
BOLAO_ADMIN_EMAIL
```

---

**Comece pela Fase 1.** Antes de escrever código, me mostre: (a) o plano de arquivos que você vai criar, (b) a lista de testes Pest do domínio na ordem em que vai escrevê-los, e (c) qualquer ponto do escopo acima que você considera ambíguo. Espere meu ok.
