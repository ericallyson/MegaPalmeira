import { defineComponent, unref, withCtx, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { useForm, Head, Link } from "@inertiajs/vue3";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ApostadorLogin",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      celular: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Minhas apostas" }, null, _parent));
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
      _push(`</div></header><main class="mx-auto flex max-w-sm flex-col px-4 pt-16"><h1 class="font-display text-28 font-black uppercase tracking-tight">Minhas apostas</h1><p class="mt-1 text-14 text-vidro"> Entre com o celular que você usou para apostar. </p><form class="mt-6"><label class="block text-12 uppercase text-vidro" for="celular">Celular com DDD</label><input id="celular"${ssrRenderAttr("value", unref(form).celular)} type="tel" inputmode="tel" autocomplete="tel" placeholder="(82) 99123-4589" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-16 focus:border-aceso focus:outline-none">`);
      if (unref(form).errors.celular) {
        _push(`<p class="mt-1 text-12 text-erro">${ssrInterpolate(unref(form).errors.celular)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="mt-4 w-full rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-50"> Entrar </button></form><p class="mt-6 text-12 text-vidro"> Ainda não apostou? `);
      _push(ssrRenderComponent(unref(Link), {
        href: "/apostar",
        class: "text-aceso underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Fazer uma aposta`);
          } else {
            return [
              createTextVNode("Fazer uma aposta")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`. </p></main></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/ApostadorLogin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
