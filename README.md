# Bolão Dez

Bolão acumulativo de 10 dezenas apurado pelos sorteios oficiais da Mega-Sena. Cada apostador escolhe 10 dezenas de 1 a 60; a cada concurso lançado pelo administrador, as dezenas sorteadas "acendem" nas cartelas. Ganha quem acender as 10 primeiro.

- **Home pública** (`/`): acompanhamento em tempo real da rodada — é o produto.
- **Admin** (`/admin`): rodadas, sorteios com prévia, apostas, baixa manual, relatório de fechamento.
- **Como o dinheiro é apurado**: leia [`docs/regras-de-negocio.md`](docs/regras-de-negocio.md) — escrito para qualquer participante auditar.

Stack: Laravel 12 · Inertia + Vue 3 (TS) · Tailwind 4 · MySQL 8 · Redis · Reverb · Mercado Pago PIX · Pest 3.

---

## Subir localmente

Requisitos: Docker (Compose v2), PHP 8.3 + Composer, Node 22 (PHP/Node só para instalar dependências e buildar assets; a aplicação roda nos containers).

```bash
composer install
npm install
cp .env.example .env && php artisan key:generate

npm run build              # assets + bundle SSR + service worker
docker compose up -d       # 8 containers, ver tabela abaixo

docker compose exec app php artisan migrate:fresh --seed --seeder=Database\\Seeders\\DemoSeeder --force
```

Abra **http://localhost:8000**. Admin: e-mail definido em `BOLAO_ADMIN_EMAIL`, senha `password` (o primeiro acesso exige ativar 2FA com um app autenticador).

### Containers e portas

| Container | Papel | Porta no host |
|---|---|---|
| `nginx` | Entrada HTTP com gzip (proxy para o app) | **8000** |
| `app` | `artisan serve` (dev) | — |
| `ssr` | Inertia SSR (Node) | — |
| `reverb` | WebSocket (tempo real do placar) | **8081** |
| `queue` | `queue:work` filas `payments,apuracao,notifications` | — |
| `scheduler` | `schedule:work` (reconciliação, expiração, transição de rodada) | — |
| `mysql` | MySQL 8 (`megapalmeira` + `megapalmeira_test`) | **3308** |
| `redis` | Cache + filas + broadcast | **6380** |

As portas externas fogem do padrão (3308/6380/8081) para não conflitar com outros projetos na máquina.

## Comandos do dia a dia

```bash
./vendor/bin/pest                      # suíte completa (usa o MySQL do Docker, base _test)
./vendor/bin/pint                      # formatação
./vendor/bin/phpstan analyse --memory-limit=1G   # Larastan nível 6
npx vue-tsc --noEmit                   # type-check do front

npm run build && docker compose restart ssr   # IMPORTANTE: todo build novo exige restart do ssr

docker compose logs -f queue           # acompanhar jobs (webhooks, broadcast)
docker compose exec app php artisan bolao:reconciliar-pagamentos   # forçar reconciliação
```

### Jobs agendados (rodam sozinhos no `scheduler`)

| Comando | Frequência | Função |
|---|---|---|
| `bolao:transicionar-rodadas` | 1 min | `aberta` → `em andamento` quando o prazo de apostas vence |
| `bolao:reconciliar-pagamentos` | 2 min | consulta o Mercado Pago para apostas aguardando pagamento (cobre webhook perdido) |
| `bolao:expirar-apostas` | 1 min | expira apostas com QR PIX vencido |

## Pagamentos (Mercado Pago sandbox)

1. Crie uma aplicação em <https://www.mercadopago.com.br/developers>, copie o **Access Token de teste** (`TEST-...`) e a **assinatura secreta** de webhooks.
2. Configure `MP_ACCESS_TOKEN` e `MP_WEBHOOK_SECRET` no `.env` e rode `docker compose restart app queue scheduler`.
3. Webhook local: o MP não alcança `localhost`; a **reconciliação confirma o pagamento em até 2 minutos**. Para testar o webhook real, exponha com `ngrok http 8000`, configure a URL no painel do MP e em `MP_NOTIFICATION_URL`.
4. Sem credenciais, o checkout mostra "Não conseguimos gerar o QR" — o resto do sistema funciona normalmente (use a baixa manual no admin).

## Variáveis de ambiente

Além das padrão do Laravel (`APP_*`, `DB_*`, `REDIS_*`):

| Variável | Função |
|---|---|
| `APP_TIMEZONE` | `America/Maceio` — todos os horários do bolão |
| `BOLAO_ADMIN_EMAIL` | e-mail do admin criado pelo seeder |
| `MP_ACCESS_TOKEN` / `MP_WEBHOOK_SECRET` / `MP_NOTIFICATION_URL` | Mercado Pago |
| `REVERB_APP_ID/KEY/SECRET` | credenciais do app Reverb (gere valores próprios em produção) |
| `REVERB_HOST/PORT/SCHEME` | como o **backend** publica no Reverb (rede interna: `reverb:8080`) |
| `VITE_REVERB_HOST/PORT/SCHEME` | como o **navegador** conecta (local: `localhost:8081`; produção: domínio wss) |
| `REVERB_APP_MAX_MESSAGE_SIZE` / `REVERB_MAX_REQUEST_SIZE` | 1MB — o ranking completo viaja no payload do sorteio |
| `INERTIA_SSR_URL` | endereço interno do container SSR (`http://ssr:13714`) |

`VITE_*` são embutidas no build: mudou, rode `npm run build && docker compose restart ssr`.

## Deploy (Coolify)

A imagem de produção é o `docker/prod.Dockerfile` (multi-stage: assets → vendor → php-fpm; alvos extras `web` = nginx com fastcgi e `ssr` = Node com o bundle). O `docker-compose.prod.yml` orquestra tudo:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

No Coolify: crie um recurso Docker Compose apontando para `docker-compose.prod.yml`, defina as variáveis (inclusive `DB_PASSWORD`/`DB_ROOT_PASSWORD`) e aponte o domínio para o serviço `web`; para o tempo real, exponha o serviço `reverb` num subdomínio com TLS (`wss`) e ajuste `VITE_REVERB_*` antes do build. O entrypoint do `app` roda `migrate --force` e cacheia config/rotas/views a cada deploy.

**Antes de operar com dinheiro de verdade, siga o [`docs/checklist-go-live.md`](docs/checklist-go-live.md).**

## Estrutura

Toda regra de negócio mora em `app/Domain/Bolao/` (actions, services, eventos, enums) — controllers só orquestram. Dinheiro é sempre `int` em centavos. A tabela `bet_numbers` (uma linha por dezena de cartela, com o sorteio que a acendeu) é a fonte do ranking e dos desempates; o JSON `bets.numbers` é só exibição. Testes em `tests/Feature/Dominio` cobrem pontuação, desempates, rateio e o invariante `prêmios + administração == pote`.
