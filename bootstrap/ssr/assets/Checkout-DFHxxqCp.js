import { defineComponent, ref, computed, onMounted, onUnmounted, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./Ball-Cix1i8dF.js";
import { b as brl } from "./format-BNqt_JV5.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Checkout",
  __ssrInlineRender: true,
  props: {
    aposta: {},
    rodada: {},
    pagamento: {},
    linkCartelas: {}
  },
  setup(__props) {
    const props = __props;
    const status = ref(props.aposta.status);
    const linkCartelas = ref(props.linkCartelas);
    const copiado = ref(false);
    const agora = ref(Date.now());
    let poll = null;
    let clock = null;
    const pago = computed(() => status.value === "paid");
    const foraDoPrazo = computed(() => status.value === "paid_late");
    const expirado = computed(() => {
      if (status.value === "expired") return true;
      if (!props.pagamento?.expiraEm || pago.value || foraDoPrazo.value) return false;
      return new Date(props.pagamento.expiraEm).getTime() <= agora.value;
    });
    const restante = computed(() => {
      if (!props.pagamento?.expiraEm) return null;
      const diff = new Date(props.pagamento.expiraEm).getTime() - agora.value;
      if (diff <= 0) return "00:00";
      const m = Math.floor(diff / 6e4);
      const s = Math.floor(diff % 6e4 / 1e3);
      return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    });
    async function verificar() {
      try {
        const resposta = await fetch(`/apostas/${props.aposta.uuid}/status`, {
          headers: { Accept: "application/json" }
        });
        const dados = await resposta.json();
        status.value = dados.status;
        if (dados.linkCartelas) linkCartelas.value = dados.linkCartelas;
        if (dados.status !== "awaiting_payment" && poll) clearInterval(poll);
      } catch {
      }
    }
    onMounted(() => {
      if (status.value === "awaiting_payment") {
        poll = setInterval(verificar, 3e3);
      }
      clock = setInterval(() => agora.value = Date.now(), 1e3);
    });
    onUnmounted(() => {
      if (poll) clearInterval(poll);
      if (clock) clearInterval(clock);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Pagar com PIX" }, null, _parent));
      _push(`<div class="min-h-screen bg-tinta text-papel"><header class="border-b border-noite"><div class="mx-auto flex max-w-xl items-center justify-between px-4 py-3">`);
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
      _push(`<p class="text-14 text-vidro">${ssrInterpolate(__props.rodada.nome)}</p></div></header><main class="mx-auto max-w-xl px-4 pb-16">`);
      if (pago.value) {
        _push(`<section class="mt-10 rounded-lg border border-jade/50 bg-noite p-6 text-center" role="status"><p class="font-display text-28 font-black uppercase tracking-tight text-jade">Aposta confirmada</p><p class="mt-2 text-16 text-vidro">Sua cartela está valendo. Boa sorte!</p><div class="mt-4 flex flex-wrap justify-center gap-2"><!--[-->`);
        ssrRenderList(__props.aposta.dezenas, (n) => {
          _push(ssrRenderComponent(_sfc_main$1, {
            key: n,
            n,
            size: "md"
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
        if (linkCartelas.value) {
          _push(`<a${ssrRenderAttr("href", linkCartelas.value)} class="mt-6 inline-block rounded bg-jade px-5 py-2.5 font-display text-14 font-bold uppercase text-tinta"> Ver minhas cartelas </a>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="mt-3 text-12 text-vidro"> Guarde esse link: é o seu acesso às suas cartelas até o fim da rodada. </p>`);
        _push(ssrRenderComponent(unref(Link), {
          href: "/",
          class: "mt-4 block text-14 text-vidro underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Acompanhar o bolão`);
            } else {
              return [
                createTextVNode("Acompanhar o bolão")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</section>`);
      } else if (foraDoPrazo.value) {
        _push(`<section class="mt-10 rounded-lg border border-brasa/50 bg-noite p-6" role="alert"><p class="font-display text-20 font-black uppercase text-brasa">Pagamento fora do prazo</p><p class="mt-2 text-14 text-vidro"> Seu PIX foi aprovado depois do encerramento das apostas, então a cartela não entrou nesta rodada. O valor será estornado pela administração. </p></section>`);
      } else if (expirado.value) {
        _push(`<section class="mt-10 rounded-lg bg-noite p-6 text-center"><p class="font-display text-20 font-black uppercase text-vidro">O QR venceu</p><p class="mt-2 text-14 text-vidro">Sem problema: gere um novo e pague em até 30 minutos.</p><button type="button" class="mt-4 rounded bg-aceso px-5 py-2.5 font-display text-14 font-bold uppercase text-tinta"> Gerar novo QR </button></section>`);
      } else if (__props.pagamento) {
        _push(`<section class="mt-8"><h1 class="font-display text-28 font-black uppercase tracking-tight">Pagar com PIX</h1><p class="mt-1 text-14 text-vidro"> Escaneie o QR ou use o copia-e-cola. Assim que o pagamento cair, esta tela confirma sozinha. </p><div class="mt-5 rounded-lg bg-noite p-5 text-center"><p class="font-mono text-40 font-tabular text-jade">${ssrInterpolate(unref(brl)(__props.aposta.valorCents))}</p>`);
        if (restante.value) {
          _push(`<p class="mt-1 text-14 text-vidro"> QR válido por <span class="font-mono font-tabular text-brasa">${ssrInterpolate(restante.value)}</span></p>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.pagamento.qrCodeBase64) {
          _push(`<img${ssrRenderAttr("src", `data:image/png;base64,${__props.pagamento.qrCodeBase64}`)} alt="QR Code PIX para pagamento" class="mx-auto mt-4 h-56 w-56 rounded bg-papel p-2">`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="button" class="mt-4 w-full rounded bg-aceso px-4 py-2.5 font-display text-14 font-bold uppercase text-tinta">${ssrInterpolate(copiado.value ? "Copiado!" : "Copiar código PIX")}</button><p class="mt-2 break-all font-mono text-12 text-vidro">${ssrInterpolate(__props.pagamento.qrCode)}</p></div><div class="mt-5 rounded-lg bg-noite p-4"><p class="text-14 text-vidro">Sua cartela:</p><div class="mt-2 flex flex-wrap gap-1.5"><!--[-->`);
        ssrRenderList(__props.aposta.dezenas, (n) => {
          _push(ssrRenderComponent(_sfc_main$1, {
            key: n,
            n,
            size: "md"
          }, null, _parent));
        });
        _push(`<!--]--></div></div><p class="mt-4 text-center text-14 text-vidro" role="status"> Aguardando confirmação do pagamento… </p></section>`);
      } else {
        _push(`<section class="mt-10 rounded-lg bg-noite p-6 text-center"><p class="text-16 text-vidro">Não conseguimos gerar o QR do PIX.</p><button type="button" class="mt-4 rounded bg-aceso px-5 py-2.5 font-display text-14 font-bold uppercase text-tinta"> Tentar de novo </button></section>`);
      }
      _push(`</main></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Public/Checkout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
