import { defineComponent, unref, withCtx, createTextVNode, createVNode, openBlock, createBlock, Fragment, toDisplayString, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AdminLayout-Bg8E4WAe.js";
import { b as brl, a as dataHora } from "./format-BNqt_JV5.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Dashboard",
  __ssrInlineRender: true,
  props: {
    rodada: {},
    ultimaEncerrada: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Painel" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h1 class="font-display text-28 font-black uppercase tracking-tight"${_scopeId}>Painel</h1>`);
            if (__props.rodada) {
              _push2(`<!--[--><div class="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4"${_scopeId}><div class="rounded-lg bg-noite p-4"${_scopeId}><p class="text-12 uppercase text-vidro"${_scopeId}>Pote atual</p><p class="mt-1 font-mono text-28 font-tabular text-jade"${_scopeId}>${ssrInterpolate(unref(brl)(__props.rodada.poteCents))}</p></div><div class="rounded-lg bg-noite p-4"${_scopeId}><p class="text-12 uppercase text-vidro"${_scopeId}>Prêmio de 10 pontos</p><p class="mt-1 font-mono text-28 font-tabular text-aceso"${_scopeId}>${ssrInterpolate(unref(brl)(__props.rodada.premioPrincipalCents))}</p></div><div class="rounded-lg bg-noite p-4"${_scopeId}><p class="text-12 uppercase text-vidro"${_scopeId}>Cartelas pagas</p><p class="mt-1 font-mono text-28 font-tabular"${_scopeId}>${ssrInterpolate(__props.rodada.apostasPagas)}</p><p class="text-12 text-vidro"${_scopeId}>${ssrInterpolate(__props.rodada.apostasPendentes)} aguardando pagamento</p></div><div class="rounded-lg bg-noite p-4"${_scopeId}><p class="text-12 uppercase text-vidro"${_scopeId}>Sorteios</p><p class="mt-1 font-mono text-28 font-tabular"${_scopeId}>${ssrInterpolate(__props.rodada.sorteios)}`);
              if (__props.rodada.maxSorteios > 0) {
                _push2(`<!--[-->/${ssrInterpolate(__props.rodada.maxSorteios)}<!--]-->`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</p>`);
              if (__props.rodada.maxSorteios === 0) {
                _push2(`<p class="text-12 text-vidro"${_scopeId}>até alguém ganhar</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
              if (__props.rodada.apostasForaDoPrazo > 0) {
                _push2(`<p class="mt-4 rounded border border-brasa/50 bg-brasa/10 px-3 py-2 text-14 text-brasa" role="alert"${_scopeId}>${ssrInterpolate(__props.rodada.apostasForaDoPrazo)} aposta(s) paga(s) fora do prazo aguardando estorno. `);
                _push2(ssrRenderComponent(unref(Link), {
                  href: "/admin/apostas?status=paid_late",
                  class: "underline"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Ver fila de estorno`);
                    } else {
                      return [
                        createTextVNode("Ver fila de estorno")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="mt-6 rounded-lg bg-noite p-4"${_scopeId}><div class="flex flex-wrap items-center justify-between gap-3"${_scopeId}><div${_scopeId}><p class="font-display text-16 font-bold uppercase"${_scopeId}>${ssrInterpolate(__props.rodada.nome)}</p><p class="text-14 text-vidro"${_scopeId}>${ssrInterpolate(__props.rodada.statusLabel)} · apostas até ${ssrInterpolate(unref(dataHora)(__props.rodada.encerramentoApostas))}</p></div>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/admin/rodadas/${__props.rodada.uuid}`,
                class: "rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Gerenciar rodada `);
                  } else {
                    return [
                      createTextVNode(" Gerenciar rodada ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div><!--]-->`);
            } else {
              _push2(`<div class="mt-6 rounded-lg bg-noite p-6"${_scopeId}><p class="text-16 text-vidro"${_scopeId}> Nenhuma rodada aberta ou em andamento. `);
              if (__props.ultimaEncerrada) {
                _push2(`<span${_scopeId}>A última encerrada foi &quot;${ssrInterpolate(__props.ultimaEncerrada)}&quot;.</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</p>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: "/admin/rodadas/criar",
                class: "mt-4 inline-block rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Criar rodada `);
                  } else {
                    return [
                      createTextVNode(" Criar rodada ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            }
          } else {
            return [
              createVNode("h1", { class: "font-display text-28 font-black uppercase tracking-tight" }, "Painel"),
              __props.rodada ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                createVNode("div", { class: "mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4" }, [
                  createVNode("div", { class: "rounded-lg bg-noite p-4" }, [
                    createVNode("p", { class: "text-12 uppercase text-vidro" }, "Pote atual"),
                    createVNode("p", { class: "mt-1 font-mono text-28 font-tabular text-jade" }, toDisplayString(unref(brl)(__props.rodada.poteCents)), 1)
                  ]),
                  createVNode("div", { class: "rounded-lg bg-noite p-4" }, [
                    createVNode("p", { class: "text-12 uppercase text-vidro" }, "Prêmio de 10 pontos"),
                    createVNode("p", { class: "mt-1 font-mono text-28 font-tabular text-aceso" }, toDisplayString(unref(brl)(__props.rodada.premioPrincipalCents)), 1)
                  ]),
                  createVNode("div", { class: "rounded-lg bg-noite p-4" }, [
                    createVNode("p", { class: "text-12 uppercase text-vidro" }, "Cartelas pagas"),
                    createVNode("p", { class: "mt-1 font-mono text-28 font-tabular" }, toDisplayString(__props.rodada.apostasPagas), 1),
                    createVNode("p", { class: "text-12 text-vidro" }, toDisplayString(__props.rodada.apostasPendentes) + " aguardando pagamento", 1)
                  ]),
                  createVNode("div", { class: "rounded-lg bg-noite p-4" }, [
                    createVNode("p", { class: "text-12 uppercase text-vidro" }, "Sorteios"),
                    createVNode("p", { class: "mt-1 font-mono text-28 font-tabular" }, [
                      createTextVNode(toDisplayString(__props.rodada.sorteios), 1),
                      __props.rodada.maxSorteios > 0 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                        createTextVNode("/" + toDisplayString(__props.rodada.maxSorteios), 1)
                      ], 64)) : createCommentVNode("", true)
                    ]),
                    __props.rodada.maxSorteios === 0 ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-12 text-vidro"
                    }, "até alguém ganhar")) : createCommentVNode("", true)
                  ])
                ]),
                __props.rodada.apostasForaDoPrazo > 0 ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "mt-4 rounded border border-brasa/50 bg-brasa/10 px-3 py-2 text-14 text-brasa",
                  role: "alert"
                }, [
                  createTextVNode(toDisplayString(__props.rodada.apostasForaDoPrazo) + " aposta(s) paga(s) fora do prazo aguardando estorno. ", 1),
                  createVNode(unref(Link), {
                    href: "/admin/apostas?status=paid_late",
                    class: "underline"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Ver fila de estorno")
                    ]),
                    _: 1
                  })
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "mt-6 rounded-lg bg-noite p-4" }, [
                  createVNode("div", { class: "flex flex-wrap items-center justify-between gap-3" }, [
                    createVNode("div", null, [
                      createVNode("p", { class: "font-display text-16 font-bold uppercase" }, toDisplayString(__props.rodada.nome), 1),
                      createVNode("p", { class: "text-14 text-vidro" }, toDisplayString(__props.rodada.statusLabel) + " · apostas até " + toDisplayString(unref(dataHora)(__props.rodada.encerramentoApostas)), 1)
                    ]),
                    createVNode(unref(Link), {
                      href: `/admin/rodadas/${__props.rodada.uuid}`,
                      class: "rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Gerenciar rodada ")
                      ]),
                      _: 1
                    }, 8, ["href"])
                  ])
                ])
              ], 64)) : (openBlock(), createBlock("div", {
                key: 1,
                class: "mt-6 rounded-lg bg-noite p-6"
              }, [
                createVNode("p", { class: "text-16 text-vidro" }, [
                  createTextVNode(" Nenhuma rodada aberta ou em andamento. "),
                  __props.ultimaEncerrada ? (openBlock(), createBlock("span", { key: 0 }, 'A última encerrada foi "' + toDisplayString(__props.ultimaEncerrada) + '".', 1)) : createCommentVNode("", true)
                ]),
                createVNode(unref(Link), {
                  href: "/admin/rodadas/criar",
                  class: "mt-4 inline-block rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Criar rodada ")
                  ]),
                  _: 1
                })
              ]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
