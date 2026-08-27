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
    const buscaCartelas = ref("");
    const aoVivo = ref(null);
    const recemAcesas = ref(/* @__PURE__ */ new Set());
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
      _push(`<header class="bg-papel text-tinta print:hidden"><div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3"><img src="/logoMega.png" alt="MegaPalmeira" class="h-16 w-auto"><div class="flex items-center gap-4">`);
      if (rodada.value) {
        _push(`<p class="hidden text-14 text-noite/70 sm:block">${ssrInterpolate(rodada.value.nome)} · ${ssrInterpolate(rodada.value.statusLabel)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(Link), {
        href: "/apostador/minhas-apostas",
        class: "text-14 font-bold text-tinta hover:underline"
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
        if (rodada.value.whatsappGroupUrl) {
          _push(`<section class="mt-6 print:hidden"><a${ssrRenderAttr("href", rodada.value.whatsappGroupUrl)} target="_blank" rel="noopener" class="flex items-center justify-center gap-2 rounded-lg border border-jade/50 bg-jade/10 px-6 py-3 font-display text-16 font-bold uppercase tracking-tight text-jade"><svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.02h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.24 8.24 0 0 1-1.26-4.37c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43-.14-.01-.31-.01-.47-.01-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z"></path></svg> Entrar no grupo do WhatsApp </a></section>`);
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
        _push(`<section class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3 print:hidden" aria-label="Resumo da rodada"><div class="rounded-lg bg-noite p-4"><p class="text-12 uppercase text-vidro">Prêmio de 10 pontos</p><p class="mt-1 font-mono text-20 font-tabular text-aceso">${ssrInterpolate(unref(brl)(rodada.value.premioPrincipalCents))}</p></div><div class="rounded-lg bg-noite p-4"><p class="text-12 uppercase text-vidro">Cartelas</p><p class="mt-1 font-mono text-20 font-tabular">${ssrInterpolate(rodada.value.cartelasPagas)}</p><p class="text-12 text-vidro">${ssrInterpolate(unref(brl)(rodada.value.valorCartelaCents))} cada</p></div><div class="rounded-lg bg-noite p-4">`);
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
          _push(`<section class="mt-8" aria-labelledby="cartelas-titulo"><div class="flex flex-wrap items-center justify-between gap-3 print:hidden"><h2 id="cartelas-titulo" class="text-14 uppercase tracking-wide text-vidro"> Cartelas (${ssrInterpolate(ranking.value.length)}) </h2><div class="flex items-center gap-2"><input${ssrRenderAttr("value", buscaCartelas.value)} type="search" placeholder="Buscar por nome" aria-label="Buscar cartela por nome" class="rounded border border-vidro/30 bg-noite px-3 py-1.5 text-14 focus:border-aceso focus:outline-none"><button type="button" class="rounded border border-vidro/40 px-3 py-1.5 text-14 text-vidro hover:text-papel"> Imprimir </button></div></div><ol class="mt-3 space-y-2 print:hidden"><!--[-->`);
          ssrRenderList(cartelasOrdenadas.value, (item) => {
            _push(`<li class="${ssrRenderClass([{ "border border-aceso/60": item.hitsCount === 9 }, "rounded-lg bg-noite p-3"])}"><div class="flex flex-wrap items-center gap-3"><span class="text-16">${ssrInterpolate(item.displayName)}</span><span class="font-mono text-12 font-tabular text-vidro">${ssrInterpolate(item.maskedPhone)}</span>`);
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
          _push(`<!--]--></ol><h2 class="hidden font-display text-20 font-black uppercase print:block"> MegaPalmeira — ${ssrInterpolate(rodada.value.nome)} — cartelas </h2><ul class="hidden divide-y divide-black/20 rounded-lg bg-papel px-4 font-mono text-14 font-tabular text-black print:block"><!--[-->`);
          ssrRenderList(cartelasOrdenadas.value, (item) => {
            _push(`<li class="py-2">${ssrInterpolate(item.displayName)} — ${ssrInterpolate(item.maskedPhone)} — ${ssrInterpolate(item.numbers.map((n) => String(n.number).padStart(2, "0")).join(" "))}</li>`);
          });
          _push(`<!--]--></ul></section>`);
        } else {
          _push(`<section class="mt-8 rounded-lg bg-noite p-6 print:hidden"><p class="text-20 text-vidro">Nenhuma cartela ainda. Seja o primeiro.</p></section>`);
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
        _push(`<main class="mx-auto max-w-5xl px-4"><div class="mt-16 rounded-lg bg-noite p-8 text-center"><img src="/logoMega.png" alt="MegaPalmeira" class="mx-auto h-24 w-auto"><p class="mt-3 text-16 text-vidro"> Nenhuma rodada em andamento no momento. Volte em breve — a próxima está chegando. </p></div></main>`);
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
