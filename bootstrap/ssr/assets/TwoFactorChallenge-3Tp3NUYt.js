import { defineComponent, ref, unref, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { useForm, Head } from "@inertiajs/vue3";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TwoFactorChallenge",
  __ssrInlineRender: true,
  setup(__props) {
    const usandoRecuperacao = ref(false);
    const form = useForm({
      code: "",
      recovery_code: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Verificação em duas etapas" }, null, _parent));
      _push(`<div class="flex min-h-screen items-center justify-center bg-tinta px-4"><form class="w-full max-w-sm rounded-lg bg-noite p-6"><h1 class="font-display text-20 font-black uppercase tracking-tight text-aceso">Verificação</h1><p class="mt-1 text-14 text-vidro">${ssrInterpolate(usandoRecuperacao.value ? "Informe um código de recuperação." : "Informe o código do seu aplicativo autenticador.")}</p>`);
      if (!usandoRecuperacao.value) {
        _push(`<!--[--><label class="mt-6 block text-14 text-vidro" for="code">Código</label><input id="code"${ssrRenderAttr("value", unref(form).code)} type="text" inputmode="numeric" autocomplete="one-time-code" class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 font-mono text-16 text-papel focus:border-aceso focus:outline-none">`);
        if (unref(form).errors.code) {
          _push(`<p class="mt-1 text-12 text-erro">${ssrInterpolate(unref(form).errors.code)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!--[--><label class="mt-6 block text-14 text-vidro" for="recovery_code">Código de recuperação</label><input id="recovery_code"${ssrRenderAttr("value", unref(form).recovery_code)} type="text" class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 font-mono text-16 text-papel focus:border-aceso focus:outline-none">`);
        if (unref(form).errors.recovery_code) {
          _push(`<p class="mt-1 text-12 text-erro">${ssrInterpolate(unref(form).errors.recovery_code)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="mt-6 w-full rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase tracking-tight text-tinta disabled:opacity-60"> Confirmar </button><button type="button" class="mt-3 w-full text-center text-14 text-vidro underline">${ssrInterpolate(usandoRecuperacao.value ? "Usar código do aplicativo" : "Usar código de recuperação")}</button></form></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/TwoFactorChallenge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
