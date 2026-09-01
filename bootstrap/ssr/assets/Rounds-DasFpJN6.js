import { defineComponent, unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AdminLayout-DY_Q8-70.js";
import { b as brl } from "./format-BNqt_JV5.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Rounds",
  __ssrInlineRender: true,
  props: {
    vendedor: {},
    rodadas: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `Rodadas de ${__props.vendedor.nome}`
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-wrap items-center justify-between gap-3"${_scopeId}><div${_scopeId}><h1 class="font-display text-28 font-black uppercase tracking-tight"${_scopeId}> Rodadas de ${ssrInterpolate(__props.vendedor.nome)}</h1><p class="text-14 text-vidro"${_scopeId}>Apenas rodadas em que o vendedor tem apostas.</p></div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/vendedores",
              class: "text-14 text-aceso underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Voltar aos vendedores`);
                } else {
                  return [
                    createTextVNode("Voltar aos vendedores")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="mt-4 overflow-x-auto rounded-lg bg-noite"${_scopeId}><table class="w-full text-left text-14"${_scopeId}><thead${_scopeId}><tr class="border-b border-vidro/20 text-12 uppercase text-vidro"${_scopeId}><th class="px-3 py-2"${_scopeId}>Rodada</th><th class="px-3 py-2"${_scopeId}>Status</th><th class="px-3 py-2"${_scopeId}>Apostas do vendedor</th><th class="px-3 py-2"${_scopeId}>Valor pago</th><th class="px-3 py-2"${_scopeId}>Ações</th></tr></thead><tbody${_scopeId}><!--[-->`);
            ssrRenderList(__props.rodadas, (r) => {
              _push2(`<tr class="border-b border-vidro/10"${_scopeId}><td class="px-3 py-2"${_scopeId}>${ssrInterpolate(r.nome)}</td><td class="px-3 py-2 text-vidro"${_scopeId}>${ssrInterpolate(r.statusLabel)}</td><td class="px-3 py-2 font-mono text-12 font-tabular"${_scopeId}>${ssrInterpolate(r.apostasPagas)} pagas <span class="text-vidro"${_scopeId}>/ ${ssrInterpolate(r.apostas)} total</span></td><td class="px-3 py-2 font-mono font-tabular"${_scopeId}>${ssrInterpolate(unref(brl)(r.valorPagoCents))}</td><td class="px-3 py-2"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/admin/apostas?rodada=${r.uuid}&vendedor=${__props.vendedor.uuid}`,
                class: "text-aceso underline"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Apostas `);
                  } else {
                    return [
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
              _push2(`<tr${_scopeId}><td colspan="5" class="px-3 py-6 text-vidro"${_scopeId}> Este vendedor ainda não tem apostas em nenhuma rodada. </td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-wrap items-center justify-between gap-3" }, [
                createVNode("div", null, [
                  createVNode("h1", { class: "font-display text-28 font-black uppercase tracking-tight" }, " Rodadas de " + toDisplayString(__props.vendedor.nome), 1),
                  createVNode("p", { class: "text-14 text-vidro" }, "Apenas rodadas em que o vendedor tem apostas.")
                ]),
                createVNode(unref(Link), {
                  href: "/admin/vendedores",
                  class: "text-14 text-aceso underline"
                }, {
                  default: withCtx(() => [
                    createTextVNode("Voltar aos vendedores")
                  ]),
                  _: 1
                })
              ]),
              createVNode("div", { class: "mt-4 overflow-x-auto rounded-lg bg-noite" }, [
                createVNode("table", { class: "w-full text-left text-14" }, [
                  createVNode("thead", null, [
                    createVNode("tr", { class: "border-b border-vidro/20 text-12 uppercase text-vidro" }, [
                      createVNode("th", { class: "px-3 py-2" }, "Rodada"),
                      createVNode("th", { class: "px-3 py-2" }, "Status"),
                      createVNode("th", { class: "px-3 py-2" }, "Apostas do vendedor"),
                      createVNode("th", { class: "px-3 py-2" }, "Valor pago"),
                      createVNode("th", { class: "px-3 py-2" }, "Ações")
                    ])
                  ]),
                  createVNode("tbody", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.rodadas, (r) => {
                      return openBlock(), createBlock("tr", {
                        key: r.uuid,
                        class: "border-b border-vidro/10"
                      }, [
                        createVNode("td", { class: "px-3 py-2" }, toDisplayString(r.nome), 1),
                        createVNode("td", { class: "px-3 py-2 text-vidro" }, toDisplayString(r.statusLabel), 1),
                        createVNode("td", { class: "px-3 py-2 font-mono text-12 font-tabular" }, [
                          createTextVNode(toDisplayString(r.apostasPagas) + " pagas ", 1),
                          createVNode("span", { class: "text-vidro" }, "/ " + toDisplayString(r.apostas) + " total", 1)
                        ]),
                        createVNode("td", { class: "px-3 py-2 font-mono font-tabular" }, toDisplayString(unref(brl)(r.valorPagoCents)), 1),
                        createVNode("td", { class: "px-3 py-2" }, [
                          createVNode(unref(Link), {
                            href: `/admin/apostas?rodada=${r.uuid}&vendedor=${__props.vendedor.uuid}`,
                            class: "text-aceso underline"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Apostas ")
                            ]),
                            _: 1
                          }, 8, ["href"])
                        ])
                      ]);
                    }), 128)),
                    __props.rodadas.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                      createVNode("td", {
                        colspan: "5",
                        class: "px-3 py-6 text-vidro"
                      }, " Este vendedor ainda não tem apostas em nenhuma rodada. ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Sellers/Rounds.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
