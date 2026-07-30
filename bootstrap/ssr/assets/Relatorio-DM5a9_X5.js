import { defineComponent, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { b as brl, d as dezena } from "./format-BNqt_JV5.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Relatorio",
  __ssrInlineRender: true,
  props: {
    rodadaUuid: {},
    relatorio: {},
    hash: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `Relatório — ${__props.relatorio.identificacao.nome}`
      }, null, _parent));
      _push(`<div class="min-h-screen bg-papel font-sans text-tinta"><header class="border-b border-tinta/15 print:hidden"><div class="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-6 py-4">`);
      _push(ssrRenderComponent(unref(Link), {
        href: `/admin/rodadas/${__props.rodadaUuid}`,
        class: "text-14 underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`← Voltar à rodada`);
          } else {
            return [
              createTextVNode("← Voltar à rodada")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex gap-2"><a${ssrRenderAttr("href", `/admin/rodadas/${__props.rodadaUuid}/relatorio.csv`)} class="rounded border border-tinta/30 px-4 py-2 font-display text-14 font-bold uppercase"> Baixar CSV </a><button type="button" class="rounded bg-tinta px-4 py-2 font-display text-14 font-bold uppercase text-papel"> Imprimir / PDF </button></div></div></header><main class="mx-auto max-w-4xl px-6 py-8"><h1 class="font-display text-28 font-black uppercase tracking-tight"> Relatório de fechamento </h1><section class="mt-4 text-14 leading-relaxed"><p><strong>Rodada:</strong> ${ssrInterpolate(__props.relatorio.identificacao.nome)} (${ssrInterpolate(__props.relatorio.identificacao.status)})</p><p><strong>Período:</strong> ${ssrInterpolate(__props.relatorio.identificacao.inicio)} a ${ssrInterpolate(__props.relatorio.identificacao.encerradaEm ?? "—")} · <strong>Sorteios:</strong> ${ssrInterpolate(__props.relatorio.identificacao.numeroDeSorteios)} · <strong>Regulamento:</strong> versão ${ssrInterpolate(__props.relatorio.identificacao.versaoRegulamento)}</p></section><section class="mt-8"><h2 class="border-b border-tinta/20 pb-1 font-display text-16 font-bold uppercase">Financeiro</h2><table class="mt-3 w-full text-14"><tbody><tr><td class="py-1">Cartelas pagas</td><td class="py-1 text-right font-mono font-tabular">${ssrInterpolate(__props.relatorio.financeiro.cartelasPagas)} × ${ssrInterpolate(unref(brl)(__props.relatorio.financeiro.valorCartelaCents))} = ${ssrInterpolate(unref(brl)(__props.relatorio.financeiro.arrecadacaoCents))}</td></tr>`);
      if (__props.relatorio.financeiro.rolloverEntradaCents > 0) {
        _push(`<tr><td class="py-1">Valor herdado da rodada anterior</td><td class="py-1 text-right font-mono font-tabular">${ssrInterpolate(unref(brl)(__props.relatorio.financeiro.rolloverEntradaCents))}</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<tr class="border-t border-tinta/10 font-bold"><td class="py-1">Pote</td><td class="py-1 text-right font-mono font-tabular">${ssrInterpolate(unref(brl)(__props.relatorio.financeiro.poteCents))}</td></tr><tr><td class="py-1">Prêmio principal pago</td><td class="py-1 text-right font-mono font-tabular">${ssrInterpolate(unref(brl)(__props.relatorio.financeiro.premioPrincipalPagoCents))}</td></tr><tr><td class="py-1">2º lugar pago</td><td class="py-1 text-right font-mono font-tabular">${ssrInterpolate(unref(brl)(__props.relatorio.financeiro.premioSegundoPagoCents))}</td></tr>`);
      if (__props.relatorio.financeiro.rolloverSaidaCents > 0) {
        _push(`<tr><td class="py-1">Acumulado para a próxima rodada</td><td class="py-1 text-right font-mono font-tabular">${ssrInterpolate(unref(brl)(__props.relatorio.financeiro.rolloverSaidaCents))}</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<tr><td class="py-1"> Administração <span class="text-tinta/60">(inclui ${ssrInterpolate(unref(brl)(__props.relatorio.financeiro.sobraCents))} de sobras de divisão)</span></td><td class="py-1 text-right font-mono font-tabular">${ssrInterpolate(unref(brl)(__props.relatorio.financeiro.administracaoCents))}</td></tr><tr class="border-t border-tinta/20 font-bold"><td class="py-1">Conferência de fechamento</td><td class="${ssrRenderClass([__props.relatorio.financeiro.conferenciaFecha ? "" : "text-erro", "py-1 text-right"])}">${ssrInterpolate(__props.relatorio.financeiro.conferenciaFecha ? "FECHA EXATA" : "NÃO FECHA — investigar")}</td></tr></tbody></table></section><section class="mt-8"><h2 class="border-b border-tinta/20 pb-1 font-display text-16 font-bold uppercase">Ganhadores</h2>`);
      if (__props.relatorio.ganhadores.length === 0) {
        _push(`<p class="mt-2 text-14 text-tinta/60"> Nenhum prêmio pago nesta rodada. </p>`);
      } else {
        _push(`<table class="mt-3 w-full text-left text-14"><thead><tr class="border-b border-tinta/10 text-12 uppercase text-tinta/60"><th class="py-1 pr-2">Categoria</th><th class="py-1 pr-2">Nome</th><th class="py-1 pr-2">Telefone</th><th class="py-1 pr-2">Cartela</th><th class="py-1 pr-2">Fechou no</th><th class="py-1 pr-2 text-right">Cota</th><th class="py-1">Pagamento</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(__props.relatorio.ganhadores, (g, i) => {
          _push(`<tr class="border-b border-tinta/5 align-top"><td class="py-1.5 pr-2">${ssrInterpolate(g.categoria)}</td><td class="py-1.5 pr-2">${ssrInterpolate(g.nome)}</td><td class="py-1.5 pr-2 font-mono text-12 font-tabular">${ssrInterpolate(g.telefone)}</td><td class="py-1.5 pr-2 font-mono text-12 font-tabular">${ssrInterpolate(g.cartela.map(unref(dezena)).join(" "))}</td><td class="py-1.5 pr-2 font-mono font-tabular">${ssrInterpolate(g.sorteioFechamento ?? "—")}</td><td class="py-1.5 pr-2 text-right font-mono font-tabular">${ssrInterpolate(unref(brl)(g.cotaCents))}</td><td class="py-1.5">${ssrInterpolate(g.pagoEm ? `pago em ${g.pagoEm}` : "a pagar")} `);
          if (g.observacoes) {
            _push(`<span class="text-tinta/60"> · ${ssrInterpolate(g.observacoes)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td></tr>`);
        });
        _push(`<!--]--></tbody></table>`);
      }
      _push(`</section><section class="mt-8"><h2 class="border-b border-tinta/20 pb-1 font-display text-16 font-bold uppercase"> Classificação completa </h2><table class="mt-3 w-full text-left text-14"><thead><tr class="border-b border-tinta/10 text-12 uppercase text-tinta/60"><th class="py-1 pr-2">#</th><th class="py-1 pr-2">Nome</th><th class="py-1 pr-2">Telefone</th><th class="py-1 pr-2">Pts</th><th class="py-1">Cartela</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(__props.relatorio.classificacao, (c) => {
        _push(`<tr class="border-b border-tinta/5"><td class="py-1 pr-2 font-mono font-tabular">${ssrInterpolate(c.posicao)}º</td><td class="py-1 pr-2">${ssrInterpolate(c.nome)}</td><td class="py-1 pr-2 font-mono text-12 font-tabular">${ssrInterpolate(c.telefone)}</td><td class="py-1 pr-2 font-mono font-tabular">${ssrInterpolate(c.pontos)}</td><td class="py-1 font-mono text-12 font-tabular">${ssrInterpolate(c.dezenas.map(unref(dezena)).join(" "))}</td></tr>`);
      });
      _push(`<!--]--></tbody></table></section><section class="mt-8"><h2 class="border-b border-tinta/20 pb-1 font-display text-16 font-bold uppercase"> Histórico de sorteios </h2><table class="mt-3 w-full text-left text-14"><thead><tr class="border-b border-tinta/10 text-12 uppercase text-tinta/60"><th class="py-1 pr-2">Ordem</th><th class="py-1 pr-2">Concurso</th><th class="py-1 pr-2">Data</th><th class="py-1 pr-2">Dezenas</th><th class="py-1">Cartelas que pontuaram</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(__props.relatorio.sorteios, (s) => {
        _push(`<tr class="border-b border-tinta/5"><td class="py-1 pr-2 font-mono font-tabular">${ssrInterpolate(s.sequencia)}º</td><td class="py-1 pr-2 font-mono font-tabular">${ssrInterpolate(s.concurso)}</td><td class="py-1 pr-2 font-mono text-12 font-tabular">${ssrInterpolate(s.data)}</td><td class="py-1 pr-2 font-mono text-12 font-tabular">${ssrInterpolate(s.dezenas.map(unref(dezena)).join(" "))} `);
        if (s.corrigidoEm) {
          _push(`<span class="text-erro">(corrigido: ${ssrInterpolate(s.motivoCorrecao)})</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</td><td class="py-1 font-mono font-tabular">${ssrInterpolate(s.cartelasQuePontuaram)}</td></tr>`);
      });
      _push(`<!--]--></tbody></table></section><section class="mt-8"><h2 class="border-b border-tinta/20 pb-1 font-display text-16 font-bold uppercase">Auditoria</h2>`);
      if (__props.relatorio.auditoria.length === 0) {
        _push(`<p class="mt-2 text-14 text-tinta/60"> Nenhuma intervenção manual nesta rodada. </p>`);
      } else {
        _push(`<table class="mt-3 w-full text-left text-14"><thead><tr class="border-b border-tinta/10 text-12 uppercase text-tinta/60"><th class="py-1 pr-2">Tipo</th><th class="py-1 pr-2">Alvo</th><th class="py-1 pr-2">Motivo</th><th class="py-1 pr-2">Responsável</th><th class="py-1">Quando</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(__props.relatorio.auditoria, (a, i) => {
          _push(`<tr class="border-b border-tinta/5"><td class="py-1 pr-2">${ssrInterpolate(a.tipo)}</td><td class="py-1 pr-2">${ssrInterpolate(a.alvo)}</td><td class="py-1 pr-2">${ssrInterpolate(a.motivo)}</td><td class="py-1 pr-2">${ssrInterpolate(a.responsavel ?? "—")}</td><td class="py-1 font-mono text-12 font-tabular">${ssrInterpolate(a.quando)}</td></tr>`);
        });
        _push(`<!--]--></tbody></table>`);
      }
      _push(`</section><footer class="mt-10 border-t border-tinta/20 pt-4"><p class="text-12 text-tinta/60"> Integridade do documento — SHA-256 do conteúdo do fechamento (reimpressões geram o mesmo hash): </p><p class="mt-1 break-all font-mono text-12 font-tabular">${ssrInterpolate(__props.hash)}</p></footer></main></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Rounds/Relatorio.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
