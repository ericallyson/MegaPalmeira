import { defineComponent, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./Ball-Cix1i8dF.js";
import { b as brl } from "./format-BNqt_JV5.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MinhasCartelas",
  __ssrInlineRender: true,
  props: {
    apostador: {},
    cartelas: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Minhas cartelas" }, null, _parent));
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
      _push(`</div></header><main class="mx-auto max-w-3xl px-4 pb-16"><h1 class="mt-6 font-display text-28 font-black uppercase tracking-tight"> Minhas cartelas </h1><p class="mt-1 text-14 text-vidro">${ssrInterpolate(__props.apostador.nome)} · ${ssrInterpolate(__props.apostador.telefoneMascarado)}</p>`);
      if (__props.cartelas.length === 0) {
        _push(`<div class="mt-8 rounded-lg bg-noite p-6"><p class="text-16 text-vidro">Nenhuma cartela ainda. Seja o primeiro.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(__props.cartelas, (cartela) => {
        _push(`<div class="mt-4 rounded-lg bg-noite p-4"><div class="flex flex-wrap items-center justify-between gap-2"><p class="text-14 text-vidro">${ssrInterpolate(cartela.rodada)}</p><p class="text-14"><span class="${ssrRenderClass(cartela.status === "paid" ? "text-jade" : cartela.status === "paid_late" ? "text-brasa" : "text-vidro")}">${ssrInterpolate(cartela.statusLabel)}</span>`);
        if (cartela.status === "paid") {
          _push(`<span class="ml-2 font-mono font-tabular text-aceso">${ssrInterpolate(cartela.pontos)} pts </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</p></div><div class="mt-3 flex flex-wrap gap-1.5"><!--[-->`);
        ssrRenderList(cartela.numeros, (n) => {
          _push(ssrRenderComponent(_sfc_main$1, {
            key: n.number,
            n: n.number,
            lit: n.matchedDrawId !== null,
            size: "md"
          }, null, _parent));
        });
        _push(`<!--]--></div></div>`);
      });
      _push(`<!--]--><footer class="mt-10 border-t border-noite pt-4 text-14 text-vidro"><p> Você já apostou <span class="font-mono font-tabular text-papel">${ssrInterpolate(unref(brl)(__props.apostador.totalApostadoCents))}</span> nesta rodada. Jogo é entretenimento: aposte com responsabilidade. </p></footer></main></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/MinhasCartelas.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
