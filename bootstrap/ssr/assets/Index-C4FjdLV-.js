import { defineComponent, ref, unref, withCtx, createTextVNode, createVNode, withModifiers, withDirectives, vModelText, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { Head, Link, router } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AdminLayout-DY_Q8-70.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    vendedores: {},
    filtros: {}
  },
  setup(__props) {
    const props = __props;
    const busca = ref(props.filtros.busca ?? "");
    const copiado = ref(null);
    function filtrar() {
      router.get(
        "/admin/vendedores",
        { busca: busca.value || void 0 },
        { preserveState: true, replace: true }
      );
    }
    function copiarLink(uuid, link) {
      navigator.clipboard?.writeText(link).then(() => {
        copiado.value = uuid;
        setTimeout(() => copiado.value = null, 1500);
      });
    }
    function excluir(uuid, nome) {
      if (!confirm(`Excluir o vendedor ${nome}? As apostas já feitas continuam, mas sem vínculo com ele.`)) return;
      router.delete(`/admin/vendedores/${uuid}`);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Vendedores" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-wrap items-center justify-between gap-3"${_scopeId}><h1 class="font-display text-28 font-black uppercase tracking-tight"${_scopeId}>Vendedores</h1>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/vendedores/criar",
              class: "rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Novo vendedor `);
                } else {
                  return [
                    createTextVNode(" Novo vendedor ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><form class="mt-4 flex flex-wrap items-end gap-3"${_scopeId}><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="filtro-busca"${_scopeId}>Nome ou slug</label><input id="filtro-busca"${ssrRenderAttr("value", busca.value)} type="search" class="mt-1 rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"${_scopeId}></div><button type="submit" aria-label="Filtrar" class="inline-flex items-center gap-2 rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"${_scopeId}><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${_scopeId}><circle cx="11" cy="11" r="7"${_scopeId}></circle><line x1="21" y1="21" x2="16.65" y2="16.65"${_scopeId}></line></svg> Filtrar </button></form><div class="mt-4 overflow-x-auto rounded-lg bg-noite"${_scopeId}><table class="w-full text-left text-14"${_scopeId}><thead${_scopeId}><tr class="border-b border-vidro/20 text-12 uppercase text-vidro"${_scopeId}><th class="px-3 py-2"${_scopeId}>Nome</th><th class="px-3 py-2"${_scopeId}>Link</th><th class="px-3 py-2"${_scopeId}>Telefone</th><th class="px-3 py-2"${_scopeId}>Comissão</th><th class="px-3 py-2"${_scopeId}>Apostas</th><th class="px-3 py-2"${_scopeId}>Ações</th></tr></thead><tbody${_scopeId}><!--[-->`);
            ssrRenderList(__props.vendedores.data, (v) => {
              _push2(`<tr class="border-b border-vidro/10"${_scopeId}><td class="px-3 py-2"${_scopeId}><p${_scopeId}>${ssrInterpolate(v.nome)}</p><p class="font-mono text-12 font-tabular text-vidro"${_scopeId}>/${ssrInterpolate(v.slug)}</p></td><td class="px-3 py-2"${_scopeId}><button type="button" class="text-aceso underline"${_scopeId}>${ssrInterpolate(copiado.value === v.uuid ? "Copiado!" : "Copiar link")}</button>`);
              if (v.grupoUrl) {
                _push2(`<a${ssrRenderAttr("href", v.grupoUrl)} target="_blank" rel="noopener" class="ml-3 text-jade underline"${_scopeId}> Grupo </a>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</td><td class="px-3 py-2 font-mono text-12 font-tabular text-vidro"${_scopeId}>${ssrInterpolate(v.telefone ?? "—")}</td><td class="px-3 py-2 font-mono font-tabular"${_scopeId}>${ssrInterpolate(v.comissaoPct)}%</td><td class="px-3 py-2 font-mono text-12 font-tabular"${_scopeId}>${ssrInterpolate(v.apostasPagas)} pagas <span class="text-vidro"${_scopeId}>/ ${ssrInterpolate(v.apostas)} total</span></td><td class="px-3 py-2"${_scopeId}><div class="flex flex-wrap gap-3"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/admin/vendedores/${v.uuid}/editar`,
                class: "text-aceso underline"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Editar`);
                  } else {
                    return [
                      createTextVNode("Editar")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`<button type="button" class="text-erro underline"${_scopeId}> Excluir </button></div></td></tr>`);
            });
            _push2(`<!--]-->`);
            if (__props.vendedores.data.length === 0) {
              _push2(`<tr${_scopeId}><td colspan="6" class="px-3 py-6 text-vidro"${_scopeId}>Nenhum vendedor cadastrado.</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></div>`);
            if (__props.vendedores.links.length > 3) {
              _push2(`<nav class="mt-4 flex flex-wrap gap-1" aria-label="Paginação"${_scopeId}><!--[-->`);
              ssrRenderList(__props.vendedores.links, (link, i) => {
                _push2(`<!--[-->`);
                if (link.url) {
                  _push2(ssrRenderComponent(unref(Link), {
                    href: link.url,
                    class: ["rounded px-3 py-1 text-14", link.active ? "bg-aceso font-bold text-tinta" : "text-vidro hover:text-papel"]
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<span class="px-3 py-1 text-14 text-vidro/40"${_scopeId}>${link.label ?? ""}</span>`);
                }
                _push2(`<!--]-->`);
              });
              _push2(`<!--]--></nav>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("div", { class: "flex flex-wrap items-center justify-between gap-3" }, [
                createVNode("h1", { class: "font-display text-28 font-black uppercase tracking-tight" }, "Vendedores"),
                createVNode(unref(Link), {
                  href: "/admin/vendedores/criar",
                  class: "rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Novo vendedor ")
                  ]),
                  _: 1
                })
              ]),
              createVNode("form", {
                class: "mt-4 flex flex-wrap items-end gap-3",
                onSubmit: withModifiers(filtrar, ["prevent"])
              }, [
                createVNode("div", null, [
                  createVNode("label", {
                    class: "block text-12 uppercase text-vidro",
                    for: "filtro-busca"
                  }, "Nome ou slug"),
                  withDirectives(createVNode("input", {
                    id: "filtro-busca",
                    "onUpdate:modelValue": ($event) => busca.value = $event,
                    type: "search",
                    class: "mt-1 rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, busca.value]
                  ])
                ]),
                createVNode("button", {
                  type: "submit",
                  "aria-label": "Filtrar",
                  class: "inline-flex items-center gap-2 rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
                }, [
                  (openBlock(), createBlock("svg", {
                    class: "h-4 w-4",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "aria-hidden": "true"
                  }, [
                    createVNode("circle", {
                      cx: "11",
                      cy: "11",
                      r: "7"
                    }),
                    createVNode("line", {
                      x1: "21",
                      y1: "21",
                      x2: "16.65",
                      y2: "16.65"
                    })
                  ])),
                  createTextVNode(" Filtrar ")
                ])
              ], 32),
              createVNode("div", { class: "mt-4 overflow-x-auto rounded-lg bg-noite" }, [
                createVNode("table", { class: "w-full text-left text-14" }, [
                  createVNode("thead", null, [
                    createVNode("tr", { class: "border-b border-vidro/20 text-12 uppercase text-vidro" }, [
                      createVNode("th", { class: "px-3 py-2" }, "Nome"),
                      createVNode("th", { class: "px-3 py-2" }, "Link"),
                      createVNode("th", { class: "px-3 py-2" }, "Telefone"),
                      createVNode("th", { class: "px-3 py-2" }, "Comissão"),
                      createVNode("th", { class: "px-3 py-2" }, "Apostas"),
                      createVNode("th", { class: "px-3 py-2" }, "Ações")
                    ])
                  ]),
                  createVNode("tbody", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.vendedores.data, (v) => {
                      return openBlock(), createBlock("tr", {
                        key: v.uuid,
                        class: "border-b border-vidro/10"
                      }, [
                        createVNode("td", { class: "px-3 py-2" }, [
                          createVNode("p", null, toDisplayString(v.nome), 1),
                          createVNode("p", { class: "font-mono text-12 font-tabular text-vidro" }, "/" + toDisplayString(v.slug), 1)
                        ]),
                        createVNode("td", { class: "px-3 py-2" }, [
                          createVNode("button", {
                            type: "button",
                            class: "text-aceso underline",
                            onClick: ($event) => copiarLink(v.uuid, v.link)
                          }, toDisplayString(copiado.value === v.uuid ? "Copiado!" : "Copiar link"), 9, ["onClick"]),
                          v.grupoUrl ? (openBlock(), createBlock("a", {
                            key: 0,
                            href: v.grupoUrl,
                            target: "_blank",
                            rel: "noopener",
                            class: "ml-3 text-jade underline"
                          }, " Grupo ", 8, ["href"])) : createCommentVNode("", true)
                        ]),
                        createVNode("td", { class: "px-3 py-2 font-mono text-12 font-tabular text-vidro" }, toDisplayString(v.telefone ?? "—"), 1),
                        createVNode("td", { class: "px-3 py-2 font-mono font-tabular" }, toDisplayString(v.comissaoPct) + "%", 1),
                        createVNode("td", { class: "px-3 py-2 font-mono text-12 font-tabular" }, [
                          createTextVNode(toDisplayString(v.apostasPagas) + " pagas ", 1),
                          createVNode("span", { class: "text-vidro" }, "/ " + toDisplayString(v.apostas) + " total", 1)
                        ]),
                        createVNode("td", { class: "px-3 py-2" }, [
                          createVNode("div", { class: "flex flex-wrap gap-3" }, [
                            createVNode(unref(Link), {
                              href: `/admin/vendedores/${v.uuid}/editar`,
                              class: "text-aceso underline"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Editar")
                              ]),
                              _: 1
                            }, 8, ["href"]),
                            createVNode("button", {
                              type: "button",
                              class: "text-erro underline",
                              onClick: ($event) => excluir(v.uuid, v.nome)
                            }, " Excluir ", 8, ["onClick"])
                          ])
                        ])
                      ]);
                    }), 128)),
                    __props.vendedores.data.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                      createVNode("td", {
                        colspan: "6",
                        class: "px-3 py-6 text-vidro"
                      }, "Nenhum vendedor cadastrado.")
                    ])) : createCommentVNode("", true)
                  ])
                ])
              ]),
              __props.vendedores.links.length > 3 ? (openBlock(), createBlock("nav", {
                key: 0,
                class: "mt-4 flex flex-wrap gap-1",
                "aria-label": "Paginação"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.vendedores.links, (link, i) => {
                  return openBlock(), createBlock(Fragment, { key: i }, [
                    link.url ? (openBlock(), createBlock(unref(Link), {
                      key: 0,
                      href: link.url,
                      class: ["rounded px-3 py-1 text-14", link.active ? "bg-aceso font-bold text-tinta" : "text-vidro hover:text-papel"],
                      innerHTML: link.label
                    }, null, 8, ["href", "class", "innerHTML"])) : (openBlock(), createBlock("span", {
                      key: 1,
                      class: "px-3 py-1 text-14 text-vidro/40",
                      innerHTML: link.label
                    }, null, 8, ["innerHTML"]))
                  ], 64);
                }), 128))
              ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Sellers/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
