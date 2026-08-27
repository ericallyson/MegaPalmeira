import { defineComponent, unref, withCtx, createTextVNode, toDisplayString, openBlock, createBlock, createVNode, Fragment, renderList, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AdminLayout-DY_Q8-70.js";
import { c as dataCurta, b as brl } from "./format-BNqt_JV5.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    rodadas: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Rodadas" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between"${_scopeId}><h1 class="font-display text-28 font-black uppercase tracking-tight"${_scopeId}>Rodadas</h1>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/rodadas/criar",
              class: "rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
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
            _push2(`</div><div class="mt-6 overflow-x-auto rounded-lg bg-noite"${_scopeId}><table class="w-full text-left text-14"${_scopeId}><thead${_scopeId}><tr class="border-b border-vidro/20 text-12 uppercase text-vidro"${_scopeId}><th class="px-4 py-3"${_scopeId}>Rodada</th><th class="px-4 py-3"${_scopeId}>Status</th><th class="px-4 py-3"${_scopeId}>Início</th><th class="px-4 py-3"${_scopeId}>Valor</th><th class="px-4 py-3"${_scopeId}>Pagas</th><th class="px-4 py-3"${_scopeId}>Sorteios</th><th class="px-4 py-3"${_scopeId}>Ações</th></tr></thead><tbody${_scopeId}><!--[-->`);
            ssrRenderList(__props.rodadas, (r) => {
              _push2(`<tr class="border-b border-vidro/10 hover:bg-tinta/40"${_scopeId}><td class="px-4 py-3"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/admin/rodadas/${r.uuid}`,
                class: "text-aceso underline"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(r.nome)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(r.nome), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</td><td class="px-4 py-3"${_scopeId}>${ssrInterpolate(r.statusLabel)}</td><td class="px-4 py-3 font-mono font-tabular"${_scopeId}>${ssrInterpolate(unref(dataCurta)(r.inicio + "T12:00:00"))}</td><td class="px-4 py-3 font-mono font-tabular"${_scopeId}>${ssrInterpolate(unref(brl)(r.valorCents))}</td><td class="px-4 py-3 font-mono font-tabular"${_scopeId}>${ssrInterpolate(r.apostasPagas)}</td><td class="px-4 py-3 font-mono font-tabular"${_scopeId}>${ssrInterpolate(r.sorteios)}</td><td class="px-4 py-3"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/admin/apostas?rodada=${r.uuid}`,
                class: "inline-flex items-center gap-1.5 text-aceso hover:underline",
                title: `Ver apostas da ${r.nome}`
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true"${_scopeId2}><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"${_scopeId2}></path><path d="M13 5v2"${_scopeId2}></path><path d="M13 17v2"${_scopeId2}></path><path d="M13 11v2"${_scopeId2}></path></svg> Apostas `);
                  } else {
                    return [
                      (openBlock(), createBlock("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        class: "h-4 w-4",
                        "aria-hidden": "true"
                      }, [
                        createVNode("path", { d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" }),
                        createVNode("path", { d: "M13 5v2" }),
                        createVNode("path", { d: "M13 17v2" }),
                        createVNode("path", { d: "M13 11v2" })
                      ])),
                      createTextVNode(" Apostas ")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</td></tr>`);
            });
            _push2(`<!--]-->`);
            if (__props.rodadas.length === 0) {
              _push2(`<tr${_scopeId}><td colspan="7" class="px-4 py-6 text-vidro"${_scopeId}>Nenhuma rodada ainda. Crie a primeira.</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between" }, [
                createVNode("h1", { class: "font-display text-28 font-black uppercase tracking-tight" }, "Rodadas"),
                createVNode(unref(Link), {
                  href: "/admin/rodadas/criar",
                  class: "rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Criar rodada ")
                  ]),
                  _: 1
                })
              ]),
              createVNode("div", { class: "mt-6 overflow-x-auto rounded-lg bg-noite" }, [
                createVNode("table", { class: "w-full text-left text-14" }, [
                  createVNode("thead", null, [
                    createVNode("tr", { class: "border-b border-vidro/20 text-12 uppercase text-vidro" }, [
                      createVNode("th", { class: "px-4 py-3" }, "Rodada"),
                      createVNode("th", { class: "px-4 py-3" }, "Status"),
                      createVNode("th", { class: "px-4 py-3" }, "Início"),
                      createVNode("th", { class: "px-4 py-3" }, "Valor"),
                      createVNode("th", { class: "px-4 py-3" }, "Pagas"),
                      createVNode("th", { class: "px-4 py-3" }, "Sorteios"),
                      createVNode("th", { class: "px-4 py-3" }, "Ações")
                    ])
                  ]),
                  createVNode("tbody", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.rodadas, (r) => {
                      return openBlock(), createBlock("tr", {
                        key: r.uuid,
                        class: "border-b border-vidro/10 hover:bg-tinta/40"
                      }, [
                        createVNode("td", { class: "px-4 py-3" }, [
                          createVNode(unref(Link), {
                            href: `/admin/rodadas/${r.uuid}`,
                            class: "text-aceso underline"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(r.nome), 1)
                            ]),
                            _: 2
                          }, 1032, ["href"])
                        ]),
                        createVNode("td", { class: "px-4 py-3" }, toDisplayString(r.statusLabel), 1),
                        createVNode("td", { class: "px-4 py-3 font-mono font-tabular" }, toDisplayString(unref(dataCurta)(r.inicio + "T12:00:00")), 1),
                        createVNode("td", { class: "px-4 py-3 font-mono font-tabular" }, toDisplayString(unref(brl)(r.valorCents)), 1),
                        createVNode("td", { class: "px-4 py-3 font-mono font-tabular" }, toDisplayString(r.apostasPagas), 1),
                        createVNode("td", { class: "px-4 py-3 font-mono font-tabular" }, toDisplayString(r.sorteios), 1),
                        createVNode("td", { class: "px-4 py-3" }, [
                          createVNode(unref(Link), {
                            href: `/admin/apostas?rodada=${r.uuid}`,
                            class: "inline-flex items-center gap-1.5 text-aceso hover:underline",
                            title: `Ver apostas da ${r.nome}`
                          }, {
                            default: withCtx(() => [
                              (openBlock(), createBlock("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                "stroke-width": "2",
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                class: "h-4 w-4",
                                "aria-hidden": "true"
                              }, [
                                createVNode("path", { d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" }),
                                createVNode("path", { d: "M13 5v2" }),
                                createVNode("path", { d: "M13 17v2" }),
                                createVNode("path", { d: "M13 11v2" })
                              ])),
                              createTextVNode(" Apostas ")
                            ]),
                            _: 1
                          }, 8, ["href", "title"])
                        ])
                      ]);
                    }), 128)),
                    __props.rodadas.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                      createVNode("td", {
                        colspan: "7",
                        class: "px-4 py-6 text-vidro"
                      }, "Nenhuma rodada ainda. Crie a primeira.")
                    ])) : createCommentVNode("", true)
                  ])
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Rounds/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
