import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from "vue/server-renderer";
import { usePage, Link } from "@inertiajs/vue3";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AdminLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const flash = computed(() => page.props.flash);
    const user = computed(() => page.props.auth.user);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-tinta text-papel" }, _attrs))}><header class="bg-papel text-tinta"><div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin",
        class: "flex items-center gap-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img src="/logoMega.png" alt="MegaPalmeira" class="h-14 w-auto"${_scopeId}><span class="font-display text-16 font-black uppercase tracking-tight text-tinta"${_scopeId}>Admin</span>`);
          } else {
            return [
              createVNode("img", {
                src: "/logoMega.png",
                alt: "MegaPalmeira",
                class: "h-14 w-auto"
              }),
              createVNode("span", { class: "font-display text-16 font-black uppercase tracking-tight text-tinta" }, "Admin")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="flex items-center gap-4 text-14">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin",
        class: "text-noite/70 hover:text-tinta"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Painel`);
          } else {
            return [
              createTextVNode("Painel")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/rodadas",
        class: "text-noite/70 hover:text-tinta"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Rodadas`);
          } else {
            return [
              createTextVNode("Rodadas")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/apostas",
        class: "text-noite/70 hover:text-tinta"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Apostas`);
          } else {
            return [
              createTextVNode("Apostas")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/usuarios",
        class: "text-noite/70 hover:text-tinta"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Usuários`);
          } else {
            return [
              createTextVNode("Usuários")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/configuracoes",
        class: "text-noite/70 hover:text-tinta"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Configurações`);
          } else {
            return [
              createTextVNode("Configurações")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="button" class="text-noite/70 hover:text-tinta"> Sair`);
      if (user.value) {
        _push(`<span class="hidden sm:inline"> (${ssrInterpolate(user.value.name)})</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button></nav></div></header>`);
      if (flash.value.sucesso) {
        _push(`<div class="mx-auto mt-4 max-w-6xl px-4"><p class="rounded border border-jade/40 bg-jade/10 px-3 py-2 text-14 text-jade" role="status">${ssrInterpolate(flash.value.sucesso)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (flash.value.erro) {
        _push(`<div class="mx-auto mt-4 max-w-6xl px-4"><p class="rounded border border-erro/40 bg-erro/10 px-3 py-2 text-14 text-erro" role="alert">${ssrInterpolate(flash.value.erro)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<main class="mx-auto max-w-6xl px-4 py-6">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/AdminLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
