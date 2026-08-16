import { defineComponent, computed, unref, withCtx, createTextVNode, createVNode, toDisplayString, withModifiers, withDirectives, vModelText, openBlock, createBlock, createCommentVNode, vModelCheckbox, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain } from "vue/server-renderer";
import { useForm, Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AdminLayout-DEWhWsQ5.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Form",
  __ssrInlineRender: true,
  props: {
    usuario: {}
  },
  setup(__props) {
    const props = __props;
    const editando = computed(() => props.usuario !== null);
    const form = useForm({
      name: props.usuario?.nome ?? "",
      email: props.usuario?.email ?? "",
      phone: props.usuario?.telefone ?? "",
      password: "",
      password_confirmation: "",
      is_admin: props.usuario?.admin ?? false
    });
    function salvar() {
      if (editando.value) {
        form.put(`/admin/usuarios/${props.usuario.id}`);
      } else {
        form.post("/admin/usuarios");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: editando.value ? "Editar usuário" : "Novo usuário"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/usuarios",
              class: "text-14 text-vidro hover:text-papel"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`← Usuários`);
                } else {
                  return [
                    createTextVNode("← Usuários")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><h1 class="mt-2 font-display text-28 font-black uppercase tracking-tight"${_scopeId}>${ssrInterpolate(editando.value ? "Editar usuário" : "Novo usuário")}</h1><form class="mt-6 max-w-lg space-y-4"${_scopeId}><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="name"${_scopeId}>Nome</label><input id="name"${ssrRenderAttr("value", unref(form).name)} type="text" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"${_scopeId}>`);
            if (unref(form).errors.name) {
              _push2(`<p class="mt-1 text-12 text-erro"${_scopeId}>${ssrInterpolate(unref(form).errors.name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="email"${_scopeId}>E-mail</label><input id="email"${ssrRenderAttr("value", unref(form).email)} type="email" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"${_scopeId}>`);
            if (unref(form).errors.email) {
              _push2(`<p class="mt-1 text-12 text-erro"${_scopeId}>${ssrInterpolate(unref(form).errors.email)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="phone"${_scopeId}>Telefone (opcional)</label><input id="phone"${ssrRenderAttr("value", unref(form).phone)} type="text" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"${_scopeId}>`);
            if (unref(form).errors.phone) {
              _push2(`<p class="mt-1 text-12 text-erro"${_scopeId}>${ssrInterpolate(unref(form).errors.phone)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="password"${_scopeId}>${ssrInterpolate(editando.value ? "Nova senha (deixe em branco para manter)" : "Senha")}</label><input id="password"${ssrRenderAttr("value", unref(form).password)} type="password" autocomplete="new-password" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"${_scopeId}>`);
            if (unref(form).errors.password) {
              _push2(`<p class="mt-1 text-12 text-erro"${_scopeId}>${ssrInterpolate(unref(form).errors.password)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="password_confirmation"${_scopeId}>Confirmar senha</label><input id="password_confirmation"${ssrRenderAttr("value", unref(form).password_confirmation)} type="password" autocomplete="new-password" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"${_scopeId}></div><label class="flex items-center gap-2 text-14"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_admin) ? ssrLooseContain(unref(form).is_admin, null) : unref(form).is_admin) ? " checked" : ""} type="checkbox" class="h-4 w-4"${_scopeId}> Administrador (acesso ao painel) </label><div class="flex items-center gap-3 pt-2"${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-50"${_scopeId}>${ssrInterpolate(editando.value ? "Salvar" : "Criar")}</button>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/usuarios",
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
                  href: "/admin/usuarios",
                  class: "text-14 text-vidro hover:text-papel"
                }, {
                  default: withCtx(() => [
                    createTextVNode("← Usuários")
                  ]),
                  _: 1
                })
              ]),
              createVNode("h1", { class: "mt-2 font-display text-28 font-black uppercase tracking-tight" }, toDisplayString(editando.value ? "Editar usuário" : "Novo usuário"), 1),
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
                    for: "email"
                  }, "E-mail"),
                  withDirectives(createVNode("input", {
                    id: "email",
                    "onUpdate:modelValue": ($event) => unref(form).email = $event,
                    type: "email",
                    class: "mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).email]
                  ]),
                  unref(form).errors.email ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "mt-1 text-12 text-erro"
                  }, toDisplayString(unref(form).errors.email), 1)) : createCommentVNode("", true)
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
                    for: "password"
                  }, toDisplayString(editando.value ? "Nova senha (deixe em branco para manter)" : "Senha"), 1),
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
                createVNode("label", { class: "flex items-center gap-2 text-14" }, [
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).is_admin = $event,
                    type: "checkbox",
                    class: "h-4 w-4"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelCheckbox, unref(form).is_admin]
                  ]),
                  createTextVNode(" Administrador (acesso ao painel) ")
                ]),
                createVNode("div", { class: "flex items-center gap-3 pt-2" }, [
                  createVNode("button", {
                    type: "submit",
                    disabled: unref(form).processing,
                    class: "rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-50"
                  }, toDisplayString(editando.value ? "Salvar" : "Criar"), 9, ["disabled"]),
                  createVNode(unref(Link), {
                    href: "/admin/usuarios",
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Users/Form.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
