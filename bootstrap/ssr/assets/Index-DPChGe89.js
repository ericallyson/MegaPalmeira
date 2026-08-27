import { defineComponent, unref, withCtx, createVNode, withModifiers, withDirectives, vModelText, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { useForm, Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AdminLayout-DY_Q8-70.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    mercadoPago: {}
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      mp_base_url: props.mercadoPago.baseUrl,
      mp_notification_url: props.mercadoPago.notificationUrl ?? "",
      mp_access_token: "",
      mp_webhook_secret: ""
    });
    function salvar() {
      form.put("/admin/configuracoes", {
        preserveScroll: true,
        onSuccess: () => form.reset("mp_access_token", "mp_webhook_secret")
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Configurações" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h1 class="font-display text-28 font-black uppercase tracking-tight"${_scopeId}>Configurações</h1><p class="mt-1 text-14 text-vidro"${_scopeId}> As credenciais abaixo ficam salvas no banco (cifradas) e substituem as variáveis de ambiente. </p><form class="mt-6 max-w-2xl space-y-6"${_scopeId}><section class="rounded-lg bg-noite p-5"${_scopeId}><h2 class="font-display text-16 font-black uppercase tracking-tight text-aceso"${_scopeId}>Mercado Pago</h2><div class="mt-4 space-y-4"${_scopeId}><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="mp_base_url"${_scopeId}>URL base da API</label><input id="mp_base_url"${ssrRenderAttr("value", unref(form).mp_base_url)} type="url" placeholder="https://api.mercadopago.com" class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-14 focus:border-aceso focus:outline-none"${_scopeId}>`);
            if (unref(form).errors.mp_base_url) {
              _push2(`<p class="mt-1 text-12 text-erro"${_scopeId}>${ssrInterpolate(unref(form).errors.mp_base_url)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="mp_notification_url"${_scopeId}> URL de notificação (webhook) </label><input id="mp_notification_url"${ssrRenderAttr("value", unref(form).mp_notification_url)} type="url" placeholder="https://megapalmeira.com.br/webhooks/mercadopago" class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-14 focus:border-aceso focus:outline-none"${_scopeId}>`);
            if (unref(form).errors.mp_notification_url) {
              _push2(`<p class="mt-1 text-12 text-erro"${_scopeId}>${ssrInterpolate(unref(form).errors.mp_notification_url)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="mp_access_token"${_scopeId}>Access Token</label><input id="mp_access_token"${ssrRenderAttr("value", unref(form).mp_access_token)} type="password" autocomplete="off"${ssrRenderAttr("placeholder", __props.mercadoPago.accessTokenConfigurado ? `Configurado (${__props.mercadoPago.accessTokenDica}) — deixe em branco para manter` : "Ainda não configurado")} class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-14 focus:border-aceso focus:outline-none"${_scopeId}>`);
            if (unref(form).errors.mp_access_token) {
              _push2(`<p class="mt-1 text-12 text-erro"${_scopeId}>${ssrInterpolate(unref(form).errors.mp_access_token)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-12 uppercase text-vidro" for="mp_webhook_secret"${_scopeId}> Assinatura secreta do webhook </label><input id="mp_webhook_secret"${ssrRenderAttr("value", unref(form).mp_webhook_secret)} type="password" autocomplete="off"${ssrRenderAttr("placeholder", __props.mercadoPago.webhookSecretConfigurado ? `Configurado (${__props.mercadoPago.webhookSecretDica}) — deixe em branco para manter` : "Ainda não configurado")} class="mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-14 focus:border-aceso focus:outline-none"${_scopeId}>`);
            if (unref(form).errors.mp_webhook_secret) {
              _push2(`<p class="mt-1 text-12 text-erro"${_scopeId}>${ssrInterpolate(unref(form).errors.mp_webhook_secret)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></section><div class="flex items-center gap-3"${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-50"${_scopeId}> Salvar </button>`);
            if (unref(form).recentlySuccessful) {
              _push2(`<span class="text-14 text-jade"${_scopeId}>Salvo.</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("h1", { class: "font-display text-28 font-black uppercase tracking-tight" }, "Configurações"),
              createVNode("p", { class: "mt-1 text-14 text-vidro" }, " As credenciais abaixo ficam salvas no banco (cifradas) e substituem as variáveis de ambiente. "),
              createVNode("form", {
                class: "mt-6 max-w-2xl space-y-6",
                onSubmit: withModifiers(salvar, ["prevent"])
              }, [
                createVNode("section", { class: "rounded-lg bg-noite p-5" }, [
                  createVNode("h2", { class: "font-display text-16 font-black uppercase tracking-tight text-aceso" }, "Mercado Pago"),
                  createVNode("div", { class: "mt-4 space-y-4" }, [
                    createVNode("div", null, [
                      createVNode("label", {
                        class: "block text-12 uppercase text-vidro",
                        for: "mp_base_url"
                      }, "URL base da API"),
                      withDirectives(createVNode("input", {
                        id: "mp_base_url",
                        "onUpdate:modelValue": ($event) => unref(form).mp_base_url = $event,
                        type: "url",
                        placeholder: "https://api.mercadopago.com",
                        class: "mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).mp_base_url]
                      ]),
                      unref(form).errors.mp_base_url ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-12 text-erro"
                      }, toDisplayString(unref(form).errors.mp_base_url), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", null, [
                      createVNode("label", {
                        class: "block text-12 uppercase text-vidro",
                        for: "mp_notification_url"
                      }, " URL de notificação (webhook) "),
                      withDirectives(createVNode("input", {
                        id: "mp_notification_url",
                        "onUpdate:modelValue": ($event) => unref(form).mp_notification_url = $event,
                        type: "url",
                        placeholder: "https://megapalmeira.com.br/webhooks/mercadopago",
                        class: "mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).mp_notification_url]
                      ]),
                      unref(form).errors.mp_notification_url ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-12 text-erro"
                      }, toDisplayString(unref(form).errors.mp_notification_url), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", null, [
                      createVNode("label", {
                        class: "block text-12 uppercase text-vidro",
                        for: "mp_access_token"
                      }, "Access Token"),
                      withDirectives(createVNode("input", {
                        id: "mp_access_token",
                        "onUpdate:modelValue": ($event) => unref(form).mp_access_token = $event,
                        type: "password",
                        autocomplete: "off",
                        placeholder: __props.mercadoPago.accessTokenConfigurado ? `Configurado (${__props.mercadoPago.accessTokenDica}) — deixe em branco para manter` : "Ainda não configurado",
                        class: "mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                      }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                        [vModelText, unref(form).mp_access_token]
                      ]),
                      unref(form).errors.mp_access_token ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-12 text-erro"
                      }, toDisplayString(unref(form).errors.mp_access_token), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", null, [
                      createVNode("label", {
                        class: "block text-12 uppercase text-vidro",
                        for: "mp_webhook_secret"
                      }, " Assinatura secreta do webhook "),
                      withDirectives(createVNode("input", {
                        id: "mp_webhook_secret",
                        "onUpdate:modelValue": ($event) => unref(form).mp_webhook_secret = $event,
                        type: "password",
                        autocomplete: "off",
                        placeholder: __props.mercadoPago.webhookSecretConfigurado ? `Configurado (${__props.mercadoPago.webhookSecretDica}) — deixe em branco para manter` : "Ainda não configurado",
                        class: "mt-1 w-full rounded border border-vidro/30 bg-tinta px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                      }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                        [vModelText, unref(form).mp_webhook_secret]
                      ]),
                      unref(form).errors.mp_webhook_secret ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-12 text-erro"
                      }, toDisplayString(unref(form).errors.mp_webhook_secret), 1)) : createCommentVNode("", true)
                    ])
                  ])
                ]),
                createVNode("div", { class: "flex items-center gap-3" }, [
                  createVNode("button", {
                    type: "submit",
                    disabled: unref(form).processing,
                    class: "rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-50"
                  }, " Salvar ", 8, ["disabled"]),
                  unref(form).recentlySuccessful ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "text-14 text-jade"
                  }, "Salvo.")) : createCommentVNode("", true)
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Settings/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
