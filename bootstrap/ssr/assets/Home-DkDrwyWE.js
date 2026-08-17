import { defineComponent, ref, onMounted, mergeProps, useSSRContext, onUnmounted, computed, unref, withCtx, createTextVNode, toDisplayString } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderClass } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$2 } from "./Ball-Cix1i8dF.js";
import { a as dataHora, b as brl, c as dataCurta } from "./format-BNqt_JV5.js";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "InstallPrompt",
  __ssrInlineRender: true,
  setup(__props) {
    const visivel = ref(false);
    onMounted(() => {
      if (localStorage.getItem("bd-install-recusado") === "1") return;
      if (sessionStorage.getItem("bd-visita-contada") !== "1") {
        sessionStorage.setItem("bd-visita-contada", "1");
        const visitas = Number(localStorage.getItem("bd-visitas") ?? "0") + 1;
        localStorage.setItem("bd-visitas", String(visitas));
      }
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        if (Number(localStorage.getItem("bd-visitas") ?? "0") >= 2) {
          visivel.value = true;
        }
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (visivel.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: "fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-md items-center gap-3 rounded-lg border border-vidro/30 bg-noite p-3 shadow-lg print:hidden",
          role: "dialog",
          "aria-label": "Instalar o aplicativo"
        }, _attrs))}><p class="flex-1 text-14 text-papel"> Instale o MegaPalmeira na tela inicial e abra o placar num toque. </p><button type="button" class="rounded bg-aceso px-3 py-1.5 font-display text-12 font-bold uppercase text-tinta"> Instalar </button><button type="button" class="text-14 text-vidro underline"> Agora não </button></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/InstallPrompt.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Home",
  __ssrInlineRender: true,
  props: {
    rodada: {},
    sorteios: {},
    ranking: {},
    ganhadores: {}
  },
  setup(__props) {
    const props = __props;
    const rodada = ref(props.rodada);
    const sorteios = ref([...props.sorteios]);
    const ranking = ref(props.ranking.map((r) => ({ ...r, numbers: r.numbers.map((n) => ({ ...n })) })));
    const ganhadores = ref([...props.ganhadores]);
    const busca = ref("");
    const buscaCartelas = ref("");
    const aoVivo = ref(null);
    const recemAcesas = ref(/* @__PURE__ */ new Set());
    const subiram = ref(/* @__PURE__ */ new Set());
    const cartelaCampea = ref(null);
    const timeouts = [];
    const reduzMovimento = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function aplicarSnapshot(payload) {
      rodada.value = payload.rodada;
      sorteios.value = payload.sorteios;
      ranking.value = payload.ranking;
      ganhadores.value = payload.ganhadores;
    }
    function acendimento(payload) {
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
            aoVivo.value?.dezenas.push(dezena);
            for (const item of ranking.value) {
              const bola = item.numbers.find(
                (n) => n.number === dezena && n.matchedDrawId === null
              );
              if (bola) {
                bola.matchedDrawId = sorteio.id;
                item.hitsCount += 1;
                recemAcesas.value.add(`${item.betUuid}:${dezena}`);
              }
            }
            recemAcesas.value = new Set(recemAcesas.value);
          }, i * 400)
        );
      });
      const aposDezenas = sorteio.dezenas.length * 400 + 700;
      timeouts.push(
        setTimeout(() => {
          aplicarSnapshot(payload);
          aoVivo.value = null;
          const sobem = /* @__PURE__ */ new Set();
          for (const item of payload.ranking) {
            const antes = posicaoAntiga.get(item.betUuid);
            if (antes !== void 0 && item.position < antes) sobem.add(item.betUuid);
          }
          subiram.value = sobem;
          timeouts.push(setTimeout(() => subiram.value = /* @__PURE__ */ new Set(), 2e3));
          timeouts.push(setTimeout(() => recemAcesas.value = /* @__PURE__ */ new Set(), 1300));
          const campea = payload.ranking.find((r) => r.hitsCount === 10);
          if (campea) {
            cartelaCampea.value = campea;
            timeouts.push(setTimeout(() => cartelaCampea.value = null, 4e3));
          }
        }, aposDezenas)
      );
    }
    let pollTimer = null;
    async function pollFallback() {
      try {
        const resposta = await fetch("/api/rodada-atual/ranking", {
          headers: { Accept: "application/json" }
        });
        const dados = await resposta.json();
        if (dados.rodada) aplicarSnapshot(dados);
      } catch {
      }
    }
    let sairDoCanal = null;
    onMounted(async () => {
      if (!props.rodada) return;
      const canal = `rodada.${props.rodada.uuid}`;
      let conectado = null;
      try {
        const { getEcho, socketConectado } = await import("./echo-BK4Yv9l8.js");
        conectado = socketConectado;
        getEcho().channel(canal).listen(".sorteio.publicado", (payload) => acendimento(payload));
        sairDoCanal = () => getEcho().leaveChannel(canal);
      } catch {
      }
      timeouts.push(
        setTimeout(() => {
          if (!(conectado?.() ?? false) && pollTimer === null) {
            pollTimer = setInterval(pollFallback, 15e3);
          }
        }, 5e3)
      );
    });
    onUnmounted(() => {
      timeouts.forEach(clearTimeout);
      if (pollTimer) clearInterval(pollTimer);
      try {
        sairDoCanal?.();
      } catch {
      }
    });
    const lider = computed(() => ranking.value[0] ?? null);
    const faltam = computed(() => lider.value ? 10 - lider.value.hitsCount : 10);
    const rankingFiltrado = computed(
      () => ranking.value.filter(
        (item) => item.displayName.toLowerCase().includes(busca.value.toLowerCase())
      )
    );
    const cartelasOrdenadas = computed(
      () => [...ranking.value].sort((a, b) => a.displayName.localeCompare(b.displayName, "pt-BR")).filter(
        (item) => item.displayName.toLowerCase().includes(buscaCartelas.value.toLowerCase())
      )
    );
    const ultimoSorteio = computed(() => sorteios.value[0] ?? null);
    const sorteiosAnteriores = computed(() => sorteios.value.slice(1));
    const correcoes = computed(() => sorteios.value.filter((s) => s.corrigidoEm));
    const offline = ref(false);
    const marcarOffline = () => offline.value = true;
    const marcarOnline = () => offline.value = false;
    onMounted(() => {
      offline.value = !navigator.onLine;
      window.addEventListener("offline", marcarOffline);
      window.addEventListener("online", marcarOnline);
    });
    onUnmounted(() => {
      window.removeEventListener("offline", marcarOffline);
      window.removeEventListener("online", marcarOnline);
    });
    const agora = ref(Date.now());
    let clock = null;
    onMounted(() => {
      clock = setInterval(() => agora.value = Date.now(), 1e3);
    });
    onUnmounted(() => {
      if (clock) clearInterval(clock);
    });
    const contagem = computed(() => {
      if (!rodada.value || rodada.value.status !== "open") return null;
      const diff = new Date(rodada.value.encerramentoApostas).getTime() - agora.value;
      if (diff <= 0) return "Apostas encerradas";
      const h = Math.floor(diff / 36e5);
      const m = Math.floor(diff % 36e5 / 6e4);
      const s = Math.floor(diff % 6e4 / 1e3);
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: rodada.value ? rodada.value.nome : "MegaPalmeira"
      }, null, _parent));
      _push(`<div class="min-h-screen bg-tinta text-papel">`);
      if (cartelaCampea.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-tinta/95 px-4" role="alertdialog" aria-label="Cartela campeã"><div class="text-center"><p class="font-display text-72 font-black uppercase leading-none tracking-tight text-aceso"> Fechou! </p><p class="mt-4 text-28">${ssrInterpolate(cartelaCampea.value.displayName)}</p><p class="font-mono text-14 font-tabular text-vidro">${ssrInterpolate(cartelaCampea.value.maskedPhone)}</p><div class="mt-6 flex flex-wrap justify-center gap-2"><!--[-->`);
        ssrRenderList(cartelaCampea.value.numbers, (n) => {
          _push(ssrRenderComponent(_sfc_main$2, {
            key: n.number,
            n: n.number,
            lit: "",
            size: "hero"
          }, null, _parent));
        });
        _push(`<!--]--></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (offline.value) {
        _push(`<div class="border-b border-brasa/50 bg-brasa/10 px-4 py-2 text-center text-14 text-brasa print:hidden" role="alert"> Você está offline — o placar pode estar desatualizado. <button type="button" class="ml-2 underline">Recarregar</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<header class="border-b border-noite print:hidden"><div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3"><img src="/logoMega.png" alt="MegaPalmeira" class="h-9 w-auto"><div class="flex items-center gap-4">`);
      if (rodada.value) {
        _push(`<p class="hidden text-14 text-vidro sm:block">${ssrInterpolate(rodada.value.nome)} · ${ssrInterpolate(rodada.value.statusLabel)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(Link), {
        href: "/apostador/minhas-apostas",
        class: "text-14 text-aceso hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Minhas apostas`);
          } else {
            return [
              createTextVNode("Minhas apostas")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></header>`);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      if (rodada.value) {
        _push(`<main class="mx-auto max-w-5xl px-4 pb-16"><!--[-->`);
        ssrRenderList(correcoes.value, (s) => {
          _push(`<p class="mt-4 rounded border border-brasa/50 bg-brasa/10 px-3 py-2 text-14 text-brasa print:hidden" role="status"> Concurso ${ssrInterpolate(s.concurso)} corrigido em ${ssrInterpolate(unref(dataHora)(s.corrigidoEm))}: ${ssrInterpolate(s.motivoCorrecao)}</p>`);
        });
        _push(`<!--]-->`);
        if (aoVivo.value) {
          _push(`<section class="mt-6 rounded-lg border border-aceso/60 bg-noite p-4 print:hidden" aria-live="polite" aria-label="Sorteio sendo publicado agora"><p class="text-14 text-vidro"> Saiu o concurso <span class="font-mono font-tabular text-papel">${ssrInterpolate(aoVivo.value.concurso)}</span>… </p><div class="mt-3 flex min-h-12 flex-wrap gap-2"><!--[-->`);
          ssrRenderList(aoVivo.value.dezenas, (n) => {
            _push(ssrRenderComponent(_sfc_main$2, {
              key: n,
              n,
              lit: "",
              bloom: "",
              size: "hero",
              contest: aoVivo.value.concurso
            }, null, _parent));
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (lider.value) {
          _push(`<section class="mt-8 print:hidden" aria-labelledby="hero-titulo"><h1 id="hero-titulo" class="text-14 uppercase tracking-wide text-vidro">${ssrInterpolate(rodada.value.status === "closed" ? "Cartela campeã" : "Quem está mais perto")}</h1><div class="mt-3 rounded-lg bg-noite p-5"><div class="flex flex-wrap items-center justify-between gap-4"><div><p class="font-display text-28 font-black uppercase tracking-tight">${ssrInterpolate(lider.value.displayName)}</p><p class="font-mono text-14 font-tabular text-vidro">${ssrInterpolate(lider.value.maskedPhone)}</p></div>`);
          if (faltam.value > 0) {
            _push(`<p class="font-display text-72 font-black uppercase leading-none tracking-tight text-aceso"> faltam ${ssrInterpolate(faltam.value)}</p>`);
          } else {
            _push(`<p class="font-display text-72 font-black uppercase leading-none text-aceso"> fechou! </p>`);
          }
          _push(`</div><div class="mt-4 grid grid-cols-5 gap-2 sm:flex sm:flex-wrap"><!--[-->`);
          ssrRenderList(lider.value.numbers, (n) => {
            _push(ssrRenderComponent(_sfc_main$2, {
              key: n.number,
              n: n.number,
              lit: n.matchedDrawId !== null,
              "just-lit": recemAcesas.value.has(`${lider.value.betUuid}:${n.number}`),
              size: "hero"
            }, null, _parent));
          });
          _push(`<!--]--></div></div></section>`);
        } else {
          _push(`<section class="mt-8 rounded-lg bg-noite p-6 print:hidden"><p class="text-20 text-vidro">Nenhuma cartela ainda. Seja o primeiro.</p></section>`);
        }
        if (rodada.value.status === "open") {
          _push(`<section class="mt-6 print:hidden">`);
          _push(ssrRenderComponent(unref(Link), {
            href: "/apostar",
            class: "block rounded-lg bg-aceso px-6 py-4 text-center font-display text-20 font-black uppercase tracking-tight text-tinta"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Fazer minha aposta · ${ssrInterpolate(unref(brl)(rodada.value.valorCartelaCents))}`);
              } else {
                return [
                  createTextVNode(" Fazer minha aposta · " + toDisplayString(unref(brl)(rodada.value.valorCartelaCents)), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</section>`);
        } else {
          _push(`<!---->`);
        }
        if (ganhadores.value.length) {
          _push(`<section class="mt-6 rounded-lg border border-jade/40 bg-noite p-4 print:hidden"><h2 class="font-display text-16 font-bold uppercase text-jade">Premiação</h2><ul class="mt-2 space-y-1 text-14"><!--[-->`);
          ssrRenderList(ganhadores.value, (g, i) => {
            _push(`<li class="flex justify-between gap-4"><span>${ssrInterpolate(g.categoria)} — ${ssrInterpolate(g.nome)}</span><span class="font-mono font-tabular text-jade">${ssrInterpolate(unref(brl)(g.valorCents))}</span></li>`);
          });
          _push(`<!--]--></ul></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<section class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 print:hidden" aria-label="Resumo da rodada"><div class="rounded-lg bg-noite p-4"><p class="text-12 uppercase text-vidro">Pote</p><p class="mt-1 font-mono text-20 font-tabular text-jade">${ssrInterpolate(unref(brl)(rodada.value.poteCents))}</p>`);
        if (rodada.value.rolloverCents > 0) {
          _push(`<p class="text-12 text-vidro"> inclui ${ssrInterpolate(unref(brl)(rodada.value.rolloverCents))} da rodada anterior </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="rounded-lg bg-noite p-4"><p class="text-12 uppercase text-vidro">Prêmio de 10 pontos</p><p class="mt-1 font-mono text-20 font-tabular text-aceso">${ssrInterpolate(unref(brl)(rodada.value.premioPrincipalCents))}</p></div><div class="rounded-lg bg-noite p-4"><p class="text-12 uppercase text-vidro">Cartelas</p><p class="mt-1 font-mono text-20 font-tabular">${ssrInterpolate(rodada.value.cartelasPagas)}</p><p class="text-12 text-vidro">${ssrInterpolate(unref(brl)(rodada.value.valorCartelaCents))} cada</p></div><div class="rounded-lg bg-noite p-4">`);
        if (rodada.value.status === "open") {
          _push(`<!--[--><p class="text-12 uppercase text-vidro">Apostas encerram em</p><p class="mt-1 font-mono text-20 font-tabular text-brasa">${ssrInterpolate(contagem.value)}</p><!--]-->`);
        } else {
          _push(`<!--[--><p class="text-12 uppercase text-vidro">Sorteios</p><p class="mt-1 font-mono text-20 font-tabular">${ssrInterpolate(rodada.value.sorteiosPublicados)}`);
          if (rodada.value.maxSorteios > 0) {
            _push(`<!--[-->/${ssrInterpolate(rodada.value.maxSorteios)}<!--]-->`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p>`);
          if (rodada.value.maxSorteios === 0) {
            _push(`<p class="text-12 text-vidro">até alguém ganhar</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        }
        _push(`</div></section>`);
        if (ultimoSorteio.value && !aoVivo.value) {
          _push(`<section class="mt-8 print:hidden" aria-labelledby="dezenas-titulo"><h2 id="dezenas-titulo" class="text-14 uppercase tracking-wide text-vidro">Últimas dezenas</h2><div class="mt-3 rounded-lg bg-noite p-4"><p class="text-14 text-vidro"> Concurso <span class="font-mono font-tabular text-papel">${ssrInterpolate(ultimoSorteio.value.concurso)}</span> · ${ssrInterpolate(unref(dataCurta)(ultimoSorteio.value.data + "T12:00:00"))}</p><div class="mt-3 flex flex-wrap gap-2"><!--[-->`);
          ssrRenderList(ultimoSorteio.value.dezenas, (n) => {
            _push(ssrRenderComponent(_sfc_main$2, {
              key: n,
              n,
              lit: "",
              size: "hero",
              contest: ultimoSorteio.value.concurso
            }, null, _parent));
          });
          _push(`<!--]--></div></div>`);
          if (sorteiosAnteriores.value.length) {
            _push(`<div class="mt-2 flex gap-2 overflow-x-auto pb-2"><!--[-->`);
            ssrRenderList(sorteiosAnteriores.value, (s) => {
              _push(`<div class="shrink-0 rounded-lg bg-noite px-3 py-2"><p class="text-12 text-vidro">${ssrInterpolate(s.concurso)} · ${ssrInterpolate(unref(dataCurta)(s.data + "T12:00:00"))}</p><p class="mt-1 font-mono text-14 font-tabular">${ssrInterpolate(s.dezenas.map((n) => String(n).padStart(2, "0")).join(" "))}</p></div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</section>`);
        } else {
          _push(`<!---->`);
        }
        if (ranking.value.length) {
          _push(`<section class="mt-8 print:hidden" aria-labelledby="ranking-titulo"><div class="flex flex-wrap items-center justify-between gap-3"><h2 id="ranking-titulo" class="text-14 uppercase tracking-wide text-vidro">Ranking</h2><input${ssrRenderAttr("value", busca.value)} type="search" placeholder="Buscar por nome" aria-label="Buscar cartela por nome" class="rounded border border-vidro/30 bg-noite px-3 py-1.5 text-14 focus:border-aceso focus:outline-none"></div><ol${ssrRenderAttrs({
            name: "fila",
            class: "mt-3 space-y-2"
          })}>`);
          ssrRenderList(rankingFiltrado.value, (item) => {
            _push(`<li class="${ssrRenderClass([{
              "border border-aceso/60": item.hitsCount === 9,
              "destaque-subiu": subiram.value.has(item.betUuid)
            }, "rounded-lg bg-noite p-3"])}"><div class="flex flex-wrap items-center gap-3"><span class="w-8 font-mono text-14 font-tabular text-vidro">${ssrInterpolate(item.position)}º</span><span class="text-16">${ssrInterpolate(item.displayName)}</span><span class="font-mono text-12 font-tabular text-vidro">${ssrInterpolate(item.maskedPhone)}</span>`);
            if (item.hitsCount === 9) {
              _push(`<span class="rounded bg-aceso/15 px-2 py-0.5 text-12 font-bold uppercase text-aceso"> um número </span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<span class="${ssrRenderClass([item.hitsCount >= 9 ? "text-aceso" : "", "ml-auto font-mono text-16 font-tabular"])}">${ssrInterpolate(item.hitsCount)} pts </span></div><div class="mt-2 flex flex-wrap gap-1.5"><!--[-->`);
            ssrRenderList(item.numbers, (n) => {
              _push(ssrRenderComponent(_sfc_main$2, {
                key: n.number,
                n: n.number,
                lit: n.matchedDrawId !== null,
                "just-lit": recemAcesas.value.has(`${item.betUuid}:${n.number}`),
                size: "md"
              }, null, _parent));
            });
            _push(`<!--]--></div></li>`);
          });
          _push(`</ol></section>`);
        } else {
          _push(`<!---->`);
        }
        if (ranking.value.length) {
          _push(`<section class="mt-8" aria-labelledby="cartelas-titulo"><div class="flex flex-wrap items-center justify-between gap-3 print:hidden"><h2 id="cartelas-titulo" class="text-14 uppercase tracking-wide text-vidro"> Todas as cartelas pagas (${ssrInterpolate(ranking.value.length)}) </h2><div class="flex items-center gap-2"><input${ssrRenderAttr("value", buscaCartelas.value)} type="search" placeholder="Buscar" aria-label="Buscar na lista de cartelas" class="rounded border border-vidro/30 bg-noite px-3 py-1.5 text-14 focus:border-aceso focus:outline-none"><button type="button" class="rounded border border-vidro/40 px-3 py-1.5 text-14 text-vidro hover:text-papel"> Imprimir </button></div></div><h2 class="hidden font-display text-20 font-black uppercase print:block"> MegaPalmeira — ${ssrInterpolate(rodada.value.nome)} — cartelas pagas </h2><ul class="mt-3 divide-y divide-vidro/10 rounded-lg bg-noite px-4 font-mono text-14 font-tabular print:divide-black/20 print:bg-papel print:text-black"><!--[-->`);
          ssrRenderList(cartelasOrdenadas.value, (item) => {
            _push(`<li class="py-2">${ssrInterpolate(item.displayName)} — ${ssrInterpolate(item.maskedPhone)} — ${ssrInterpolate(item.numbers.map((n) => String(n.number).padStart(2, "0")).join(" "))}</li>`);
          });
          _push(`<!--]--></ul></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<footer class="mt-12 border-t border-noite pt-6 text-14 text-vidro print:hidden"><p> Jogo é entretenimento: aposte com responsabilidade e somente se tiver 18 anos ou mais. </p><p class="mt-2">`);
        _push(ssrRenderComponent(unref(Link), {
          href: "/regulamento",
          class: "underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Regulamento`);
            } else {
              return [
                createTextVNode("Regulamento")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(` · Sobras de centavos de qualquer divisão vão para a administração. </p></footer></main>`);
      } else {
        _push(`<main class="mx-auto max-w-5xl px-4"><div class="mt-16 rounded-lg bg-noite p-8 text-center"><img src="/logoMega.png" alt="MegaPalmeira" class="mx-auto h-16 w-auto"><p class="mt-3 text-16 text-vidro"> Nenhuma rodada em andamento no momento. Volte em breve — a próxima está chegando. </p></div></main>`);
      }
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Home.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
