import { defineComponent, ref, unref, withCtx, createTextVNode, createVNode, withModifiers, withDirectives, vModelText, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderClass } from "vue/server-renderer";
import { Head, Link, router } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AdminLayout-BunQtFw9.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    usuarios: {},
    filtros: {},
    usuarioAtualId: {}
  },
  setup(__props) {
    const props = __props;
    const busca = ref(props.filtros.busca ?? "");
    function filtrar() {
      router.get(
        "/admin/usuarios",
        { busca: busca.value || void 0 },
        { preserveState: true, replace: true }
      );
    }
    function excluir(id, nome) {
      if (!confirm(`Excluir o usuário ${nome}? Esta ação não pode ser desfeita.`)) return;
      router.delete(`/admin/usuarios/${id}`);
    }
    function resetar2fa(id, nome) {
      if (!confirm(`Resetar o 2FA de ${nome}? Ele precisará reconfigurar no próximo acesso ao admin.`)) return;
      router.post(`/admin/usuarios/${id}/reset-2fa`, {}, { preserveScroll: true });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Usuários" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-wrap items-center justify-between gap-3"${_scopeId}><h1 class="font-display text-28 font-black uppercase tracking-tight"${_scopeId}>Usuários</h1>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/usuarios/criar",
              class: "rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Novo usuário `);
                } else {
                  return [
                    createTextVNode(" Novo usuário ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><form class="mt-4 flex flex-wrap items-end gap-3"${_scopeId}><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="filtro-busca"${_scopeId}>Nome ou e-mail</label><input id="filtro-busca"${ssrRenderAttr("value", busca.value)} type="search" class="mt-1 rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"${_scopeId}></div><button type="submit" class="rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"${_scopeId}> Filtrar </button></form><div class="mt-4 overflow-x-auto rounded-lg bg-noite"${_scopeId}><table class="w-full text-left text-14"${_scopeId}><thead${_scopeId}><tr class="border-b border-vidro/20 text-12 uppercase text-vidro"${_scopeId}><th class="px-3 py-2"${_scopeId}>Nome</th><th class="px-3 py-2"${_scopeId}>E-mail</th><th class="px-3 py-2"${_scopeId}>Telefone</th><th class="px-3 py-2"${_scopeId}>Perfil</th><th class="px-3 py-2"${_scopeId}>Ações</th></tr></thead><tbody${_scopeId}><!--[-->`);
            ssrRenderList(__props.usuarios.data, (u) => {
              _push2(`<tr class="border-b border-vidro/10"${_scopeId}><td class="px-3 py-2"${_scopeId}>${ssrInterpolate(u.nome)} `);
              if (u.id === __props.usuarioAtualId) {
                _push2(`<span class="ml-1 text-12 text-vidro"${_scopeId}>(você)</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</td><td class="px-3 py-2 text-vidro"${_scopeId}>${ssrInterpolate(u.email)}</td><td class="px-3 py-2 font-mono text-12 font-tabular text-vidro"${_scopeId}>${ssrInterpolate(u.telefone ?? "—")}</td><td class="px-3 py-2"${_scopeId}><span class="${ssrRenderClass(u.admin ? "text-jade" : "text-vidro")}"${_scopeId}>${ssrInterpolate(u.admin ? "Administrador" : "Comum")}</span>`);
              if (u.admin) {
                _push2(`<span class="${ssrRenderClass([u.doisFatoresAtivo ? "text-vidro" : "text-brasa", "block text-12"])}"${_scopeId}>${ssrInterpolate(u.doisFatoresAtivo ? "2FA ativo" : "2FA pendente")}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</td><td class="px-3 py-2"${_scopeId}><div class="flex flex-wrap gap-3"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/admin/usuarios/${u.id}/editar`,
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
              if (u.doisFatoresAtivo) {
                _push2(`<button type="button" class="text-brasa underline"${_scopeId}> Resetar 2FA </button>`);
              } else {
                _push2(`<!---->`);
              }
              if (u.id !== __props.usuarioAtualId) {
                _push2(`<button type="button" class="text-erro underline"${_scopeId}> Excluir </button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></td></tr>`);
            });
            _push2(`<!--]-->`);
            if (__props.usuarios.data.length === 0) {
              _push2(`<tr${_scopeId}><td colspan="5" class="px-3 py-6 text-vidro"${_scopeId}>Nenhum usuário encontrado.</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></div>`);
            if (__props.usuarios.links.length > 3) {
              _push2(`<nav class="mt-4 flex flex-wrap gap-1" aria-label="Paginação"${_scopeId}><!--[-->`);
              ssrRenderList(__props.usuarios.links, (link, i) => {
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
                createVNode("h1", { class: "font-display text-28 font-black uppercase tracking-tight" }, "Usuários"),
                createVNode(unref(Link), {
                  href: "/admin/usuarios/criar",
                  class: "rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Novo usuário ")
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
                  }, "Nome ou e-mail"),
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
                  class: "rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"
                }, " Filtrar ")
              ], 32),
              createVNode("div", { class: "mt-4 overflow-x-auto rounded-lg bg-noite" }, [
                createVNode("table", { class: "w-full text-left text-14" }, [
                  createVNode("thead", null, [
                    createVNode("tr", { class: "border-b border-vidro/20 text-12 uppercase text-vidro" }, [
                      createVNode("th", { class: "px-3 py-2" }, "Nome"),
                      createVNode("th", { class: "px-3 py-2" }, "E-mail"),
                      createVNode("th", { class: "px-3 py-2" }, "Telefone"),
                      createVNode("th", { class: "px-3 py-2" }, "Perfil"),
                      createVNode("th", { class: "px-3 py-2" }, "Ações")
                    ])
                  ]),
                  createVNode("tbody", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.usuarios.data, (u) => {
                      return openBlock(), createBlock("tr", {
                        key: u.id,
                        class: "border-b border-vidro/10"
                      }, [
                        createVNode("td", { class: "px-3 py-2" }, [
                          createTextVNode(toDisplayString(u.nome) + " ", 1),
                          u.id === __props.usuarioAtualId ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "ml-1 text-12 text-vidro"
                          }, "(você)")) : createCommentVNode("", true)
                        ]),
                        createVNode("td", { class: "px-3 py-2 text-vidro" }, toDisplayString(u.email), 1),
                        createVNode("td", { class: "px-3 py-2 font-mono text-12 font-tabular text-vidro" }, toDisplayString(u.telefone ?? "—"), 1),
                        createVNode("td", { class: "px-3 py-2" }, [
                          createVNode("span", {
                            class: u.admin ? "text-jade" : "text-vidro"
                          }, toDisplayString(u.admin ? "Administrador" : "Comum"), 3),
                          u.admin ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: ["block text-12", u.doisFatoresAtivo ? "text-vidro" : "text-brasa"]
                          }, toDisplayString(u.doisFatoresAtivo ? "2FA ativo" : "2FA pendente"), 3)) : createCommentVNode("", true)
                        ]),
                        createVNode("td", { class: "px-3 py-2" }, [
                          createVNode("div", { class: "flex flex-wrap gap-3" }, [
                            createVNode(unref(Link), {
                              href: `/admin/usuarios/${u.id}/editar`,
                              class: "text-aceso underline"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Editar")
                              ]),
                              _: 1
                            }, 8, ["href"]),
                            u.doisFatoresAtivo ? (openBlock(), createBlock("button", {
                              key: 0,
                              type: "button",
                              class: "text-brasa underline",
                              onClick: ($event) => resetar2fa(u.id, u.nome)
                            }, " Resetar 2FA ", 8, ["onClick"])) : createCommentVNode("", true),
                            u.id !== __props.usuarioAtualId ? (openBlock(), createBlock("button", {
                              key: 1,
                              type: "button",
                              class: "text-erro underline",
                              onClick: ($event) => excluir(u.id, u.nome)
                            }, " Excluir ", 8, ["onClick"])) : createCommentVNode("", true)
                          ])
                        ])
                      ]);
                    }), 128)),
                    __props.usuarios.data.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                      createVNode("td", {
                        colspan: "5",
                        class: "px-3 py-6 text-vidro"
                      }, "Nenhum usuário encontrado.")
                    ])) : createCommentVNode("", true)
                  ])
                ])
              ]),
              __props.usuarios.links.length > 3 ? (openBlock(), createBlock("nav", {
                key: 0,
                class: "mt-4 flex flex-wrap gap-1",
                "aria-label": "Paginação"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.usuarios.links, (link, i) => {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Users/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
