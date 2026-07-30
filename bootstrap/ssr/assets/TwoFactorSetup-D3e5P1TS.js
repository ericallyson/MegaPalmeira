import { defineComponent, ref, unref, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TwoFactorSetup",
  __ssrInlineRender: true,
  props: {
    enabled: { type: Boolean },
    confirmed: { type: Boolean }
  },
  setup(__props) {
    const qrSvg = ref(null);
    const codigo = ref("");
    const senha = ref("");
    const pedindoSenha = ref(false);
    const erro = ref(null);
    const recuperacao = ref([]);
    const carregando = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Ativar verificação em duas etapas" }, null, _parent));
      _push(`<div class="flex min-h-screen items-center justify-center bg-tinta px-4"><div class="w-full max-w-md rounded-lg bg-noite p-6"><h1 class="font-display text-20 font-black uppercase tracking-tight text-aceso"> Verificação em duas etapas </h1><p class="mt-2 text-14 text-vidro"> A conta do admin movimenta dinheiro. O painel só abre com a verificação em duas etapas ativa. </p>`);
      if (erro.value) {
        _push(`<p class="mt-4 rounded border border-erro/40 bg-erro/10 px-3 py-2 text-14 text-erro" role="alert">${ssrInterpolate(erro.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (recuperacao.value.length) {
        _push(`<div class="mt-6"><p class="text-14 text-jade">Verificação ativada. Guarde os códigos de recuperação:</p><ul class="mt-3 grid grid-cols-2 gap-2 font-mono text-14 font-tabular"><!--[-->`);
        ssrRenderList(recuperacao.value, (code) => {
          _push(`<li class="rounded bg-tinta px-2 py-1">${ssrInterpolate(code)}</li>`);
        });
        _push(`<!--]--></ul><button type="button" class="mt-6 w-full rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta"> Ir para o painel </button></div>`);
      } else if (pedindoSenha.value) {
        _push(`<div class="mt-6"><label class="block text-14 text-vidro" for="senha">Confirme sua senha para continuar</label><input id="senha"${ssrRenderAttr("value", senha.value)} type="password" autocomplete="current-password" class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-16 text-papel focus:border-aceso focus:outline-none"><button type="button"${ssrIncludeBooleanAttr(carregando.value) ? " disabled" : ""} class="mt-4 w-full rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-60"> Confirmar senha </button></div>`);
      } else if (qrSvg.value) {
        _push(`<div class="mt-6"><p class="text-14 text-vidro">1. Escaneie o QR no seu aplicativo autenticador:</p><div class="mt-3 flex justify-center rounded bg-papel p-4">${qrSvg.value ?? ""}</div><p class="mt-4 text-14 text-vidro">2. Digite o código de 6 dígitos gerado:</p><input${ssrRenderAttr("value", codigo.value)} type="text" inputmode="numeric" autocomplete="one-time-code" aria-label="Código do aplicativo autenticador" class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 font-mono text-16 text-papel focus:border-aceso focus:outline-none"><button type="button"${ssrIncludeBooleanAttr(carregando.value) ? " disabled" : ""} class="mt-4 w-full rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-60"> Ativar verificação </button></div>`);
      } else {
        _push(`<div class="mt-6"><button type="button"${ssrIncludeBooleanAttr(carregando.value) ? " disabled" : ""} class="w-full rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-60"> Ativar verificação em duas etapas </button></div>`);
      }
      _push(`</div></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/TwoFactorSetup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
