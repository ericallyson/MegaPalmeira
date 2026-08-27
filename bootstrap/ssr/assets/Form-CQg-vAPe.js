import { defineComponent, computed, unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, withModifiers, withDirectives, vModelText, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { useForm, Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AdminLayout-DY_Q8-70.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Form",
  __ssrInlineRender: true,
  props: {
    vendedor: {}
  },
  setup(__props) {
    const props = __props;
    const editando = computed(() => props.vendedor !== null);
    const form = useForm({
      name: props.vendedor?.nome ?? "",
      slug: props.vendedor?.slug ?? "",
      phone: props.vendedor?.telefone ?? "",
      commission_pct: props.vendedor?.comissaoPct ?? 10,
      group_url: props.vendedor?.grupoUrl ?? "",
      password: "",
      password_confirmation: ""
    });
    function salvar() {
      if (editando.value) {
        form.put(`/admin/vendedores/${props.vendedor.uuid}`);
      } else {
        form.post("/admin/vendedores");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: editando.value ? "Editar vendedor" : "Novo vendedor"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/vendedores",
              class: "text-14 text-vidro hover:text-papel"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`← Vendedores`);
                } else {
                  return [
                    createTextVNode("← Vendedores")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><h1 class="mt-2 font-display text-28 font-black uppercase tracking-tight"${_scopeId}>${ssrInterpolate(editando.value ? "Editar vendedor" : "Novo vendedor")}</h1>`);
            if (editando.value && __props.vendedor) {
              _push2(`<p class="mt-2 text-14 text-vidro"${_scopeId}> Link de divulgação: <span class="font-mono text-12 font-tabular text-aceso"${_scopeId}>${ssrInterpolate(__props.vendedor.link)}</span></p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<form class="mt-6 max-w-lg space-y-4"${_scopeId}><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="name"${_scopeId}>Nome</label><input id="name"${ssrRenderAttr("value", unref(form).name)} type="text" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"${_scopeId}>`);
            if (unref(form).errors.name) {
              _push2(`<p class="mt-1 text-12 text-erro"${_scopeId}>${ssrInterpolate(unref(form).errors.name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="slug"${_scopeId}>Slug (vai no link /v/…)</label><input id="slug"${ssrRenderAttr("value", unref(form).slug)} type="text" placeholder="joao-silva" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-14 font-tabular focus:border-aceso focus:outline-none"${_scopeId}>`);
            if (unref(form).errors.slug) {
              _push2(`<p class="mt-1 text-12 text-erro"${_scopeId}>${ssrInterpolate(unref(form).errors.slug)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="phone"${_scopeId}>Telefone (opcional)</label><input id="phone"${ssrRenderAttr("value", unref(form).phone)} type="text" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"${_scopeId}>`);
            if (unref(form).errors.phone) {
              _push2(`<p class="mt-1 text-12 text-erro"${_scopeId}>${ssrInterpolate(unref(form).errors.phone)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="commission_pct"${_scopeId}>Comissão (%)</label><input id="commission_pct"${ssrRenderAttr("value", unref(form).commission_pct)} type="number" min="0" max="100" class="mt-1 w-32 rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-14 font-tabular focus:border-aceso focus:outline-none"${_scopeId}>`);
            if (unref(form).errors.commission_pct) {
              _push2(`<p class="mt-1 text-12 text-erro"${_scopeId}>${ssrInterpolate(unref(form).errors.commission_pct)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="group_url"${_scopeId}>Link do grupo do WhatsApp (opcional)</label><input id="group_url"${ssrRenderAttr("value", unref(form).group_url)} type="url" placeholder="https://chat.whatsapp.com/..." class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"${_scopeId}><p class="mt-1 text-12 text-vidro"${_scopeId}>Aparece para quem entra pelo link deste vendedor.</p>`);
            if (unref(form).errors.group_url) {
              _push2(`<p class="mt-1 text-12 text-erro"${_scopeId}>${ssrInterpolate(unref(form).errors.group_url)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="password"${_scopeId}>${ssrInterpolate(editando.value ? "Nova senha (deixe em branco para manter)" : "Senha do portal")}</label><input id="password"${ssrRenderAttr("value", unref(form).password)} type="password" autocomplete="new-password" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"${_scopeId}>`);
            if (unref(form).errors.password) {
              _push2(`<p class="mt-1 text-12 text-erro"${_scopeId}>${ssrInterpolate(unref(form).errors.password)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="password_confirmation"${_scopeId}>Confirmar senha</label><input id="password_confirmation"${ssrRenderAttr("value", unref(form).password_confirmation)} type="password" autocomplete="new-password" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"${_scopeId}></div><div class="flex items-center gap-3 pt-2"${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-50"${_scopeId}>${ssrInterpolate(editando.value ? "Salvar" : "Criar")}</button>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/vendedores",
              class: "text-14 text-vidro hover:text-papel"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Cancelar`);
                } else {
                  return [
                    createTextVNode("Cancelar")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center gap-3" }, [
                createVNode(unref(Link), {
                  href: "/admin/vendedores",
                  class: "text-14 text-vidro hover:text-papel"
                }, {
                  default: withCtx(() => [
                    createTextVNode("← Vendedores")
                  ]),
                  _: 1
                })
              ]),
              createVNode("h1", { class: "mt-2 font-display text-28 font-black uppercase tracking-tight" }, toDisplayString(editando.value ? "Editar vendedor" : "Novo vendedor"), 1),
              editando.value && __props.vendedor ? (openBlock(), createBlock("p", {
                key: 0,
                class: "mt-2 text-14 text-vidro"
              }, [
                createTextVNode(" Link de divulgação: "),
                createVNode("span", { class: "font-mono text-12 font-tabular text-aceso" }, toDisplayString(__props.vendedor.link), 1)
              ])) : createCommentVNode("", true),
              createVNode("form", {
                class: "mt-6 max-w-lg space-y-4",
                onSubmit: withModifiers(salvar, ["prevent"])
              }, [
                createVNode("div", null, [
                  createVNode("label", {
                    class: "block text-12 uppercase text-vidro",
                    for: "name"
                  }, "Nome"),
                  withDirectives(createVNode("input", {
                    id: "name",
                    "onUpdate:modelValue": ($event) => unref(form).name = $event,
                    type: "text",
                    class: "mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).name]
                  ]),
                  unref(form).errors.name ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "mt-1 text-12 text-erro"
                  }, toDisplayString(unref(form).errors.name), 1)) : createCommentVNode("", true)
                ]),
                createVNode("div", null, [
                  createVNode("label", {
                    class: "block text-12 uppercase text-vidro",
                    for: "slug"
                  }, "Slug (vai no link /v/…)"),
                  withDirectives(createVNode("input", {
                    id: "slug",
                    "onUpdate:modelValue": ($event) => unref(form).slug = $event,
                    type: "text",
                    placeholder: "joao-silva",
                    class: "mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-14 font-tabular focus:border-aceso focus:outline-none"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).slug]
                  ]),
                  unref(form).errors.slug ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "mt-1 text-12 text-erro"
                  }, toDisplayString(unref(form).errors.slug), 1)) : createCommentVNode("", true)
                ]),
                createVNode("div", null, [
                  createVNode("label", {
                    class: "block text-12 uppercase text-vidro",
                    for: "phone"
                  }, "Telefone (opcional)"),
                  withDirectives(createVNode("input", {
                    id: "phone",
                    "onUpdate:modelValue": ($event) => unref(form).phone = $event,
                    type: "text",
                    class: "mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).phone]
                  ]),
                  unref(form).errors.phone ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "mt-1 text-12 text-erro"
                  }, toDisplayString(unref(form).errors.phone), 1)) : createCommentVNode("", true)
                ]),
                createVNode("div", null, [
                  createVNode("label", {
                    class: "block text-12 uppercase text-vidro",
                    for: "commission_pct"
                  }, "Comissão (%)"),
                  withDirectives(createVNode("input", {
                    id: "commission_pct",
                    "onUpdate:modelValue": ($event) => unref(form).commission_pct = $event,
                    type: "number",
                    min: "0",
                    max: "100",
                    class: "mt-1 w-32 rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-14 font-tabular focus:border-aceso focus:outline-none"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [
                      vModelText,
                      unref(form).commission_pct,
                      void 0,
                      { number: true }
                    ]
                  ]),
                  unref(form).errors.commission_pct ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "mt-1 text-12 text-erro"
                  }, toDisplayString(unref(form).errors.commission_pct), 1)) : createCommentVNode("", true)
                ]),
                createVNode("div", null, [
                  createVNode("label", {
                    class: "block text-12 uppercase text-vidro",
                    for: "group_url"
                  }, "Link do grupo do WhatsApp (opcional)"),
                  withDirectives(createVNode("input", {
                    id: "group_url",
                    "onUpdate:modelValue": ($event) => unref(form).group_url = $event,
                    type: "url",
                    placeholder: "https://chat.whatsapp.com/...",
                    class: "mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).group_url]
                  ]),
                  createVNode("p", { class: "mt-1 text-12 text-vidro" }, "Aparece para quem entra pelo link deste vendedor."),
                  unref(form).errors.group_url ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "mt-1 text-12 text-erro"
                  }, toDisplayString(unref(form).errors.group_url), 1)) : createCommentVNode("", true)
                ]),
                createVNode("div", null, [
                  createVNode("label", {
                    class: "block text-12 uppercase text-vidro",
                    for: "password"
                  }, toDisplayString(editando.value ? "Nova senha (deixe em branco para manter)" : "Senha do portal"), 1),
                  withDirectives(createVNode("input", {
                    id: "password",
                    "onUpdate:modelValue": ($event) => unref(form).password = $event,
                    type: "password",
                    autocomplete: "new-password",
                    class: "mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).password]
                  ]),
                  unref(form).errors.password ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "mt-1 text-12 text-erro"
                  }, toDisplayString(unref(form).errors.password), 1)) : createCommentVNode("", true)
                ]),
                createVNode("div", null, [
                  createVNode("label", {
                    class: "block text-12 uppercase text-vidro",
                    for: "password_confirmation"
                  }, "Confirmar senha"),
                  withDirectives(createVNode("input", {
                    id: "password_confirmation",
                    "onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
                    type: "password",
                    autocomplete: "new-password",
                    class: "mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).password_confirmation]
                  ])
                ]),
                createVNode("div", { class: "flex items-center gap-3 pt-2" }, [
                  createVNode("button", {
                    type: "submit",
                    disabled: unref(form).processing,
                    class: "rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-50"
                  }, toDisplayString(editando.value ? "Salvar" : "Criar"), 9, ["disabled"]),
                  createVNode(unref(Link), {
                    href: "/admin/vendedores",
                    class: "text-14 text-vidro hover:text-papel"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Cancelar")
                    ]),
                    _: 1
                  })
                ])
              ], 32)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Sellers/Form.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
