import { defineComponent, computed, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain } from "vue/server-renderer";
import { useForm, Head, Link } from "@inertiajs/vue3";
import { b as brl, a as dataHora, d as dezena } from "./format-BNqt_JV5.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Apostar",
  __ssrInlineRender: true,
  props: {
    rodada: {}
  },
  setup(__props) {
    const form = useForm({
      nome: "",
      celular: "",
      email: "",
      numbers: [],
      aceite_maioridade: false,
      aceite_regulamento: false
    });
    const faltam = computed(() => 10 - form.numbers.length);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Fazer minha aposta" }, null, _parent));
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
      _push(`<p class="text-14 text-vidro">${ssrInterpolate(__props.rodada.nome)}</p></div></header><main class="mx-auto max-w-3xl px-4 pb-16"><h1 class="mt-6 font-display text-28 font-black uppercase tracking-tight">Fazer minha aposta</h1><p class="mt-1 text-14 text-vidro">${ssrInterpolate(unref(brl)(__props.rodada.valorCents))} por cartela · apostas até ${ssrInterpolate(unref(dataHora)(__props.rodada.encerramentoApostas))} · máximo de ${ssrInterpolate(__props.rodada.maxCartelasPorPessoa)} cartelas por pessoa </p><form class="mt-6 space-y-6"><section aria-labelledby="dezenas-label"><div class="flex flex-wrap items-center justify-between gap-3"><p id="dezenas-label" class="text-16"> Escolha 10 dezenas <span class="${ssrRenderClass([faltam.value === 0 ? "text-jade" : "text-aceso", "font-mono font-tabular"])}">${ssrInterpolate(faltam.value === 0 ? "· cartela completa" : `· faltam ${faltam.value}`)}</span></p><button type="button" class="rounded border border-aceso px-3 py-1.5 font-display text-12 font-bold uppercase text-aceso"> Surpresinha </button></div><div class="mt-3 grid grid-cols-6 gap-1.5 sm:grid-cols-10" role="group" aria-label="Dezenas de 1 a 60"><!--[-->`);
      ssrRenderList(60, (n) => {
        _push(`<button type="button"${ssrRenderAttr("aria-pressed", unref(form).numbers.includes(n))}${ssrRenderAttr("aria-label", `Dezena ${n}`)} class="${ssrRenderClass([unref(form).numbers.includes(n) ? "border border-aceso bg-aceso font-bold text-tinta" : "border border-vidro/30 bg-noite text-vidro hover:border-vidro", "flex h-10 items-center justify-center rounded-full font-mono text-14 font-tabular focus:outline-none focus-visible:ring-2 focus-visible:ring-aceso"])}">${ssrInterpolate(unref(dezena)(n))}</button>`);
      });
      _push(`<!--]--></div>`);
      if (unref(form).errors.numbers) {
        _push(`<p class="mt-2 text-14 text-erro">${ssrInterpolate(unref(form).errors.numbers)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><section class="rounded-lg bg-noite p-4"><div class="grid gap-4 sm:grid-cols-2"><div><label class="block text-14 text-vidro" for="nome">Nome completo</label><input id="nome"${ssrRenderAttr("value", unref(form).nome)} type="text" required autocomplete="name" class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-16 focus:border-aceso focus:outline-none">`);
      if (unref(form).errors.nome) {
        _push(`<p class="mt-1 text-12 text-erro">${ssrInterpolate(unref(form).errors.nome)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-14 text-vidro" for="celular">Celular com DDD</label><input id="celular"${ssrRenderAttr("value", unref(form).celular)} type="tel" required autocomplete="tel-national" placeholder="(82) 99123-4589" class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none">`);
      if (unref(form).errors.celular) {
        _push(`<p class="mt-1 text-12 text-erro">${ssrInterpolate(unref(form).errors.celular)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="mt-4"><label class="block text-14 text-vidro" for="email">E-mail (opcional, para o comprovante)</label><input id="email"${ssrRenderAttr("value", unref(form).email)} type="email" autocomplete="email" class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-16 focus:border-aceso focus:outline-none">`);
      if (unref(form).errors.email) {
        _push(`<p class="mt-1 text-12 text-erro">${ssrInterpolate(unref(form).errors.email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><label class="mt-4 flex items-start gap-2 text-14"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).aceite_maioridade) ? ssrLooseContain(unref(form).aceite_maioridade, null) : unref(form).aceite_maioridade) ? " checked" : ""} type="checkbox" class="mt-1 accent-aceso"><span>Tenho 18 anos ou mais.</span></label>`);
      if (unref(form).errors.aceite_maioridade) {
        _push(`<p class="mt-1 text-12 text-erro">${ssrInterpolate(unref(form).errors.aceite_maioridade)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<label class="mt-2 flex items-start gap-2 text-14"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).aceite_regulamento) ? ssrLooseContain(unref(form).aceite_regulamento, null) : unref(form).aceite_regulamento) ? " checked" : ""} type="checkbox" class="mt-1 accent-aceso"><span> Li e aceito o `);
      _push(ssrRenderComponent(unref(Link), {
        href: "/regulamento",
        class: "text-aceso underline",
        target: "_blank"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`regulamento`);
          } else {
            return [
              createTextVNode("regulamento")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` (versão ${ssrInterpolate(__props.rodada.versaoRegulamento)}). </span></label>`);
      if (unref(form).errors.aceite_regulamento) {
        _push(`<p class="mt-1 text-12 text-erro">${ssrInterpolate(unref(form).errors.aceite_regulamento)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing || faltam.value > 0) ? " disabled" : ""} class="w-full rounded bg-aceso px-6 py-3 font-display text-16 font-bold uppercase tracking-tight text-tinta disabled:opacity-50 sm:w-auto"> Pagar com PIX · ${ssrInterpolate(unref(brl)(__props.rodada.valorCents))}</button></form></main></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Apostar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
