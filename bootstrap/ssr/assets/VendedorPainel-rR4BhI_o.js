import { defineComponent, ref, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { b as brl, d as dezena, a as dataHora } from "./format-BNqt_JV5.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "VendedorPainel",
  __ssrInlineRender: true,
  props: {
    vendedor: {},
    rodadas: {},
    rodadaAtual: {},
    resumo: {},
    apostas: {}
  },
  setup(__props) {
    const props = __props;
    const rodada = ref(props.rodadaAtual ?? "");
    const motivos = ref({});
    const abertaParaBaixa = ref(null);
    const copiado = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Área do vendedor" }, null, _parent));
      _push(`<div class="min-h-screen bg-tinta text-papel"><header class="bg-papel text-tinta"><div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">`);
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
      _push(`<button type="button" class="text-14 text-noite/70 hover:text-tinta">Sair</button></div></header><main class="mx-auto max-w-4xl px-4 pb-16"><h1 class="mt-6 font-display text-28 font-black uppercase tracking-tight">Olá, ${ssrInterpolate(__props.vendedor.nome)}</h1><p class="mt-1 text-14 text-vidro"> Seu link: <span class="font-mono text-12 font-tabular text-aceso">${ssrInterpolate(__props.vendedor.link)}</span><button type="button" class="ml-2 text-aceso underline">${ssrInterpolate(copiado.value ? "Copiado!" : "Copiar")}</button></p>`);
      if (__props.rodadas.length === 0) {
        _push(`<div class="mt-8 rounded-lg bg-noite p-6"><p class="text-16 text-vidro">Ainda não há apostas feitas pelo seu link.</p></div>`);
      } else {
        _push(`<!--[--><div class="mt-6"><label class="block text-12 uppercase text-vidro" for="rodada">Rodada</label><select id="rodada" class="mt-1 rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"><!--[-->`);
        ssrRenderList(__props.rodadas, (r) => {
          _push(`<option${ssrRenderAttr("value", r.uuid)}${ssrIncludeBooleanAttr(Array.isArray(rodada.value) ? ssrLooseContain(rodada.value, r.uuid) : ssrLooseEqual(rodada.value, r.uuid)) ? " selected" : ""}>${ssrInterpolate(r.nome)}</option>`);
        });
        _push(`<!--]--></select></div><section class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Resumo da rodada"><div class="rounded-lg bg-noite p-4"><p class="text-12 uppercase text-vidro">Apostas</p><p class="mt-1 font-mono text-20 font-tabular">${ssrInterpolate(__props.resumo.apostas)}</p></div><div class="rounded-lg bg-noite p-4"><p class="text-12 uppercase text-vidro">Pagas</p><p class="mt-1 font-mono text-20 font-tabular text-jade">${ssrInterpolate(__props.resumo.pagas)}</p></div><div class="rounded-lg bg-noite p-4"><p class="text-12 uppercase text-vidro">Arrecadação (pagas)</p><p class="mt-1 font-mono text-20 font-tabular">${ssrInterpolate(unref(brl)(__props.resumo.arrecadacaoPagasCents))}</p></div><div class="rounded-lg bg-noite p-4"><p class="text-12 uppercase text-vidro">Sua comissão (${ssrInterpolate(__props.vendedor.comissaoPct)}%)</p><p class="mt-1 font-mono text-20 font-tabular text-aceso">${ssrInterpolate(unref(brl)(__props.resumo.comissaoCents))}</p></div></section><div class="mt-4 overflow-x-auto rounded-lg bg-noite"><table class="w-full text-left text-14"><thead><tr class="border-b border-vidro/20 text-12 uppercase text-vidro"><th class="px-3 py-2">Apostador</th><th class="px-3 py-2">Dezenas</th><th class="px-3 py-2">Valor</th><th class="px-3 py-2">Status</th><th class="px-3 py-2">Ações</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(__props.apostas, (a) => {
          _push(`<!--[--><tr class="border-b border-vidro/10"><td class="px-3 py-2"><p>${ssrInterpolate(a.nome)}</p><p class="font-mono text-12 font-tabular text-vidro">${ssrInterpolate(a.telefone)}</p></td><td class="px-3 py-2 font-mono text-12 font-tabular">${ssrInterpolate(a.dezenas.map(unref(dezena)).join(" "))}</td><td class="px-3 py-2 font-mono font-tabular">${ssrInterpolate(unref(brl)(a.valorCents))}</td><td class="px-3 py-2"><span class="${ssrRenderClass(a.status === "paid" ? "text-jade" : a.status === "paid_late" ? "text-brasa" : "text-vidro")}">${ssrInterpolate(a.statusLabel)}</span>`);
          if (a.metodo) {
            _push(`<p class="text-12 text-vidro">${ssrInterpolate(a.metodo)}</p>`);
          } else {
            _push(`<!---->`);
          }
          if (a.pagaEm) {
            _push(`<p class="text-12 text-vidro">${ssrInterpolate(unref(dataHora)(a.pagaEm))}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="px-3 py-2">`);
          if (a.podeDarBaixa) {
            _push(`<button type="button" class="text-14 text-aceso underline"> Dar baixa </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td></tr>`);
          if (abertaParaBaixa.value === a.uuid) {
            _push(`<tr class="border-b border-vidro/10 bg-tinta/40"><td colspan="5" class="px-3 py-3"><label class="block text-12 uppercase text-vidro"${ssrRenderAttr("for", `motivo-${a.uuid}`)}> Motivo da baixa manual (obrigatório) </label><div class="mt-1 flex gap-2"><input${ssrRenderAttr("id", `motivo-${a.uuid}`)}${ssrRenderAttr("value", motivos.value[a.uuid])} type="text" placeholder="Ex.: pagou em dinheiro comigo" class="w-full max-w-md rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"><button type="button" class="rounded bg-jade px-4 py-2 font-display text-14 font-bold uppercase text-tinta"> Confirmar baixa </button></div></td></tr>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]-->`);
        if (__props.apostas.length === 0) {
          _push(`<tr><td colspan="5" class="px-3 py-6 text-vidro">Nenhuma aposta nesta rodada.</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div><p class="mt-4 text-12 text-vidro"> A comissão é calculada apenas sobre as apostas efetivamente pagas. Baixas manuais que você registrar aparecem na prestação de contas da rodada. </p><!--]-->`);
      }
      _push(`</main></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/VendedorPainel.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
