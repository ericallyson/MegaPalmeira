import { defineComponent, ref, unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, withDirectives, vModelText, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderClass } from "vue/server-renderer";
import { useForm, Head, Link, router } from "@inertiajs/vue3";
import axios from "axios";
import { _ as _sfc_main$1 } from "./AdminLayout-6klDPsIr.js";
import { c as dataCurta, a as dataHora, b as brl, d as dezena } from "./format-BNqt_JV5.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    rodada: {},
    sorteios: {},
    ranking: {},
    payouts: {}
  },
  setup(__props) {
    const props = __props;
    const sorteioForm = useForm({
      contest_number: null,
      drawn_on: "",
      numbers: ["", "", "", "", "", ""]
    });
    const previa = ref(null);
    const previaErro = ref(null);
    const motivoCancelamento = ref("");
    const mostrandoCancelamento = ref(false);
    async function verPrevia() {
      previaErro.value = null;
      try {
        const { data } = await axios.post(`/admin/rodadas/${props.rodada.uuid}/sorteios/previa`, {
          contest_number: sorteioForm.contest_number,
          drawn_on: sorteioForm.drawn_on,
          numbers: sorteioForm.numbers.map(Number)
        });
        previa.value = data;
      } catch (e) {
        const err = e;
        previaErro.value = err.response?.data?.message ?? "Não foi possível calcular a prévia.";
        previa.value = null;
      }
    }
    function publicar() {
      sorteioForm.transform((data) => ({ ...data, numbers: data.numbers.map(Number) })).post(`/admin/rodadas/${props.rodada.uuid}/sorteios`, {
        onSuccess: () => {
          sorteioForm.reset();
          previa.value = null;
        }
      });
    }
    function abrir() {
      router.post(`/admin/rodadas/${props.rodada.uuid}/abrir`);
    }
    function encerrar() {
      if (confirm("Encerrar a rodada agora e calcular os prêmios?")) {
        router.post(`/admin/rodadas/${props.rodada.uuid}/encerrar`);
      }
    }
    function cancelar() {
      router.post(`/admin/rodadas/${props.rodada.uuid}/cancelar`, { motivo: motivoCancelamento.value });
    }
    const obsPagamento = ref({});
    function registrarPagamento(payoutId) {
      router.post(`/admin/payouts/${payoutId}/pagar`, {
        observacoes: obsPagamento.value[payoutId] ?? ""
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: __props.rodada.nome
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-wrap items-start justify-between gap-4"${_scopeId}><div${_scopeId}><h1 class="font-display text-28 font-black uppercase tracking-tight"${_scopeId}>${ssrInterpolate(__props.rodada.nome)}</h1><p class="mt-1 text-14 text-vidro"${_scopeId}>${ssrInterpolate(__props.rodada.statusLabel)} · começa em ${ssrInterpolate(unref(dataCurta)(__props.rodada.inicio + "T12:00:00"))} · apostas até ${ssrInterpolate(unref(dataHora)(__props.rodada.encerramentoApostas))}</p></div><div class="flex flex-wrap gap-2"${_scopeId}>`);
            if (__props.rodada.status === "closed" || __props.rodada.status === "canceled") {
              _push2(ssrRenderComponent(unref(Link), {
                href: `/admin/rodadas/${__props.rodada.uuid}/relatorio`,
                class: "rounded bg-papel px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Relatório de fechamento `);
                  } else {
                    return [
                      createTextVNode(" Relatório de fechamento ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (__props.rodada.status === "draft") {
              _push2(`<button type="button" class="rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"${_scopeId}> Abrir apostas </button>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.rodada.status === "running") {
              _push2(`<button type="button" class="rounded border border-vidro/40 px-4 py-2 font-display text-14 font-bold uppercase text-vidro"${_scopeId}> Encerrar rodada </button>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.rodada.status !== "closed" && __props.rodada.status !== "canceled") {
              _push2(`<button type="button" class="rounded border border-erro/40 px-4 py-2 font-display text-14 font-bold uppercase text-erro"${_scopeId}> Cancelar rodada </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
            if (mostrandoCancelamento.value) {
              _push2(`<div class="mt-4 rounded-lg border border-erro/40 bg-noite p-4"${_scopeId}><label class="block text-14 text-vidro" for="motivo-cancelamento"${_scopeId}> Motivo do cancelamento (fica na auditoria) </label><input id="motivo-cancelamento"${ssrRenderAttr("value", motivoCancelamento.value)} type="text" class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-16 focus:border-aceso focus:outline-none"${_scopeId}><button type="button" class="mt-3 rounded bg-erro px-4 py-2 font-display text-14 font-bold uppercase text-papel"${_scopeId}> Confirmar cancelamento </button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4"${_scopeId}><div class="rounded-lg bg-noite p-4"${_scopeId}><p class="text-12 uppercase text-vidro"${_scopeId}>Pote</p><p class="mt-1 font-mono text-20 font-tabular text-jade"${_scopeId}>${ssrInterpolate(unref(brl)(__props.rodada.poteCents))}</p>`);
            if (__props.rodada.rolloverCents > 0) {
              _push2(`<p class="text-12 text-vidro"${_scopeId}> inclui ${ssrInterpolate(unref(brl)(__props.rodada.rolloverCents))} herdados </p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="rounded-lg bg-noite p-4"${_scopeId}><p class="text-12 uppercase text-vidro"${_scopeId}>Cartelas</p><p class="mt-1 font-mono text-20 font-tabular"${_scopeId}>${ssrInterpolate(__props.rodada.apostasPagas)} pagas</p><p class="text-12 text-vidro"${_scopeId}>${ssrInterpolate(__props.rodada.apostasPendentes)} pendentes</p></div><div class="rounded-lg bg-noite p-4"${_scopeId}><p class="text-12 uppercase text-vidro"${_scopeId}>Divisão</p><p class="mt-1 font-mono text-16 font-tabular"${_scopeId}>${ssrInterpolate(__props.rodada.pctMain)}/${ssrInterpolate(__props.rodada.pctSecond)}/${ssrInterpolate(__props.rodada.pctAdmin)}</p><p class="text-12 text-vidro"${_scopeId}>${ssrInterpolate(__props.rodada.maxSorteios === 0 ? "Sorteios até alguém ganhar" : `Até ${__props.rodada.maxSorteios} sorteios · ${__props.rodada.politicaSemVencedor}`)}</p></div><div class="rounded-lg bg-noite p-4"${_scopeId}><p class="text-12 uppercase text-vidro"${_scopeId}>Valor da cartela</p><p class="mt-1 font-mono text-20 font-tabular"${_scopeId}>${ssrInterpolate(unref(brl)(__props.rodada.valorCents))}</p></div></div>`);
            if (__props.payouts.length) {
              _push2(`<div class="mt-6 rounded-lg bg-noite p-4"${_scopeId}><h2 class="font-display text-16 font-bold uppercase text-jade"${_scopeId}>Prêmios</h2><table class="mt-2 w-full text-left text-14"${_scopeId}><tbody${_scopeId}><!--[-->`);
              ssrRenderList(__props.payouts, (p) => {
                _push2(`<tr class="border-b border-vidro/10 last:border-0 align-top"${_scopeId}><td class="py-2"${_scopeId}>${ssrInterpolate(p.categoria)}</td><td class="py-2"${_scopeId}>${ssrInterpolate(p.nome)}</td><td class="py-2 font-mono font-tabular text-jade"${_scopeId}>${ssrInterpolate(unref(brl)(p.valorCents))}</td><td class="py-2"${_scopeId}>`);
                if (p.pagoEm) {
                  _push2(`<span class="text-jade"${_scopeId}> Pago em ${ssrInterpolate(unref(dataHora)(p.pagoEm))} `);
                  if (p.observacoes) {
                    _push2(`<span class="text-vidro"${_scopeId}> · ${ssrInterpolate(p.observacoes)}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</span>`);
                } else {
                  _push2(`<div class="flex flex-wrap items-center gap-2"${_scopeId}><input${ssrRenderAttr("value", obsPagamento.value[p.id])} type="text" placeholder="Observação (ex.: PIX 30/07)"${ssrRenderAttr("aria-label", `Observação do pagamento de ${p.nome}`)} class="rounded border border-vidro/30 bg-tinta px-2 py-1 text-12 focus:border-aceso focus:outline-none"${_scopeId}><button type="button" class="rounded bg-jade px-3 py-1 font-display text-12 font-bold uppercase text-tinta"${_scopeId}> Registrar pagamento </button></div>`);
                }
                _push2(`</td></tr>`);
              });
              _push2(`<!--]--></tbody></table></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.rodada.status === "running") {
              _push2(`<section class="mt-8 rounded-lg bg-noite p-4"${_scopeId}><h2 class="font-display text-16 font-bold uppercase"${_scopeId}>Lançar sorteio</h2><div class="mt-4 grid gap-4 sm:grid-cols-2"${_scopeId}><div${_scopeId}><label class="block text-14 text-vidro" for="concurso"${_scopeId}>Número do concurso</label><input id="concurso"${ssrRenderAttr("value", unref(sorteioForm).contest_number)} type="number" min="1" class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"${_scopeId}>`);
              if (unref(sorteioForm).errors.contest_number) {
                _push2(`<p class="mt-1 text-12 text-erro"${_scopeId}>${ssrInterpolate(unref(sorteioForm).errors.contest_number)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div${_scopeId}><label class="block text-14 text-vidro" for="drawn_on"${_scopeId}>Data do sorteio</label><input id="drawn_on"${ssrRenderAttr("value", unref(sorteioForm).drawn_on)} type="date" class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-16 focus:border-aceso focus:outline-none"${_scopeId}>`);
              if (unref(sorteioForm).errors.drawn_on) {
                _push2(`<p class="mt-1 text-12 text-erro"${_scopeId}>${ssrInterpolate(unref(sorteioForm).errors.drawn_on)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="mt-4"${_scopeId}><p class="text-14 text-vidro"${_scopeId}>As 6 dezenas</p><div class="mt-1 flex flex-wrap gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(6, (i) => {
                _push2(`<input${ssrRenderAttr("value", unref(sorteioForm).numbers[i - 1])} type="number" min="1" max="60"${ssrRenderAttr("aria-label", `Dezena ${i}`)} class="w-16 rounded border border-vidro/30 bg-tinta px-2 py-2 text-center font-mono text-16 font-tabular focus:border-aceso focus:outline-none"${_scopeId}>`);
              });
              _push2(`<!--]--></div>`);
              if (unref(sorteioForm).errors.numbers) {
                _push2(`<p class="mt-1 text-12 text-erro"${_scopeId}>${ssrInterpolate(unref(sorteioForm).errors.numbers)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="mt-4 flex flex-wrap items-center gap-3"${_scopeId}><button type="button" class="rounded border border-aceso px-4 py-2 font-display text-14 font-bold uppercase text-aceso"${_scopeId}> Ver prévia </button><button type="button"${ssrIncludeBooleanAttr(!previa.value || unref(sorteioForm).processing) ? " disabled" : ""} class="rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-50"${_scopeId}> Publicar sorteio </button>`);
              if (!previa.value) {
                _push2(`<p class="text-12 text-vidro"${_scopeId}>A prévia é obrigatória antes de publicar.</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
              if (previaErro.value) {
                _push2(`<p class="mt-3 rounded border border-erro/40 bg-erro/10 px-3 py-2 text-14 text-erro"${_scopeId}>${ssrInterpolate(previaErro.value)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              if (previa.value) {
                _push2(`<div class="mt-3 rounded border border-aceso/40 bg-tinta px-4 py-3 text-14" role="status"${_scopeId}><p${_scopeId}><strong class="font-mono font-tabular"${_scopeId}>${ssrInterpolate(previa.value.cartelasQuePontuam)}</strong> cartelas pontuam · <strong class="font-mono font-tabular"${_scopeId}>${ssrInterpolate(previa.value.cartelasQueChegamADez)}</strong> chegam a 10 pontos `);
                if (previa.value.rodadaSeraEncerrada) {
                  _push2(`<!--[--> · a rodada será <strong class="text-aceso"${_scopeId}>ENCERRADA</strong><!--]-->`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</p>`);
                if (previa.value.cartelasQueChegamADez > 0) {
                  _push2(`<p class="mt-1 text-jade"${_scopeId}> Prêmio de ${ssrInterpolate(unref(brl)(previa.value.premioPrincipalCents))} dividido entre ${ssrInterpolate(previa.value.cartelasQueChegamADez)} — ${ssrInterpolate(unref(brl)(previa.value.cotaPorGanhadorCents))} cada. </p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</section>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<section class="mt-8"${_scopeId}><h2 class="font-display text-16 font-bold uppercase"${_scopeId}>Sorteios publicados</h2>`);
            if (__props.sorteios.length === 0) {
              _push2(`<div class="mt-2 rounded-lg bg-noite p-4 text-14 text-vidro"${_scopeId}> Nenhum sorteio publicado ainda. </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--[-->`);
            ssrRenderList(__props.sorteios, (s) => {
              _push2(`<div class="mt-2 rounded-lg bg-noite p-4"${_scopeId}><div class="flex flex-wrap items-center justify-between gap-2"${_scopeId}><p class="text-14"${_scopeId}><span class="font-display font-bold"${_scopeId}>Concurso ${ssrInterpolate(s.concurso)}</span><span class="text-vidro"${_scopeId}> · ${ssrInterpolate(unref(dataCurta)(s.data + "T12:00:00"))} · ${ssrInterpolate(s.sequencia)}º da rodada</span></p><div class="flex gap-1"${_scopeId}><!--[-->`);
              ssrRenderList(s.dezenas, (n) => {
                _push2(`<span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-aceso font-mono text-14 font-bold font-tabular text-tinta"${_scopeId}>${ssrInterpolate(unref(dezena)(n))}</span>`);
              });
              _push2(`<!--]--></div></div>`);
              if (s.corrigidoEm) {
                _push2(`<p class="mt-2 text-12 text-brasa"${_scopeId}> Corrigido em ${ssrInterpolate(unref(dataHora)(s.corrigidoEm))}: ${ssrInterpolate(s.motivoCorrecao)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            });
            _push2(`<!--]--></section><section class="mt-8"${_scopeId}><h2 class="font-display text-16 font-bold uppercase"${_scopeId}>Classificação</h2>`);
            if (__props.ranking.length === 0) {
              _push2(`<div class="mt-2 rounded-lg bg-noite p-4 text-14 text-vidro"${_scopeId}> Nenhuma cartela paga ainda. </div>`);
            } else {
              _push2(`<ol class="mt-2 space-y-1"${_scopeId}><!--[-->`);
              ssrRenderList(__props.ranking, (item) => {
                _push2(`<li class="flex flex-wrap items-center gap-3 rounded bg-noite px-3 py-2 text-14"${_scopeId}><span class="w-8 font-mono font-tabular text-vidro"${_scopeId}>${ssrInterpolate(item.position)}º</span><span class="min-w-32"${_scopeId}>${ssrInterpolate(item.displayName)}</span><span class="font-mono text-12 font-tabular text-vidro"${_scopeId}>${ssrInterpolate(item.maskedPhone)}</span><span class="flex flex-wrap gap-1"${_scopeId}><!--[-->`);
                ssrRenderList(item.numbers, (n) => {
                  _push2(`<span class="${ssrRenderClass([n.matchedDrawId ? "bg-aceso font-bold text-tinta" : "border border-vidro/30 text-vidro", "inline-flex h-6 w-6 items-center justify-center rounded-full font-mono text-12 font-tabular"])}"${_scopeId}>${ssrInterpolate(unref(dezena)(n.number))}</span>`);
                });
                _push2(`<!--]--></span><span class="${ssrRenderClass([item.hitsCount >= 9 ? "text-aceso" : "", "ml-auto font-mono font-tabular"])}"${_scopeId}>${ssrInterpolate(item.hitsCount)} pts </span></li>`);
              });
              _push2(`<!--]--></ol>`);
            }
            _push2(`</section>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-wrap items-start justify-between gap-4" }, [
                createVNode("div", null, [
                  createVNode("h1", { class: "font-display text-28 font-black uppercase tracking-tight" }, toDisplayString(__props.rodada.nome), 1),
                  createVNode("p", { class: "mt-1 text-14 text-vidro" }, toDisplayString(__props.rodada.statusLabel) + " · começa em " + toDisplayString(unref(dataCurta)(__props.rodada.inicio + "T12:00:00")) + " · apostas até " + toDisplayString(unref(dataHora)(__props.rodada.encerramentoApostas)), 1)
                ]),
                createVNode("div", { class: "flex flex-wrap gap-2" }, [
                  __props.rodada.status === "closed" || __props.rodada.status === "canceled" ? (openBlock(), createBlock(unref(Link), {
                    key: 0,
                    href: `/admin/rodadas/${__props.rodada.uuid}/relatorio`,
                    class: "rounded bg-papel px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Relatório de fechamento ")
                    ]),
                    _: 1
                  }, 8, ["href"])) : createCommentVNode("", true),
                  __props.rodada.status === "draft" ? (openBlock(), createBlock("button", {
                    key: 1,
                    type: "button",
                    class: "rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta",
                    onClick: abrir
                  }, " Abrir apostas ")) : createCommentVNode("", true),
                  __props.rodada.status === "running" ? (openBlock(), createBlock("button", {
                    key: 2,
                    type: "button",
                    class: "rounded border border-vidro/40 px-4 py-2 font-display text-14 font-bold uppercase text-vidro",
                    onClick: encerrar
                  }, " Encerrar rodada ")) : createCommentVNode("", true),
                  __props.rodada.status !== "closed" && __props.rodada.status !== "canceled" ? (openBlock(), createBlock("button", {
                    key: 3,
                    type: "button",
                    class: "rounded border border-erro/40 px-4 py-2 font-display text-14 font-bold uppercase text-erro",
                    onClick: ($event) => mostrandoCancelamento.value = !mostrandoCancelamento.value
                  }, " Cancelar rodada ", 8, ["onClick"])) : createCommentVNode("", true)
                ])
              ]),
              mostrandoCancelamento.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mt-4 rounded-lg border border-erro/40 bg-noite p-4"
              }, [
                createVNode("label", {
                  class: "block text-14 text-vidro",
                  for: "motivo-cancelamento"
                }, " Motivo do cancelamento (fica na auditoria) "),
                withDirectives(createVNode("input", {
                  id: "motivo-cancelamento",
                  "onUpdate:modelValue": ($event) => motivoCancelamento.value = $event,
                  type: "text",
                  class: "mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-16 focus:border-aceso focus:outline-none"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, motivoCancelamento.value]
                ]),
                createVNode("button", {
                  type: "button",
                  class: "mt-3 rounded bg-erro px-4 py-2 font-display text-14 font-bold uppercase text-papel",
                  onClick: cancelar
                }, " Confirmar cancelamento ")
              ])) : createCommentVNode("", true),
              createVNode("div", { class: "mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4" }, [
                createVNode("div", { class: "rounded-lg bg-noite p-4" }, [
                  createVNode("p", { class: "text-12 uppercase text-vidro" }, "Pote"),
                  createVNode("p", { class: "mt-1 font-mono text-20 font-tabular text-jade" }, toDisplayString(unref(brl)(__props.rodada.poteCents)), 1),
                  __props.rodada.rolloverCents > 0 ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-12 text-vidro"
                  }, " inclui " + toDisplayString(unref(brl)(__props.rodada.rolloverCents)) + " herdados ", 1)) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "rounded-lg bg-noite p-4" }, [
                  createVNode("p", { class: "text-12 uppercase text-vidro" }, "Cartelas"),
                  createVNode("p", { class: "mt-1 font-mono text-20 font-tabular" }, toDisplayString(__props.rodada.apostasPagas) + " pagas", 1),
                  createVNode("p", { class: "text-12 text-vidro" }, toDisplayString(__props.rodada.apostasPendentes) + " pendentes", 1)
                ]),
                createVNode("div", { class: "rounded-lg bg-noite p-4" }, [
                  createVNode("p", { class: "text-12 uppercase text-vidro" }, "Divisão"),
                  createVNode("p", { class: "mt-1 font-mono text-16 font-tabular" }, toDisplayString(__props.rodada.pctMain) + "/" + toDisplayString(__props.rodada.pctSecond) + "/" + toDisplayString(__props.rodada.pctAdmin), 1),
                  createVNode("p", { class: "text-12 text-vidro" }, toDisplayString(__props.rodada.maxSorteios === 0 ? "Sorteios até alguém ganhar" : `Até ${__props.rodada.maxSorteios} sorteios · ${__props.rodada.politicaSemVencedor}`), 1)
                ]),
                createVNode("div", { class: "rounded-lg bg-noite p-4" }, [
                  createVNode("p", { class: "text-12 uppercase text-vidro" }, "Valor da cartela"),
                  createVNode("p", { class: "mt-1 font-mono text-20 font-tabular" }, toDisplayString(unref(brl)(__props.rodada.valorCents)), 1)
                ])
              ]),
              __props.payouts.length ? (openBlock(), createBlock("div", {
                key: 1,
                class: "mt-6 rounded-lg bg-noite p-4"
              }, [
                createVNode("h2", { class: "font-display text-16 font-bold uppercase text-jade" }, "Prêmios"),
                createVNode("table", { class: "mt-2 w-full text-left text-14" }, [
                  createVNode("tbody", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.payouts, (p) => {
                      return openBlock(), createBlock("tr", {
                        key: p.id,
                        class: "border-b border-vidro/10 last:border-0 align-top"
                      }, [
                        createVNode("td", { class: "py-2" }, toDisplayString(p.categoria), 1),
                        createVNode("td", { class: "py-2" }, toDisplayString(p.nome), 1),
                        createVNode("td", { class: "py-2 font-mono font-tabular text-jade" }, toDisplayString(unref(brl)(p.valorCents)), 1),
                        createVNode("td", { class: "py-2" }, [
                          p.pagoEm ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "text-jade"
                          }, [
                            createTextVNode(" Pago em " + toDisplayString(unref(dataHora)(p.pagoEm)) + " ", 1),
                            p.observacoes ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "text-vidro"
                            }, " · " + toDisplayString(p.observacoes), 1)) : createCommentVNode("", true)
                          ])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "flex flex-wrap items-center gap-2"
                          }, [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => obsPagamento.value[p.id] = $event,
                              type: "text",
                              placeholder: "Observação (ex.: PIX 30/07)",
                              "aria-label": `Observação do pagamento de ${p.nome}`,
                              class: "rounded border border-vidro/30 bg-tinta px-2 py-1 text-12 focus:border-aceso focus:outline-none"
                            }, null, 8, ["onUpdate:modelValue", "aria-label"]), [
                              [vModelText, obsPagamento.value[p.id]]
                            ]),
                            createVNode("button", {
                              type: "button",
                              class: "rounded bg-jade px-3 py-1 font-display text-12 font-bold uppercase text-tinta",
                              onClick: ($event) => registrarPagamento(p.id)
                            }, " Registrar pagamento ", 8, ["onClick"])
                          ]))
                        ])
                      ]);
                    }), 128))
                  ])
                ])
              ])) : createCommentVNode("", true),
              __props.rodada.status === "running" ? (openBlock(), createBlock("section", {
                key: 2,
                class: "mt-8 rounded-lg bg-noite p-4"
              }, [
                createVNode("h2", { class: "font-display text-16 font-bold uppercase" }, "Lançar sorteio"),
                createVNode("div", { class: "mt-4 grid gap-4 sm:grid-cols-2" }, [
                  createVNode("div", null, [
                    createVNode("label", {
                      class: "block text-14 text-vidro",
                      for: "concurso"
                    }, "Número do concurso"),
                    withDirectives(createVNode("input", {
                      id: "concurso",
                      "onUpdate:modelValue": ($event) => unref(sorteioForm).contest_number = $event,
                      type: "number",
                      min: "1",
                      class: "mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [
                        vModelText,
                        unref(sorteioForm).contest_number,
                        void 0,
                        { number: true }
                      ]
                    ]),
                    unref(sorteioForm).errors.contest_number ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "mt-1 text-12 text-erro"
                    }, toDisplayString(unref(sorteioForm).errors.contest_number), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", {
                      class: "block text-14 text-vidro",
                      for: "drawn_on"
                    }, "Data do sorteio"),
                    withDirectives(createVNode("input", {
                      id: "drawn_on",
                      "onUpdate:modelValue": ($event) => unref(sorteioForm).drawn_on = $event,
                      type: "date",
                      class: "mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-16 focus:border-aceso focus:outline-none"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(sorteioForm).drawn_on]
                    ]),
                    unref(sorteioForm).errors.drawn_on ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "mt-1 text-12 text-erro"
                    }, toDisplayString(unref(sorteioForm).errors.drawn_on), 1)) : createCommentVNode("", true)
                  ])
                ]),
                createVNode("div", { class: "mt-4" }, [
                  createVNode("p", { class: "text-14 text-vidro" }, "As 6 dezenas"),
                  createVNode("div", { class: "mt-1 flex flex-wrap gap-2" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(6, (i) => {
                      return withDirectives(createVNode("input", {
                        key: i,
                        "onUpdate:modelValue": ($event) => unref(sorteioForm).numbers[i - 1] = $event,
                        type: "number",
                        min: "1",
                        max: "60",
                        "aria-label": `Dezena ${i}`,
                        class: "w-16 rounded border border-vidro/30 bg-tinta px-2 py-2 text-center font-mono text-16 font-tabular focus:border-aceso focus:outline-none"
                      }, null, 8, ["onUpdate:modelValue", "aria-label"]), [
                        [vModelText, unref(sorteioForm).numbers[i - 1]]
                      ]);
                    }), 64))
                  ]),
                  unref(sorteioForm).errors.numbers ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "mt-1 text-12 text-erro"
                  }, toDisplayString(unref(sorteioForm).errors.numbers), 1)) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "mt-4 flex flex-wrap items-center gap-3" }, [
                  createVNode("button", {
                    type: "button",
                    class: "rounded border border-aceso px-4 py-2 font-display text-14 font-bold uppercase text-aceso",
                    onClick: verPrevia
                  }, " Ver prévia "),
                  createVNode("button", {
                    type: "button",
                    disabled: !previa.value || unref(sorteioForm).processing,
                    class: "rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-50",
                    onClick: publicar
                  }, " Publicar sorteio ", 8, ["disabled"]),
                  !previa.value ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-12 text-vidro"
                  }, "A prévia é obrigatória antes de publicar.")) : createCommentVNode("", true)
                ]),
                previaErro.value ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "mt-3 rounded border border-erro/40 bg-erro/10 px-3 py-2 text-14 text-erro"
                }, toDisplayString(previaErro.value), 1)) : createCommentVNode("", true),
                previa.value ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "mt-3 rounded border border-aceso/40 bg-tinta px-4 py-3 text-14",
                  role: "status"
                }, [
                  createVNode("p", null, [
                    createVNode("strong", { class: "font-mono font-tabular" }, toDisplayString(previa.value.cartelasQuePontuam), 1),
                    createTextVNode(" cartelas pontuam · "),
                    createVNode("strong", { class: "font-mono font-tabular" }, toDisplayString(previa.value.cartelasQueChegamADez), 1),
                    createTextVNode(" chegam a 10 pontos "),
                    previa.value.rodadaSeraEncerrada ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createTextVNode(" · a rodada será "),
                      createVNode("strong", { class: "text-aceso" }, "ENCERRADA")
                    ], 64)) : createCommentVNode("", true)
                  ]),
                  previa.value.cartelasQueChegamADez > 0 ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "mt-1 text-jade"
                  }, " Prêmio de " + toDisplayString(unref(brl)(previa.value.premioPrincipalCents)) + " dividido entre " + toDisplayString(previa.value.cartelasQueChegamADez) + " — " + toDisplayString(unref(brl)(previa.value.cotaPorGanhadorCents)) + " cada. ", 1)) : createCommentVNode("", true)
                ])) : createCommentVNode("", true)
              ])) : createCommentVNode("", true),
              createVNode("section", { class: "mt-8" }, [
                createVNode("h2", { class: "font-display text-16 font-bold uppercase" }, "Sorteios publicados"),
                __props.sorteios.length === 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "mt-2 rounded-lg bg-noite p-4 text-14 text-vidro"
                }, " Nenhum sorteio publicado ainda. ")) : createCommentVNode("", true),
                (openBlock(true), createBlock(Fragment, null, renderList(__props.sorteios, (s) => {
                  return openBlock(), createBlock("div", {
                    key: s.id,
                    class: "mt-2 rounded-lg bg-noite p-4"
                  }, [
                    createVNode("div", { class: "flex flex-wrap items-center justify-between gap-2" }, [
                      createVNode("p", { class: "text-14" }, [
                        createVNode("span", { class: "font-display font-bold" }, "Concurso " + toDisplayString(s.concurso), 1),
                        createVNode("span", { class: "text-vidro" }, " · " + toDisplayString(unref(dataCurta)(s.data + "T12:00:00")) + " · " + toDisplayString(s.sequencia) + "º da rodada", 1)
                      ]),
                      createVNode("div", { class: "flex gap-1" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(s.dezenas, (n) => {
                          return openBlock(), createBlock("span", {
                            key: n,
                            class: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-aceso font-mono text-14 font-bold font-tabular text-tinta"
                          }, toDisplayString(unref(dezena)(n)), 1);
                        }), 128))
                      ])
                    ]),
                    s.corrigidoEm ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "mt-2 text-12 text-brasa"
                    }, " Corrigido em " + toDisplayString(unref(dataHora)(s.corrigidoEm)) + ": " + toDisplayString(s.motivoCorrecao), 1)) : createCommentVNode("", true)
                  ]);
                }), 128))
              ]),
              createVNode("section", { class: "mt-8" }, [
                createVNode("h2", { class: "font-display text-16 font-bold uppercase" }, "Classificação"),
                __props.ranking.length === 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "mt-2 rounded-lg bg-noite p-4 text-14 text-vidro"
                }, " Nenhuma cartela paga ainda. ")) : (openBlock(), createBlock("ol", {
                  key: 1,
                  class: "mt-2 space-y-1"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.ranking, (item) => {
                    return openBlock(), createBlock("li", {
                      key: item.betUuid,
                      class: "flex flex-wrap items-center gap-3 rounded bg-noite px-3 py-2 text-14"
                    }, [
                      createVNode("span", { class: "w-8 font-mono font-tabular text-vidro" }, toDisplayString(item.position) + "º", 1),
                      createVNode("span", { class: "min-w-32" }, toDisplayString(item.displayName), 1),
                      createVNode("span", { class: "font-mono text-12 font-tabular text-vidro" }, toDisplayString(item.maskedPhone), 1),
                      createVNode("span", { class: "flex flex-wrap gap-1" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(item.numbers, (n) => {
                          return openBlock(), createBlock("span", {
                            key: n.number,
                            class: ["inline-flex h-6 w-6 items-center justify-center rounded-full font-mono text-12 font-tabular", n.matchedDrawId ? "bg-aceso font-bold text-tinta" : "border border-vidro/30 text-vidro"]
                          }, toDisplayString(unref(dezena)(n.number)), 3);
                        }), 128))
                      ]),
                      createVNode("span", {
                        class: ["ml-auto font-mono font-tabular", item.hitsCount >= 9 ? "text-aceso" : ""]
                      }, toDisplayString(item.hitsCount) + " pts ", 3)
                    ]);
                  }), 128))
                ]))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Rounds/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
