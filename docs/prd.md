# PRD — Bolão Dez
### Bolão acumulativo de 10 números com apuração pelos sorteios oficiais da Mega-Sena

| | |
|---|---|
| **Versão** | 1.0 — 29/07/2026 |
| **Autor** | Eric Martins |
| **Stack** | Laravel 12 · Inertia.js · Vue 3 · Tailwind CSS 4 · MySQL · Redis · Pest 3 · Laravel Reverb |
| **Pagamentos** | Mercado Pago (PIX QR dinâmico) |
| **Notificações** | Evolution API (WhatsApp) — fase 2 |
| **Deploy** | Coolify + Cloudflare |

---

## 1. Visão do produto

Um bolão que **não acaba no primeiro sorteio**. O apostador escolhe 10 números de 1 a 60 e, sorteio após sorteio da Mega-Sena, vai acendendo as bolas da sua cartela. Ganha quem acender as 10 primeiro.

A consequência de produto mais importante disso: **a tensão é semanal, não pontual**. O sistema não é um checkout de aposta — é um painel de acompanhamento que as pessoas abrem três vezes por semana para ver quantas bolas faltam. Todo o design parte daí.

**Uma frase:** *"Faltam 3 para o Rafael."*

### Público
Grupos fechados (empresa, família, condomínio, grupo de WhatsApp) de 20 a 500 apostadores, operados por um administrador único que conhece os participantes. Não é marketplace aberto.

### O que este produto **não** é
- Não é revenda de aposta oficial da Caixa. O sistema **não compra apostas** na Mega-Sena; usa apenas o resultado público do sorteio como fonte de apuração.
- Não é casa de apostas com odds, saque, carteira ou saldo.

---

## 2. Glossário

| Termo | Definição |
|---|---|
| **Rodada** | Ciclo do bolão. Tem data de início, valor de aposta, regras de premiação e um conjunto de sorteios. |
| **Cartela (aposta)** | 10 números distintos de 1 a 60 escolhidos por um apostador, vinculados a uma rodada. |
| **Sorteio** | Um concurso oficial da Mega-Sena lançado pelo admin: data, número do concurso e as 6 dezenas. |
| **Ponto** | Cada número **distinto** da cartela que já foi sorteado em qualquer sorteio da rodada. Máximo: 10. |
| **Acender** | Marcar visualmente uma bola como acertada. Bola acesa nunca apaga. |
| **Pote** | Soma dos valores das apostas **pagas** da rodada. |
| **Prêmio principal** | Percentual do pote (default 70%) pago a quem fecha 10 pontos. |

---

## 3. Regras de negócio

### 3.1 Rodada

Campos configuráveis na criação:

| Campo | Tipo | Default | Regra |
|---|---|---|---|
| Nome | string | — | Ex.: "Bolão de Agosto" |
| Data de início | date | — | Data do **primeiro sorteio** válido para a rodada |
| Encerramento das apostas | datetime | `data_inicio 18:00` | Derivado, mas editável |
| Valor da aposta | money | R$ 20,00 | Igual para todas as cartelas da rodada |
| % prêmio 10 pontos | decimal | **70%** | Do pote |
| % 2º colocado | decimal | 15% | Ver §3.6 |
| % administração | decimal | 15% | Ver §3.6 |
| Limite de sorteios | int | 15 | Ver §3.5 |
| Limite de cartelas por pessoa | int | 5 | 0 = ilimitado |
| Mínimo de cartelas pagas | int | 10 | Abaixo disso a rodada pode ser cancelada com estorno |

**Invariante:** a soma dos percentuais deve ser exatamente 100%. Validação no formulário e na `Rule` do backend.

**Estados:** `rascunho → aberta → em_andamento → encerrada` (+ `cancelada` a qualquer momento antes de `encerrada`).

- `rascunho`: só o admin vê.
- `aberta`: aceita apostas. Vira `em_andamento` automaticamente no encerramento das apostas (job agendado).
- `em_andamento`: não aceita apostas, aceita lançamento de sorteios.
- `encerrada`: alguém fechou 10 pontos ou o limite de sorteios foi atingido. Gera relatório.

**Somente uma rodada `aberta` ou `em_andamento` por vez** na v1. A home sempre mostra essa rodada.

### 3.2 Aposta

1. 10 números, distintos, entre 1 e 60. Validado no front e no back (`distinct`, `between:1,60`, `size:10`).
2. Ordem de escolha é irrelevante — **os números são persistidos em ordem crescente** para exibição e comparação estáveis.
3. Cartelas idênticas de pessoas diferentes são permitidas. Se ambas fecharem 10 no mesmo sorteio, dividem o prêmio (é o comportamento natural da regra de rateio).
4. Cadastro mínimo do apostador: **nome e celular**. E-mail opcional. Sem senha na v1 (ver §3.9).
5. Uma aposta nasce com status **`aguardando_pagamento`** e **não conta no pote**.
6. Apostas são aceitas até o `encerramento das apostas`. Depois disso o formulário fecha e o QR não é mais gerado.

**Estados da aposta:** `aguardando_pagamento → paga` · `expirada` · `cancelada` · `estornada`

Só `paga` entra no pote, na listagem pública e no ranking.

### 3.3 Pagamento (PIX Mercado Pago)

Fluxo:

1. Apostador confirma a cartela → `POST /apostas` cria a aposta `aguardando_pagamento`.
2. Backend chama `POST /v1/payments` do Mercado Pago com `payment_method_id: "pix"`, `X-Idempotency-Key` = UUID da aposta, `date_of_expiration` = **menor valor entre (agora + 30 min) e o encerramento das apostas**.
3. Tela de checkout exibe QR Code, PIX copia-e-cola, valor e contador de expiração. A tela faz *polling* leve (`/apostas/{uuid}/status`, a cada 3s) até confirmar.
4. **Webhook** `POST /webhooks/mercadopago`:
   - valida a assinatura `x-signature` (HMAC do `ts` + `data.id`);
   - persiste o evento bruto em `payment_webhook_events` com *unique* no `provider_event_id` (**idempotência**);
   - despacha job que **re-consulta o pagamento na API** do Mercado Pago (nunca confia no payload) e, se `approved`, marca a aposta como `paga` dentro de transação.
5. **Reconciliação:** comando `bolao:reconciliar-pagamentos` a cada 2 minutos varre apostas `aguardando_pagamento` com QR ativo e consulta o provider. Cobre webhook perdido.
6. Ao confirmar: pote atualizado, cartela aparece na listagem pública, evento `ApostaConfirmada` disparado (broadcast + WhatsApp na fase 2).

**Regras de borda:**
- Pagamento aprovado **após** o encerramento das apostas → aposta fica `paga_fora_do_prazo`, **não entra no pote nem no ranking**, e cai numa fila de estorno no admin com aviso destacado. (Mitigado pelo `date_of_expiration` do item 2.)
- QR expirado sem pagamento → `expirada` por job. O apostador pode gerar uma nova aposta.
- Toda mudança de status registra linha em `bet_status_logs` (quem, quando, motivo).

### 3.4 Pontuação

O motor de apuração é o coração do sistema e precisa ser trivialmente auditável.

Quando o admin publica um sorteio com as 6 dezenas:

```
para cada aposta paga da rodada:
    para cada uma das 6 dezenas sorteadas:
        se a dezena está na cartela E ainda não foi marcada:
            marca bet_numbers.matched_draw_id = sorteio.id
    pontos = count(bet_numbers where matched_draw_id is not null)
```

Regras explícitas:
- **Número repetido em sorteio posterior não pontua de novo.** A bola já está acesa; ponto é por número distinto.
- Pontuação é **cumulativa e monotônica** — nunca diminui.
- Máximo teórico: 10 pontos.
- A apuração roda em **transação única** por sorteio e é **idempotente**: republicar o mesmo concurso não altera resultado.
- O admin pode **corrigir** um sorteio já lançado (erro de digitação). A correção **apaga e recalcula toda a rodada desde o primeiro sorteio** (`RecalcularRodada`), registrando a correção no log de auditoria e notificando na página de acompanhamento ("Concurso 2847 corrigido em 12/08 às 20h14").

**Ranking (ordem de desempate):**
1. Mais pontos.
2. Quem chegou àquela pontuação no **sorteio mais antigo** (menor `matched_draw_id` do último ponto).
3. Menor timestamp de pagamento confirmado.
4. Ordem alfabética do nome (determinístico até o fim).

### 3.5 Encerramento da rodada

A rodada encerra quando:

- **Alguém atinge 10 pontos.** Encerra no mesmo sorteio. Sorteios posteriores não são lançados.
- **ou** o `limite de sorteios` é atingido sem ninguém fechar 10.

No segundo caso (default proposto): o **prêmio principal vai para a maior pontuação** da rodada, aplicando os desempates de §3.4. Alternativa configurável: `acumular` — o valor do prêmio principal rola para a rodada seguinte e a atual paga apenas 2º lugar e taxa. *(Ver pendência P1.)*

### 3.6 Rateio e matemática do dinheiro

- Tudo em **centavos, inteiros**. Nenhum `float` em cálculo financeiro.
- `pote = soma(apostas pagas)`.
- `prêmio_principal = floor(pote * pct_principal / 100)`.
- Empate no prêmio principal (N ganhadores no mesmo sorteio): `cota = floor(prêmio_principal / N)`.
- **Sobra de centavos** de qualquer divisão é somada à parcela de administração. Regra única, documentada na tela de regras.
- Garantia de invariante testada no Pest: `soma(pagamentos de prêmio) + administração == pote`, sempre.
- O 2º colocado é apurado **no encerramento**, não a cada sorteio.

### 3.7 Exibição pública das cartelas

Formato exato da linha, conforme especificado:

```
Rafael — (82) 99xxx-xx89 — 12 15 19 22 40 45 51 53 55 59
```

**Máscara do telefone:** mantém DDD, os **2 primeiros dígitos** após o DDD e os **2 últimos**. O resto vira `x`. Implementado num único `Support/PhoneMask.php` com teste — nunca inline na view, nunca o número completo saindo da API pública. Nome exibido: primeiro nome + inicial do sobrenome quando houver homônimo na rodada ("Rafael S.", "Rafael M.").

### 3.8 Papéis

| Papel | Pode |
|---|---|
| **Visitante** | Ver home/acompanhamento, ranking, regras, apostar |
| **Apostador** | Acessar suas cartelas por link assinado |
| **Admin** | Tudo: rodadas, sorteios, apostas, baixa manual, estornos, relatórios |

Sem multi-tenant na v1. Admin autenticado por Laravel Fortify/Breeze + **2FA obrigatório** (a conta movimenta dinheiro). Rotas de admin sob middleware `can:administrar-bolao`.

### 3.9 Acesso do apostador às suas cartelas

Sem cadastro de senha: ao confirmar pagamento, o sistema gera **URL assinada** (`URL::temporarySignedRoute`, validade = fim da rodada) para "Minhas cartelas", entregue na tela de sucesso e por WhatsApp na fase 2. Reenvio pela home informando o celular (rate limit de 3/hora por IP+telefone, sem revelar se o número existe).

### 3.10 Conformidade — ler antes de cobrar

Não é aconselhamento jurídico, mas precisa estar no radar antes do primeiro PIX: no Brasil, bolões com arrecadação de dinheiro por terceiro fora do canal oficial da Caixa vivem numa zona sensível (Lei das Contravenções Penais, art. 50, e Lei 13.756/2018 sobre loterias). Bolão oficial é o registrado na própria Caixa. **Consulte um advogado sobre o modelo de arrecadação e a titularidade da conta que recebe os PIX antes de operar com valores relevantes.**

Requisitos que entram no produto de qualquer forma:
- Aceite obrigatório de **18+** e do regulamento no checkout, com timestamp e IP persistidos.
- Página de **regulamento** versionada; a cartela guarda a versão aceita.
- LGPD: coleta mínima (nome + celular), telefone mascarado em toda superfície pública, base legal declarada, retenção definida (24 meses após o encerramento), rotina de exclusão a pedido.
- Rodapé com nota de jogo responsável e o valor total já apostado pela pessoa na rodada, visível para ela.

---

## 4. Modelo de dados

```
users                 id, name, email, phone, is_admin, timestamps
                      + 2FA columns

rounds                id, uuid, name, slug,
                      starts_on (date), bets_close_at (datetime),
                      bet_amount_cents,
                      pct_main, pct_second, pct_admin,
                      max_draws, max_bets_per_person, min_paid_bets,
                      no_winner_policy enum(highest_score|rollover),
                      rollover_in_cents,           -- herdado da rodada anterior
                      status enum(draft|open|running|closed|canceled),
                      closed_at, rules_version, created_by, timestamps

bettors               id, uuid, name, phone (indexed, E.164), email nullable,
                      timestamps
                      -- separado de users: apostador não é usuário autenticado

bets                  id, uuid, round_id, bettor_id,
                      numbers json,                -- ordem crescente, snapshot
                      amount_cents,
                      status enum(awaiting_payment|paid|paid_late|expired|
                                  canceled|refunded),
                      paid_at, paid_method enum(pix|manual),
                      hits_count (unsigned tinyint, denormalizado),
                      completed_at_draw_id nullable,
                      accepted_rules_version, accepted_ip, accepted_at,
                      created_by nullable,         -- preenchido se lançada pelo admin
                      timestamps
                      index (round_id, status, hits_count)

bet_numbers           id, bet_id, number (1..60), matched_draw_id nullable
                      unique (bet_id, number)
                      index (matched_draw_id)
                      -- 10 linhas por cartela. É daqui que sai ranking,
                      -- desempate e qual sorteio acendeu cada bola.

draws                 id, round_id, contest_number (int),
                      drawn_on (date), numbers json (6 dezenas),
                      sequence (int, ordem dentro da rodada),
                      published_at, created_by,
                      corrected_at, correction_reason,
                      unique (round_id, contest_number)

payments              id, uuid, bet_id, provider enum(mercado_pago),
                      provider_payment_id, amount_cents,
                      status, qr_code (text), qr_code_base64 (text),
                      ticket_url, expires_at, paid_at, payload json,
                      timestamps

payment_webhook_events id, provider, provider_event_id UNIQUE,
                       type, payload json, processed_at, error, timestamps

payouts               id, round_id, bet_id, category enum(main|second),
                      position, amount_cents, paid_at, notes, timestamps

bet_status_logs        id, bet_id, from_status, to_status, reason,
                       actor_type, actor_id, timestamps

activity_logs          auditoria geral do admin (spatie/laravel-activitylog)
```

**Decisões de modelagem que valem defender:**
- `bet_numbers` em vez de só o `json`: transforma "qual sorteio acendeu essa bola" e todo o desempate em `SELECT`, não em loop PHP. O `numbers json` fica como snapshot imutável para exibição e conferência.
- `bettors` separado de `users`: o apostador não autentica; o admin autentica. Misturar os dois é a origem clássica de furo de permissão.
- `rollover_in_cents` na rodada: o dinheiro herdado precisa ser explícito no relatório, não implícito no pote.

---

## 5. Fluxos

### 5.1 Apostador
```
Home (acompanhamento)
  └─ "Fazer minha aposta"
       ├─ Escolhe 10 números (grid 1–60) ou Surpresinha
       ├─ Nome + celular + aceite 18/regulamento
       ├─ Revisão da cartela ("é essa mesma?")
       ├─ PIX: QR + copia-e-cola + contador
       │    └─ polling → confirmado
       └─ Sucesso: cartela + link "Minhas cartelas" + link do WhatsApp do grupo
```

### 5.2 Admin — lançar sorteio
```
Rodada em andamento → "Lançar sorteio"
  ├─ Concurso, data, 6 dezenas (inputs de dezena, valida distintas 1..60)
  ├─ PRÉVIA obrigatória antes de publicar:
  │    "38 cartelas pontuam · 2 cartelas chegam a 10 pontos ·
  │     a rodada será ENCERRADA · prêmio de R$ 4.200,00 dividido entre 2"
  ├─ Confirmar publicação  → transação: apura, recalcula ranking,
  │                          broadcast, encerra se houver 10 pontos
  └─ Sorteio publicado (editável, com recálculo total e log)
```

---

## 6. Telas

### 6.1 Home = Acompanhamento da rodada atual
A home **é** o painel. Sem landing page institucional.

1. **Hero — "quem está mais perto":** a cartela do líder em tamanho grande, bolas acesas em ouro, as que faltam em contorno vazado, e o número que importa: **faltam 3**. Não é um big-number de pote com label pequeno; é a cartela real de uma pessoa real.
2. **Barra de estado:** pote atual · prêmio de 10 pontos · nº de cartelas · próximo sorteio (ou contador para o encerramento das apostas, quando a rodada está `aberta`).
3. **Últimas dezenas sorteadas:** as 6 do concurso mais recente, com o número do concurso e a data. Concursos anteriores em faixa horizontal navegável.
4. **Ranking:** lista de cartelas ordenadas, cada uma com nome, telefone mascarado e as 10 bolas. Filtro por nome. Destaque para 9 pontos ("um número").
5. **Todas as cartelas pagas:** lista completa no formato de §3.7, densa, com busca. Essa lista é a auditoria social do bolão — precisa ser fácil de conferir e de imprimir.
6. **Regulamento + jogo responsável** no rodapé.

Mobile-first e instalável (PWA). A maioria vai abrir isso no celular, na quarta à noite, com a TV ligada.

### 6.2 Admin
- **Dashboard:** pote, apostas pagas/pendentes, receita, próximo sorteio, alertas (pagamentos fora do prazo, apostas expirando).
- **Rodadas:** criar, editar, abrir, cancelar, encerrar manualmente, ver relatório.
- **Sorteios:** lançar (com prévia), listar, corrigir.
- **Apostas:** tabela com filtros (status, nome, telefone, dezena), **baixa manual** (motivo obrigatório + registro do responsável), cancelar, marcar estorno, exportar CSV.
- **Relatório de fechamento:** gerado no encerramento (§8).
- **Configurações:** valor default de aposta, percentuais default, texto do regulamento, credenciais do Mercado Pago.

---

## 7. Direção de design

Interface classe mundial aqui não significa "bonita" — significa que **um grupo de WhatsApp confia nela sem pedir print**. Legibilidade de placar, hierarquia de dinheiro e um único momento memorável.

### 7.1 Conceito
**O mundo do sorteio ao vivo:** o globo acrílico, a esfera numerada iluminada pela luz do estúdio, a bola apagada em plástico fosco na sombra. Fundo de noite de sorteio, não interface de banco. Deliberadamente **não** a paleta verde-loteria (evita parecer clone do canal oficial e resolve o risco de marca).

### 7.2 Tokens

**Cor** — 6 valores nomeados:
```
--tinta    #0D1330   fundo, a noite do estúdio
--noite    #182352   superfícies, cards, ranking
--vidro    #97A4CE   texto secundário, bola apagada (plástico fosco)
--aceso    #FFC24B   bola acesa, tungstênio do estúdio — o acento
--brasa    #FF8A3D   apenas no glow/gradiente da bola recém-acesa
--jade     #35D0A5   dinheiro confirmado, pote, "pago"
--papel    #F6F4EF   exclusivo das telas de relatório e impressão (o cupom)
```
Vermelho de erro entra fora dessa lista, um só tom, nunca decorativo.

**Tipografia** — três papéis, nenhum deles Inter em display:
- **Display: Archivo Expanded** (variable), caixa alta, tracking negativo, peso 700–900. Largura expandida ecoa sinalização de casa lotérica sem imitá-la.
- **Corpo: Instrument Sans** — regular/medium, sentence case.
- **Números: Martian Mono** com `font-variant-numeric: tabular-nums`. Toda dezena, pontuação e valor monetário. Placar não pode dançar entre renders.

Escala: `12 / 14 / 16 / 20 / 28 / 40 / 72`. O `72` existe só para o "faltam 3" do hero e para o valor do prêmio.

**Layout:** coluna única no mobile; no desktop, 12 colunas com o hero em 7 e o resumo do pote sticky em 5. Cartelas são cards de 10 bolas em duas fileiras de 5 no mobile e uma fileira de 10 no desktop — a fileira única faz "faltam 3" ser lido de relance.

**Bolas:** `border-radius: 9999px`, `48px` no hero, `32px` no ranking, `24px` na lista densa.
- Apagada: fundo `--noite`, borda 1px `--vidro/30`, número em `--vidro`.
- Acesa: fundo `--aceso`, número em `--tinta`, `box-shadow` de duas camadas (halo curto opaco + halo longo translúcido em `--brasa`).
- Bola que **acabou de acender** neste sorteio: anel externo animado por 1,2s.

### 7.3 Elemento-assinatura: **o acendimento**
Quando o admin publica um sorteio, quem está com a página aberta vê, via WebSocket:

1. As 6 dezenas entram no topo em sequência, uma a cada 400ms, cada uma acendendo com um *bloom* curto.
2. A cada dezena, **todas as cartelas que contêm aquele número acendem a bola correspondente ao mesmo tempo** — a tela inteira pisca em padrões diferentes, e cada pessoa vê a sua.
3. Terminadas as 6, o ranking **re-ordena com transição FLIP** (posição animada, não *fade*), e quem subiu ganha um realce de 2s.
4. Se alguém fechou 10, a cartela vai para o topo em tela cheia por 4s.

É o único lugar onde o produto gasta ousadia. Tudo em volta é placar disciplinado.

`prefers-reduced-motion: reduce` → estados finais aplicados instantaneamente, sem bloom, sem FLIP, sem tela cheia. Sem exceção.

### 7.4 Piso de qualidade
Responsivo até 360px · foco de teclado visível em todo controle · contraste AA (o par `--aceso` sobre `--tinta` foi escolhido por isso) · bola nunca comunica só por cor: acesa tem também peso de fonte e borda diferentes, e `aria-label="12, sorteado no concurso 2847"` · *skeleton* no ranking, nunca *spinner* de página inteira · estado vazio da rodada é convite ("Nenhuma cartela ainda. Seja o primeiro."), não decoração.

### 7.5 Voz
Verbos ativos e o mesmo nome do começo ao fim do fluxo. "Fazer minha aposta" → "Pagar com PIX" → "Aposta confirmada". Nunca "Enviar", nunca "Submeter". Erro diz o que aconteceu e o que fazer: *"Faltam 3 números. Escolha 10 para continuar."* — não *"Validação falhou"*.

---

## 8. Relatório de fechamento da rodada

Gerado automaticamente ao encerrar. Visível no admin, exportável em **PDF e CSV**, na paleta `--papel` (é documento, não painel).

Conteúdo:
1. Identificação: rodada, período, número de sorteios, regulamento vigente.
2. Financeiro: cartelas pagas × valor, valor herdado, pote, prêmio principal, 2º lugar, administração, sobra de centavos, **conferência de fechamento** (soma == pote).
3. Ganhadores: nome, telefone mascarado, cartela, sorteio de fechamento, cota, status do pagamento.
4. Classificação completa com pontos.
5. Histórico de sorteios: concurso, data, dezenas, quantas cartelas pontuaram.
6. Auditoria: baixas manuais (com responsável e motivo), correções de sorteio, cancelamentos e estornos.
7. Hash SHA-256 do conteúdo no rodapé — o mesmo relatório reimpresso tem o mesmo hash.

---

## 9. Arquitetura e implementação

**Domínio isolado de tudo:** `app/Domain/Bolao/` com `Services/ApuracaoService`, `Services/RateioService`, `Actions/PublicarSorteio`, `Actions/RecalcularRodada`, `Actions/DarBaixaManual`. Nenhuma regra de pontuação ou de dinheiro em controller, em Livewire/Vue, ou em model.

**Eventos:** `ApostaConfirmada`, `SorteioPublicado`, `RankingAtualizado`, `RodadaEncerrada`. Filas Redis (`payments`, `apuracao`, `notificacoes`) com `ShouldBeUnique` onde cabe.

**Tempo real:** Laravel Reverb, canal público `rodada.{uuid}`, evento `SorteioPublicado` com o payload completo do ranking. Fallback de *polling* a 15s quando o socket cai — o placar nunca fica mudo.

**Cache:** ranking em Redis com chave `rodada:{id}:ranking`, invalidada por evento. Home suporta pico de acesso nos 10 minutos após o sorteio sem tocar no MySQL em cada request.

**Segurança:** rate limit no `POST /apostas` (5/min por IP) e no reenvio de link · webhook fora do CSRF, com validação de assinatura · valores monetários só do servidor, jamais do payload do cliente · `numbers` validado por `Rule` dedicada · `SELECT ... FOR UPDATE` na rodada durante a apuração.

**Testes (Pest) — o que precisa estar coberto antes de cobrar o primeiro PIX:**
- Pontuação cumulativa; número repetido não pontua duas vezes.
- Idempotência: republicar o mesmo concurso não muda nada.
- Recálculo após correção de sorteio.
- Todos os desempates de §3.4.
- Rateio com N ganhadores; invariante `prêmios + admin == pote`; destino da sobra de centavos.
- Corte das 18h: aposta paga 1 minuto depois não entra.
- Webhook duplicado processa uma vez.
- Máscara de telefone (incluindo 8 dígitos e DDD com 0).
- API pública nunca retorna telefone completo (teste de contrato do JSON).

---

## 10. Critérios de aceite

- [ ] Admin cria rodada com data, valor e percentuais; soma dos percentuais ≠ 100% é rejeitada.
- [ ] Apostador escolhe 10 números de 1 a 60, sem repetição, e recebe QR PIX do Mercado Pago automaticamente.
- [ ] Aposta só entra no pote e na lista pública depois do pagamento confirmado.
- [ ] Pote da home reflete o pagamento em menos de 10s após a confirmação.
- [ ] Apostas bloqueadas às 18h da data de início; pagamento aprovado depois disso é sinalizado para estorno.
- [ ] Home abre no acompanhamento da rodada atual, com a lista de cartelas pagas no formato `Nome — (82) 99xxx-xx89 — 12 15 ...`.
- [ ] Bolas exibidas como círculos apagados e acesas conforme os sorteios, com o acendimento propagado em tempo real.
- [ ] Admin lança sorteio (data, concurso, 6 dezenas) e vê prévia do impacto antes de publicar.
- [ ] Ranking atualiza no mesmo instante da publicação, com desempates corretos.
- [ ] 10 pontos encerram a rodada; N ganhadores no mesmo sorteio dividem os 70%.
- [ ] Baixa manual exige motivo e fica registrada com o responsável.
- [ ] Relatório de fechamento gerado em PDF/CSV com conferência financeira fechando exata.
- [ ] Lighthouse ≥ 95 em Performance e Acessibilidade na home; navegação completa por teclado; `prefers-reduced-motion` respeitado.

---

## 11. Roadmap

| Fase | Escopo | Estimativa |
|---|---|---|
| **1 — Núcleo** | Migrations, domínio de apuração + testes Pest, admin de rodadas e sorteios, ranking. Sem pagamento: baixa manual só. | 1 semana |
| **2 — Cobrança** | Mercado Pago PIX, webhook, reconciliação, expiração, checkout. | 4 dias |
| **3 — Interface pública** | Home/acompanhamento, cartelas, o acendimento, Reverb, PWA. | 1 semana |
| **4 — Fechamento** | Relatório PDF/CSV, payouts, auditoria, estornos. | 3 dias |
| **5 — Retenção** | WhatsApp via Evolution API: confirmação, aviso de sorteio, "faltam 2 números", resultado. | 3 dias |

**Fase 2+ (backlog):** importação automática do resultado pela API de loterias da Caixa (com confirmação manual do admin, nunca publicação automática) · múltiplas rodadas simultâneas e multi-tenant · variação de 15 números · histórico e estatísticas do apostador · convite por link com atribuição.

---

## 12. Decisões pendentes

| # | Pergunta | Default assumido no PRD |
|---|---|---|
| **P1** | Ninguém fecha 10 pontos dentro do limite de sorteios — paga a maior pontuação ou acumula para a próxima rodada? | Paga a maior pontuação, com `rollover` configurável |
| **P2** | Os 30% restantes: 15% para 2º lugar + 15% administração, ou outra divisão? Existe 3º lugar? | 15% / 15%, sem 3º lugar |
| **P3** | Limite de sorteios por rodada — 15 concursos (~5 semanas) é o horizonte desejado? | 15 |
| **P4** | Uma pessoa pode ter várias cartelas na mesma rodada? Limite? | Sim, até 5 |
| **P5** | Rodada com menos que o mínimo de cartelas: cancela com estorno automático ou roda mesmo assim? | Decisão manual do admin, com estorno em lote |
| **P6** | Quem recebe os PIX — CPF ou CNPJ? (define nota fiscal, retenção e o desenho jurídico de §3.10) | Não definido — **bloqueia a fase 2** |
| **P7** | Sorteios especiais (Mega da Virada, sorteios extras) contam para a rodada? | Contam, se o admin lançar |
