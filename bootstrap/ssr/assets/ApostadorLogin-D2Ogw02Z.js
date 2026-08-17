import { defineComponent, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { useForm, Head, Link } from "@inertiajs/vue3";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ApostadorLogin",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      celular: "",
      data_nascimento: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Minhas apostas" }, null, _parent));
      _push(`<div class="min-h-screen bg-tinta text-papel"><header class="border-b border-noite"><div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/",
        class: "font-display text-16 font-black uppercase tracking-tight text-aceso"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` MegaPalmeira `);
          } else {
            return [
              createTextVNode(" MegaPalmeira ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></header><main class="mx-auto flex max-w-sm flex-col px-4 pt-16"><h1 class="font-display text-28 font-black uppercase tracking-tight">Minhas apostas</h1><p class="mt-1 text-14 text-vidro"> Entre com o celular e a data de nascimento que você usou para apostar. </p><form class="mt-6"><label class="block text-12 uppercase text-vidro" for="celular">Celular com DDD</label><input id="celular"${ssrRenderAttr("value", unref(form).celular)} type="tel" inputmode="tel" autocomplete="tel" placeholder="(82) 99123-4589" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-16 focus:border-aceso focus:outline-none">`);
      if (unref(form).errors.celular) {
        _push(`<p class="mt-1 text-12 text-erro">${ssrInterpolate(unref(form).errors.celular)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<label class="mt-4 block text-12 uppercase text-vidro" for="data_nascimento">Data de nascimento</label><input id="data_nascimento"${ssrRenderAttr("value", unref(form).data_nascimento)} type="date" autocomplete="bday" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-16 focus:border-aceso focus:outline-none">`);
      if (unref(form).errors.data_nascimento) {
        _push(`<p class="mt-1 text-12 text-erro">${ssrInterpolate(unref(form).errors.data_nascimento)}</p>`);
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
