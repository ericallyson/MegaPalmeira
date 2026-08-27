import { defineComponent, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { useForm, Head, Link } from "@inertiajs/vue3";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "VendedorLogin",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      slug: "",
      senha: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Área do vendedor" }, null, _parent));
      _push(`<div class="min-h-screen bg-tinta text-papel"><header class="bg-papel text-tinta"><div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">`);
      _push(ssrRenderComponent(unref(Link), { href: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img src="/logoMega.png" alt="MegaPalmeira" class="h-12 w-auto"${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: "/logoMega.png",
                alt: "MegaPalmeira",
                class: "h-12 w-auto"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></header><main class="mx-auto flex max-w-sm flex-col px-4 pt-16"><h1 class="font-display text-28 font-black uppercase tracking-tight">Área do vendedor</h1><p class="mt-1 text-14 text-vidro">Entre com seu usuário e senha.</p><form class="mt-6"><label class="block text-12 uppercase text-vidro" for="slug">Usuário (slug)</label><input id="slug"${ssrRenderAttr("value", unref(form).slug)} type="text" autocomplete="username" placeholder="joao-silva" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none">`);
      if (unref(form).errors.slug) {
        _push(`<p class="mt-1 text-12 text-erro">${ssrInterpolate(unref(form).errors.slug)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<label class="mt-4 block text-12 uppercase text-vidro" for="senha">Senha</label><input id="senha"${ssrRenderAttr("value", unref(form).senha)} type="password" autocomplete="current-password" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-16 focus:border-aceso focus:outline-none">`);
      if (unref(form).errors.senha) {
        _push(`<p class="mt-1 text-12 text-erro">${ssrInterpolate(unref(form).errors.senha)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="mt-4 w-full rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-50"> Entrar </button></form></main></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/VendedorLogin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
