import { defineComponent, unref, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain } from "vue/server-renderer";
import { useForm, Head } from "@inertiajs/vue3";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Login",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      email: "",
      password: "",
      remember: false
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Entrar" }, null, _parent));
      _push(`<div class="flex min-h-screen items-center justify-center bg-tinta px-4"><form class="w-full max-w-sm rounded-lg bg-noite p-6"><h1 class="font-display text-20 font-black uppercase tracking-tight text-aceso">Bolão Dez</h1><p class="mt-1 text-14 text-vidro">Acesso do administrador</p><label class="mt-6 block text-14 text-vidro" for="email">E-mail</label><input id="email"${ssrRenderAttr("value", unref(form).email)} type="email" required autocomplete="email" class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-16 text-papel focus:border-aceso focus:outline-none">`);
      if (unref(form).errors.email) {
        _push(`<p class="mt-1 text-12 text-erro">${ssrInterpolate(unref(form).errors.email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<label class="mt-4 block text-14 text-vidro" for="password">Senha</label><input id="password"${ssrRenderAttr("value", unref(form).password)} type="password" required autocomplete="current-password" class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-16 text-papel focus:border-aceso focus:outline-none">`);
      if (unref(form).errors.password) {
        _push(`<p class="mt-1 text-12 text-erro">${ssrInterpolate(unref(form).errors.password)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<label class="mt-4 flex items-center gap-2 text-14 text-vidro"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).remember) ? ssrLooseContain(unref(form).remember, null) : unref(form).remember) ? " checked" : ""} type="checkbox" class="accent-aceso"> Continuar conectado </label><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="mt-6 w-full rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase tracking-tight text-tinta disabled:opacity-60"> Entrar </button></form></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/Login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
