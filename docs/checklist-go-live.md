# Checklist de go-live — Bolão Dez

Percorra **tudo** antes do primeiro PIX de verdade. Itens marcados com ⚖️ envolvem risco legal/financeiro.

## ⚖️ Jurídico e financeiro (bloqueiam o go-live)

- [ ] **P6 do PRD resolvido**: definido CPF ou CNPJ que recebe os PIX (define nota fiscal, retenção e desenho jurídico).
- [ ] Parecer de advogado sobre o modelo de arrecadação (LCP art. 50 e Lei 13.756/2018 — bolão fora do canal oficial da Caixa é zona sensível).
- [ ] Conta Mercado Pago **de produção** na titularidade correta, com PIX habilitado.
- [ ] Texto do regulamento revisado e versionado (`rules_version` da rodada).

## Credenciais e segredos

- [ ] `APP_KEY` nova (`php artisan key:generate`), `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL` com o domínio real.
- [ ] `MP_ACCESS_TOKEN` de **produção** (não `TEST-...`) e `MP_WEBHOOK_SECRET` da assinatura de webhooks de produção.
- [ ] Webhook configurado no painel do MP apontando para `https://SEU-DOMINIO/webhooks/mercadopago` (evento: Pagamentos) e `MP_NOTIFICATION_URL` igual.
- [ ] `REVERB_APP_ID/KEY/SECRET` regenerados (não usar os valores de dev do repositório).
- [ ] `DB_PASSWORD`/`DB_ROOT_PASSWORD` fortes; MySQL e Redis **sem porta exposta publicamente**.
- [ ] Senha do admin trocada (o seeder usa `password`) e **2FA ativado** — o painel exige.

## Infra (Coolify)

- [ ] Deploy via `docker-compose.prod.yml`; domínio com TLS no serviço `web`.
- [ ] Reverb exposto em subdomínio com TLS (`wss`); `VITE_REVERB_HOST/PORT/SCHEME` apontando para ele **antes** do build da imagem.
- [ ] `queue`, `scheduler`, `reverb` e `ssr` rodando (4 processos além do web) — conferir `docker compose ps`.
- [ ] Backup automático do MySQL (mínimo diário) + teste de restauração feito uma vez.
- [ ] Cloudflare (se usado): WebSocket habilitado; `/build/assets/*` pode ser cacheado, `/` e `/api/*` não.
- [ ] Logs acessíveis e monitoramento básico (a fila parada = pagamento não confirma; monitore o container `queue`).

## Teste de fogo (em produção, antes de divulgar)

- [ ] Criar rodada real, abrir apostas, fazer **uma aposta de valor baixo com PIX real** e ver: QR gerado → pago → cartela na lista pública em menos de 10s.
- [ ] Conferir o webhook chegando (`payment_webhook_events` com `processed_at`) — se só a reconciliação confirmar, o webhook está mal configurado.
- [ ] Lançar um sorteio de teste **em rodada de teste** e ver o acendimento ao vivo em dois celulares.
- [ ] Encerrar a rodada de teste e conferir o relatório: conferência "FECHA EXATA" e hash igual em duas impressões.
- [ ] Testar uma aposta paga **após** o encerramento (sandbox) → cai na fila de estorno.
- [ ] Apagar as rodadas de teste antes de abrir a rodada real. **Nunca rodar `DemoSeeder` em produção.**

## Operação combinada com o grupo

- [ ] Regulamento publicado e fixado no grupo do WhatsApp antes de abrir as apostas.
- [ ] Combinado quem é o responsável por lançar o sorteio nas noites de Mega-Sena (e o backup dele).
- [ ] Imprimir/arquivar a lista de cartelas pagas no encerramento das apostas (auditoria social).
- [ ] Prazo público para pagamento dos prêmios após o encerramento (sugestão: 48h) e registro no sistema.
- [ ] LGPD: rotina de exclusão de dados a pedido definida (quem faz, em quanto tempo).
