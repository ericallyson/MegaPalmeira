import { defineComponent, ref, unref, withCtx, createVNode, withModifiers, withDirectives, openBlock, createBlock, Fragment, renderList, toDisplayString, vModelSelect, vModelText, createTextVNode, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass } from "vue/server-renderer";
import { Head, Link, router } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AdminLayout-DY_Q8-70.js";
import { d as dezena, b as brl, a as dataHora } from "./format-BNqt_JV5.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    apostas: {},
    filtros: {},
    statusDisponiveis: {},
    rodadasDisponiveis: {},
    vendedoresDisponiveis: {}
  },
  setup(__props) {
    const props = __props;
    const status = ref(props.filtros.status ?? "");
    const busca = ref(props.filtros.busca ?? "");
    const filtroDezena = ref(props.filtros.dezena ?? "");
    const rodada = ref(props.filtros.rodada ?? "");
    const vendedor = ref(props.filtros.vendedor ?? "");
    const motivos = ref({});
    const abertaParaBaixa = ref(null);
    const abertaParaEstorno = ref(null);
    function filtrar() {
      router.get(
        "/admin/apostas",
        {
          status: status.value || void 0,
          busca: busca.value || void 0,
          dezena: filtroDezena.value || void 0,
          rodada: rodada.value || void 0,
          vendedor: vendedor.value || void 0
        },
        { preserveState: true, replace: true }
      );
    }
    function darBaixa(uuid) {
      router.post(
        `/admin/apostas/${uuid}/baixa`,
        { motivo: motivos.value[uuid] ?? "" },
        { onSuccess: () => abertaParaBaixa.value = null }
      );
    }
    function marcarEstorno(uuid) {
      router.post(
        `/admin/apostas/${uuid}/cancelar`,
        { motivo: motivos.value[uuid] ?? "", estorno: true },
        { onSuccess: () => abertaParaEstorno.value = null }
      );
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Apostas" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h1 class="font-display text-28 font-black uppercase tracking-tight"${_scopeId}>Apostas</h1><form class="mt-4 flex flex-wrap items-end gap-3"${_scopeId}><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="filtro-rodada"${_scopeId}>Rodada</label><select id="filtro-rodada" class="mt-1 rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(rodada.value) ? ssrLooseContain(rodada.value, "") : ssrLooseEqual(rodada.value, "")) ? " selected" : ""}${_scopeId}>Todas</option><!--[-->`);
            ssrRenderList(__props.rodadasDisponiveis, (r) => {
              _push2(`<option${ssrRenderAttr("value", r.value)}${ssrIncludeBooleanAttr(Array.isArray(rodada.value) ? ssrLooseContain(rodada.value, r.value) : ssrLooseEqual(rodada.value, r.value)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(r.label)}</option>`);
            });
            _push2(`<!--]--></select></div><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="filtro-vendedor"${_scopeId}>Vendedor</label><select id="filtro-vendedor" class="mt-1 rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(vendedor.value) ? ssrLooseContain(vendedor.value, "") : ssrLooseEqual(vendedor.value, "")) ? " selected" : ""}${_scopeId}>Todos</option><!--[-->`);
            ssrRenderList(__props.vendedoresDisponiveis, (v) => {
              _push2(`<option${ssrRenderAttr("value", v.value)}${ssrIncludeBooleanAttr(Array.isArray(vendedor.value) ? ssrLooseContain(vendedor.value, v.value) : ssrLooseEqual(vendedor.value, v.value)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(v.label)}</option>`);
            });
            _push2(`<!--]--></select></div><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="filtro-status"${_scopeId}>Status</label><select id="filtro-status" class="mt-1 rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(status.value) ? ssrLooseContain(status.value, "") : ssrLooseEqual(status.value, "")) ? " selected" : ""}${_scopeId}>Todos</option><!--[-->`);
            ssrRenderList(__props.statusDisponiveis, (s) => {
              _push2(`<option${ssrRenderAttr("value", s.value)}${ssrIncludeBooleanAttr(Array.isArray(status.value) ? ssrLooseContain(status.value, s.value) : ssrLooseEqual(status.value, s.value)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(s.label)}</option>`);
            });
            _push2(`<!--]--></select></div><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="filtro-busca"${_scopeId}>Nome ou telefone</label><input id="filtro-busca"${ssrRenderAttr("value", busca.value)} type="search" class="mt-1 rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"${_scopeId}></div><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="filtro-dezena"${_scopeId}>Dezena</label><input id="filtro-dezena"${ssrRenderAttr("value", filtroDezena.value)} type="number" min="1" max="60" class="mt-1 w-20 rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-14 font-tabular focus:border-aceso focus:outline-none"${_scopeId}></div><button type="submit" aria-label="Filtrar" class="inline-flex items-center gap-2 rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"${_scopeId}><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${_scopeId}><circle cx="11" cy="11" r="7"${_scopeId}></circle><line x1="21" y1="21" x2="16.65" y2="16.65"${_scopeId}></line></svg> Filtrar </button></form><div class="mt-4 overflow-x-auto rounded-lg bg-noite"${_scopeId}><table class="w-full text-left text-14"${_scopeId}><thead${_scopeId}><tr class="border-b border-vidro/20 text-12 uppercase text-vidro"${_scopeId}><th class="px-3 py-2"${_scopeId}>Apostador</th><th class="px-3 py-2"${_scopeId}>Dezenas</th><th class="px-3 py-2"${_scopeId}>Valor</th><th class="px-3 py-2"${_scopeId}>Status</th><th class="px-3 py-2"${_scopeId}>Pts</th><th class="px-3 py-2"${_scopeId}>Ações</th></tr></thead><tbody${_scopeId}><!--[-->`);
            ssrRenderList(__props.apostas.data, (aposta) => {
              _push2(`<!--[--><tr class="${ssrRenderClass([aposta.status === "paid_late" ? "bg-brasa/10" : "", "border-b border-vidro/10"])}"${_scopeId}><td class="px-3 py-2"${_scopeId}><p${_scopeId}>${ssrInterpolate(aposta.nome)}</p><p class="font-mono text-12 font-tabular text-vidro"${_scopeId}>${ssrInterpolate(aposta.telefone)}</p><p class="text-12 text-vidro/70"${_scopeId}>${ssrInterpolate(aposta.rodada)}</p></td><td class="px-3 py-2 font-mono text-12 font-tabular"${_scopeId}>${ssrInterpolate(aposta.dezenas.map(unref(dezena)).join(" "))}</td><td class="px-3 py-2 font-mono font-tabular"${_scopeId}>${ssrInterpolate(unref(brl)(aposta.valorCents))}</td><td class="px-3 py-2"${_scopeId}><span class="${ssrRenderClass(aposta.status === "paid" ? "text-jade" : aposta.status === "paid_late" ? "text-brasa" : "text-vidro")}"${_scopeId}>${ssrInterpolate(aposta.statusLabel)}</span>`);
              if (aposta.pagaEm) {
                _push2(`<p class="text-12 text-vidro"${_scopeId}>${ssrInterpolate(unref(dataHora)(aposta.pagaEm))}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</td><td class="px-3 py-2 font-mono font-tabular"${_scopeId}>${ssrInterpolate(aposta.pontos)}</td><td class="px-3 py-2"${_scopeId}>`);
              if (aposta.status === "awaiting_payment" || aposta.status === "expired") {
                _push2(`<button type="button" class="text-14 text-aceso underline"${_scopeId}> Dar baixa </button>`);
              } else {
                _push2(`<!---->`);
              }
              if (aposta.status === "paid_late") {
                _push2(`<button type="button" class="text-14 text-brasa underline"${_scopeId}> Marcar estorno </button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</td></tr>`);
              if (abertaParaEstorno.value === aposta.uuid) {
                _push2(`<tr class="border-b border-vidro/10 bg-tinta/40"${_scopeId}><td colspan="6" class="px-3 py-3"${_scopeId}><label class="block text-12 uppercase text-vidro"${ssrRenderAttr("for", `estorno-${aposta.uuid}`)}${_scopeId}> Motivo do estorno (obrigatório) </label><div class="mt-1 flex gap-2"${_scopeId}><input${ssrRenderAttr("id", `estorno-${aposta.uuid}`)}${ssrRenderAttr("value", motivos.value[aposta.uuid])} type="text" placeholder="Ex.: PIX devolvido em 30/07" class="w-full max-w-md rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"${_scopeId}><button type="button" class="rounded bg-brasa px-4 py-2 font-display text-14 font-bold uppercase text-tinta"${_scopeId}> Confirmar estorno </button></div></td></tr>`);
              } else {
                _push2(`<!---->`);
              }
              if (abertaParaBaixa.value === aposta.uuid) {
                _push2(`<tr class="border-b border-vidro/10 bg-tinta/40"${_scopeId}><td colspan="6" class="px-3 py-3"${_scopeId}><label class="block text-12 uppercase text-vidro"${ssrRenderAttr("for", `motivo-${aposta.uuid}`)}${_scopeId}> Motivo da baixa manual (obrigatório) </label><div class="mt-1 flex gap-2"${_scopeId}><input${ssrRenderAttr("id", `motivo-${aposta.uuid}`)}${ssrRenderAttr("value", motivos.value[aposta.uuid])} type="text" placeholder="Ex.: pagou em dinheiro na portaria" class="w-full max-w-md rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"${_scopeId}><button type="button" class="rounded bg-jade px-4 py-2 font-display text-14 font-bold uppercase text-tinta"${_scopeId}> Confirmar baixa </button></div></td></tr>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--]-->`);
            });
            _push2(`<!--]-->`);
            if (__props.apostas.data.length === 0) {
              _push2(`<tr${_scopeId}><td colspan="6" class="px-3 py-6 text-vidro"${_scopeId}>Nenhuma aposta encontrada com esses filtros.</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></div>`);
            if (__props.apostas.links.length > 3) {
              _push2(`<nav class="mt-4 flex flex-wrap gap-1" aria-label="Paginação"${_scopeId}><!--[-->`);
              ssrRenderList(__props.apostas.links, (link, i) => {
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
              createVNode("h1", { class: "font-display text-28 font-black uppercase tracking-tight" }, "Apostas"),
              createVNode("form", {
                class: "mt-4 flex flex-wrap items-end gap-3",
                onSubmit: withModifiers(filtrar, ["prevent"])
              }, [
                createVNode("div", null, [
                  createVNode("label", {
                    class: "block text-12 uppercase text-vidro",
                    for: "filtro-rodada"
                  }, "Rodada"),
                  withDirectives(createVNode("select", {
                    id: "filtro-rodada",
                    "onUpdate:modelValue": ($event) => rodada.value = $event,
                    class: "mt-1 rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none",
                    onChange: filtrar
                  }, [
                    createVNode("option", { value: "" }, "Todas"),
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.rodadasDisponiveis, (r) => {
                      return openBlock(), createBlock("option", {
                        key: r.value,
                        value: r.value
                      }, toDisplayString(r.label), 9, ["value"]);
                    }), 128))
                  ], 40, ["onUpdate:modelValue"]), [
                    [vModelSelect, rodada.value]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("label", {
                    class: "block text-12 uppercase text-vidro",
                    for: "filtro-vendedor"
                  }, "Vendedor"),
                  withDirectives(createVNode("select", {
                    id: "filtro-vendedor",
                    "onUpdate:modelValue": ($event) => vendedor.value = $event,
                    class: "mt-1 rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none",
                    onChange: filtrar
                  }, [
                    createVNode("option", { value: "" }, "Todos"),
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.vendedoresDisponiveis, (v) => {
                      return openBlock(), createBlock("option", {
                        key: v.value,
                        value: v.value
                      }, toDisplayString(v.label), 9, ["value"]);
                    }), 128))
                  ], 40, ["onUpdate:modelValue"]), [
                    [vModelSelect, vendedor.value]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("label", {
                    class: "block text-12 uppercase text-vidro",
                    for: "filtro-status"
                  }, "Status"),
                  withDirectives(createVNode("select", {
                    id: "filtro-status",
                    "onUpdate:modelValue": ($event) => status.value = $event,
                    class: "mt-1 rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none",
                    onChange: filtrar
                  }, [
                    createVNode("option", { value: "" }, "Todos"),
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.statusDisponiveis, (s) => {
                      return openBlock(), createBlock("option", {
                        key: s.value,
                        value: s.value
                      }, toDisplayString(s.label), 9, ["value"]);
                    }), 128))
                  ], 40, ["onUpdate:modelValue"]), [
                    [vModelSelect, status.value]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("label", {
                    class: "block text-12 uppercase text-vidro",
                    for: "filtro-busca"
                  }, "Nome ou telefone"),
                  withDirectives(createVNode("input", {
                    id: "filtro-busca",
                    "onUpdate:modelValue": ($event) => busca.value = $event,
                    type: "search",
                    class: "mt-1 rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, busca.value]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("label", {
                    class: "block text-12 uppercase text-vidro",
                    for: "filtro-dezena"
                  }, "Dezena"),
                  withDirectives(createVNode("input", {
                    id: "filtro-dezena",
                    "onUpdate:modelValue": ($event) => filtroDezena.value = $event,
                    type: "number",
                    min: "1",
                    max: "60",
                    class: "mt-1 w-20 rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-14 font-tabular focus:border-aceso focus:outline-none"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, filtroDezena.value]
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
                      createVNode("th", { class: "px-3 py-2" }, "Apostador"),
                      createVNode("th", { class: "px-3 py-2" }, "Dezenas"),
                      createVNode("th", { class: "px-3 py-2" }, "Valor"),
                      createVNode("th", { class: "px-3 py-2" }, "Status"),
                      createVNode("th", { class: "px-3 py-2" }, "Pts"),
                      createVNode("th", { class: "px-3 py-2" }, "Ações")
                    ])
                  ]),
                  createVNode("tbody", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.apostas.data, (aposta) => {
                      return openBlock(), createBlock(Fragment, {
                        key: aposta.uuid
                      }, [
                        createVNode("tr", {
                          class: ["border-b border-vidro/10", aposta.status === "paid_late" ? "bg-brasa/10" : ""]
                        }, [
                          createVNode("td", { class: "px-3 py-2" }, [
                            createVNode("p", null, toDisplayString(aposta.nome), 1),
                            createVNode("p", { class: "font-mono text-12 font-tabular text-vidro" }, toDisplayString(aposta.telefone), 1),
                            createVNode("p", { class: "text-12 text-vidro/70" }, toDisplayString(aposta.rodada), 1)
                          ]),
                          createVNode("td", { class: "px-3 py-2 font-mono text-12 font-tabular" }, toDisplayString(aposta.dezenas.map(unref(dezena)).join(" ")), 1),
                          createVNode("td", { class: "px-3 py-2 font-mono font-tabular" }, toDisplayString(unref(brl)(aposta.valorCents)), 1),
                          createVNode("td", { class: "px-3 py-2" }, [
                            createVNode("span", {
                              class: aposta.status === "paid" ? "text-jade" : aposta.status === "paid_late" ? "text-brasa" : "text-vidro"
                            }, toDisplayString(aposta.statusLabel), 3),
                            aposta.pagaEm ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "text-12 text-vidro"
                            }, toDisplayString(unref(dataHora)(aposta.pagaEm)), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("td", { class: "px-3 py-2 font-mono font-tabular" }, toDisplayString(aposta.pontos), 1),
                          createVNode("td", { class: "px-3 py-2" }, [
                            aposta.status === "awaiting_payment" || aposta.status === "expired" ? (openBlock(), createBlock("button", {
                              key: 0,
                              type: "button",
                              class: "text-14 text-aceso underline",
                              onClick: ($event) => abertaParaBaixa.value = abertaParaBaixa.value === aposta.uuid ? null : aposta.uuid
                            }, " Dar baixa ", 8, ["onClick"])) : createCommentVNode("", true),
                            aposta.status === "paid_late" ? (openBlock(), createBlock("button", {
                              key: 1,
                              type: "button",
                              class: "text-14 text-brasa underline",
                              onClick: ($event) => abertaParaEstorno.value = abertaParaEstorno.value === aposta.uuid ? null : aposta.uuid
                            }, " Marcar estorno ", 8, ["onClick"])) : createCommentVNode("", true)
                          ])
                        ], 2),
                        abertaParaEstorno.value === aposta.uuid ? (openBlock(), createBlock("tr", {
                          key: 0,
                          class: "border-b border-vidro/10 bg-tinta/40"
                        }, [
                          createVNode("td", {
                            colspan: "6",
                            class: "px-3 py-3"
                          }, [
                            createVNode("label", {
                              class: "block text-12 uppercase text-vidro",
                              for: `estorno-${aposta.uuid}`
                            }, " Motivo do estorno (obrigatório) ", 8, ["for"]),
                            createVNode("div", { class: "mt-1 flex gap-2" }, [
                              withDirectives(createVNode("input", {
                                id: `estorno-${aposta.uuid}`,
                                "onUpdate:modelValue": ($event) => motivos.value[aposta.uuid] = $event,
                                type: "text",
                                placeholder: "Ex.: PIX devolvido em 30/07",
                                class: "w-full max-w-md rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                              }, null, 8, ["id", "onUpdate:modelValue"]), [
                                [vModelText, motivos.value[aposta.uuid]]
                              ]),
                              createVNode("button", {
                                type: "button",
                                class: "rounded bg-brasa px-4 py-2 font-display text-14 font-bold uppercase text-tinta",
                                onClick: ($event) => marcarEstorno(aposta.uuid)
                              }, " Confirmar estorno ", 8, ["onClick"])
                            ])
                          ])
                        ])) : createCommentVNode("", true),
                        abertaParaBaixa.value === aposta.uuid ? (openBlock(), createBlock("tr", {
                          key: 1,
                          class: "border-b border-vidro/10 bg-tinta/40"
                        }, [
                          createVNode("td", {
                            colspan: "6",
                            class: "px-3 py-3"
                          }, [
                            createVNode("label", {
                              class: "block text-12 uppercase text-vidro",
                              for: `motivo-${aposta.uuid}`
                            }, " Motivo da baixa manual (obrigatório) ", 8, ["for"]),
                            createVNode("div", { class: "mt-1 flex gap-2" }, [
                              withDirectives(createVNode("input", {
                                id: `motivo-${aposta.uuid}`,
                                "onUpdate:modelValue": ($event) => motivos.value[aposta.uuid] = $event,
                                type: "text",
                                placeholder: "Ex.: pagou em dinheiro na portaria",
                                class: "w-full max-w-md rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                              }, null, 8, ["id", "onUpdate:modelValue"]), [
                                [vModelText, motivos.value[aposta.uuid]]
                              ]),
                              createVNode("button", {
                                type: "button",
                                class: "rounded bg-jade px-4 py-2 font-display text-14 font-bold uppercase text-tinta",
                                onClick: ($event) => darBaixa(aposta.uuid)
                              }, " Confirmar baixa ", 8, ["onClick"])
                            ])
                          ])
                        ])) : createCommentVNode("", true)
                      ], 64);
                    }), 128)),
                    __props.apostas.data.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                      createVNode("td", {
                        colspan: "6",
                        class: "px-3 py-6 text-vidro"
                      }, "Nenhuma aposta encontrada com esses filtros.")
                    ])) : createCommentVNode("", true)
                  ])
                ])
              ]),
              __props.apostas.links.length > 3 ? (openBlock(), createBlock("nav", {
                key: 0,
                class: "mt-4 flex flex-wrap gap-1",
                "aria-label": "Paginação"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.apostas.links, (link, i) => {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Bets/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
