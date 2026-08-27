import { defineComponent, computed, unref, withCtx, createVNode, withModifiers, withDirectives, vModelText, openBlock, createBlock, toDisplayString, createCommentVNode, vModelSelect, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { useForm, Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AdminLayout-DY_Q8-70.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Create",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      name: "",
      starts_on: "",
      bets_close_at: "",
      bet_amount_cents: 2e3,
      pct_main: 70,
      pct_second: 15,
      pct_admin: 15,
      max_draws: 0,
      max_bets_per_person: 5,
      min_paid_bets: 10,
      no_winner_policy: "highest_score",
      rollover_in_cents: 0,
      whatsapp_group_url: ""
    });
    const somaPercentuais = computed(
      () => Number(form.pct_main) + Number(form.pct_second) + Number(form.pct_admin)
    );
    function salvar() {
      form.post("/admin/rodadas");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Criar rodada" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h1 class="font-display text-28 font-black uppercase tracking-tight"${_scopeId}>Criar rodada</h1><form class="mt-6 max-w-2xl space-y-4"${_scopeId}><div${_scopeId}><label class="block text-14 text-vidro" for="name"${_scopeId}>Nome</label><input id="name"${ssrRenderAttr("value", unref(form).name)} type="text" required placeholder="Bolão de Agosto" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-16 focus:border-aceso focus:outline-none"${_scopeId}>`);
            if (unref(form).errors.name) {
              _push2(`<p class="mt-1 text-12 text-erro"${_scopeId}>${ssrInterpolate(unref(form).errors.name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="grid grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-14 text-vidro" for="starts_on"${_scopeId}>Data do primeiro sorteio</label><input id="starts_on"${ssrRenderAttr("value", unref(form).starts_on)} type="date" required class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-16 focus:border-aceso focus:outline-none"${_scopeId}>`);
            if (unref(form).errors.starts_on) {
              _push2(`<p class="mt-1 text-12 text-erro"${_scopeId}>${ssrInterpolate(unref(form).errors.starts_on)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-14 text-vidro" for="bets_close_at"${_scopeId}>Apostas até (opcional)</label><input id="bets_close_at"${ssrRenderAttr("value", unref(form).bets_close_at)} type="datetime-local" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-16 focus:border-aceso focus:outline-none"${_scopeId}><p class="mt-1 text-12 text-vidro"${_scopeId}>Vazio = 23:59:59 do dia anterior ao início</p></div></div><div class="grid grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-14 text-vidro" for="bet_amount_cents"${_scopeId}>Valor da aposta (centavos)</label><input id="bet_amount_cents"${ssrRenderAttr("value", unref(form).bet_amount_cents)} type="number" min="100" step="1" required class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"${_scopeId}><p class="mt-1 text-12 text-vidro"${_scopeId}>2000 = R$ 20,00</p>`);
            if (unref(form).errors.bet_amount_cents) {
              _push2(`<p class="mt-1 text-12 text-erro"${_scopeId}>${ssrInterpolate(unref(form).errors.bet_amount_cents)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-14 text-vidro" for="rollover_in_cents"${_scopeId}>Valor herdado (centavos)</label><input id="rollover_in_cents"${ssrRenderAttr("value", unref(form).rollover_in_cents)} type="number" min="0" step="1" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"${_scopeId}></div></div><fieldset class="rounded border border-vidro/20 p-4"${_scopeId}><legend class="px-1 text-14 text-vidro"${_scopeId}>Divisão do pote (%)</legend><div class="grid grid-cols-3 gap-4"${_scopeId}><div${_scopeId}><label class="block text-14 text-vidro" for="pct_main"${_scopeId}>10 pontos</label><input id="pct_main"${ssrRenderAttr("value", unref(form).pct_main)} type="number" min="0" max="100" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"${_scopeId}></div><div${_scopeId}><label class="block text-14 text-vidro" for="pct_second"${_scopeId}>2º lugar</label><input id="pct_second"${ssrRenderAttr("value", unref(form).pct_second)} type="number" min="0" max="100" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"${_scopeId}></div><div${_scopeId}><label class="block text-14 text-vidro" for="pct_admin"${_scopeId}>Administração</label><input id="pct_admin"${ssrRenderAttr("value", unref(form).pct_admin)} type="number" min="0" max="100" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"${_scopeId}></div></div><p class="${ssrRenderClass([somaPercentuais.value === 100 ? "text-jade" : "text-erro", "mt-2 text-14"])}"${_scopeId}> Soma: ${ssrInterpolate(somaPercentuais.value)}%${ssrInterpolate(somaPercentuais.value === 100 ? "" : " — ajuste para 100%")}</p>`);
            if (unref(form).errors.pct_main) {
              _push2(`<p class="mt-1 text-12 text-erro"${_scopeId}>${ssrInterpolate(unref(form).errors.pct_main)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</fieldset><div class="grid grid-cols-3 gap-4"${_scopeId}><div${_scopeId}><label class="block text-14 text-vidro" for="max_draws"${_scopeId}>Limite de sorteios</label><input id="max_draws"${ssrRenderAttr("value", unref(form).max_draws)} type="number" min="0" max="99" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"${_scopeId}><p class="mt-1 text-12 text-vidro"${_scopeId}>0 = sem limite: joga até alguém ganhar</p></div><div${_scopeId}><label class="block text-14 text-vidro" for="max_bets_per_person"${_scopeId}>Cartelas por pessoa</label><input id="max_bets_per_person"${ssrRenderAttr("value", unref(form).max_bets_per_person)} type="number" min="0" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"${_scopeId}></div><div${_scopeId}><label class="block text-14 text-vidro" for="min_paid_bets"${_scopeId}>Mínimo de pagas</label><input id="min_paid_bets"${ssrRenderAttr("value", unref(form).min_paid_bets)} type="number" min="0" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"${_scopeId}></div></div><div${_scopeId}><label class="block text-14 text-vidro" for="whatsapp_group_url"${_scopeId}>Link do grupo do WhatsApp (opcional)</label><input id="whatsapp_group_url"${ssrRenderAttr("value", unref(form).whatsapp_group_url)} type="url" placeholder="https://chat.whatsapp.com/..." class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-16 focus:border-aceso focus:outline-none"${_scopeId}><p class="mt-1 text-12 text-vidro"${_scopeId}>Aparece como botão na página de acompanhamento.</p>`);
            if (unref(form).errors.whatsapp_group_url) {
              _push2(`<p class="mt-1 text-12 text-erro"${_scopeId}>${ssrInterpolate(unref(form).errors.whatsapp_group_url)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (unref(form).max_draws > 0) {
              _push2(`<div${_scopeId}><label class="block text-14 text-vidro" for="no_winner_policy"${_scopeId}>Se ninguém fechar 10 pontos até o limite</label><select id="no_winner_policy" class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-16 focus:border-aceso focus:outline-none"${_scopeId}><option value="highest_score"${ssrIncludeBooleanAttr(Array.isArray(unref(form).no_winner_policy) ? ssrLooseContain(unref(form).no_winner_policy, "highest_score") : ssrLooseEqual(unref(form).no_winner_policy, "highest_score")) ? " selected" : ""}${_scopeId}>Paga a maior pontuação</option><option value="rollover"${ssrIncludeBooleanAttr(Array.isArray(unref(form).no_winner_policy) ? ssrLooseContain(unref(form).no_winner_policy, "rollover") : ssrLooseEqual(unref(form).no_winner_policy, "rollover")) ? " selected" : ""}${_scopeId}>Acumula para a próxima rodada</option></select></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="rounded bg-aceso px-6 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-60"${_scopeId}> Criar rodada </button></form>`);
          } else {
            return [
              createVNode("h1", { class: "font-display text-28 font-black uppercase tracking-tight" }, "Criar rodada"),
              createVNode("form", {
                class: "mt-6 max-w-2xl space-y-4",
                onSubmit: withModifiers(salvar, ["prevent"])
              }, [
                createVNode("div", null, [
                  createVNode("label", {
                    class: "block text-14 text-vidro",
                    for: "name"
                  }, "Nome"),
                  withDirectives(createVNode("input", {
                    id: "name",
                    "onUpdate:modelValue": ($event) => unref(form).name = $event,
                    type: "text",
                    required: "",
                    placeholder: "Bolão de Agosto",
                    class: "mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-16 focus:border-aceso focus:outline-none"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).name]
                  ]),
                  unref(form).errors.name ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "mt-1 text-12 text-erro"
                  }, toDisplayString(unref(form).errors.name), 1)) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                  createVNode("div", null, [
                    createVNode("label", {
                      class: "block text-14 text-vidro",
                      for: "starts_on"
                    }, "Data do primeiro sorteio"),
                    withDirectives(createVNode("input", {
                      id: "starts_on",
                      "onUpdate:modelValue": ($event) => unref(form).starts_on = $event,
                      type: "date",
                      required: "",
                      class: "mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-16 focus:border-aceso focus:outline-none"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).starts_on]
                    ]),
                    unref(form).errors.starts_on ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "mt-1 text-12 text-erro"
                    }, toDisplayString(unref(form).errors.starts_on), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", {
                      class: "block text-14 text-vidro",
                      for: "bets_close_at"
                    }, "Apostas até (opcional)"),
                    withDirectives(createVNode("input", {
                      id: "bets_close_at",
                      "onUpdate:modelValue": ($event) => unref(form).bets_close_at = $event,
                      type: "datetime-local",
                      class: "mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-16 focus:border-aceso focus:outline-none"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).bets_close_at]
                    ]),
                    createVNode("p", { class: "mt-1 text-12 text-vidro" }, "Vazio = 23:59:59 do dia anterior ao início")
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                  createVNode("div", null, [
                    createVNode("label", {
                      class: "block text-14 text-vidro",
                      for: "bet_amount_cents"
                    }, "Valor da aposta (centavos)"),
                    withDirectives(createVNode("input", {
                      id: "bet_amount_cents",
                      "onUpdate:modelValue": ($event) => unref(form).bet_amount_cents = $event,
                      type: "number",
                      min: "100",
                      step: "1",
                      required: "",
                      class: "mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [
                        vModelText,
                        unref(form).bet_amount_cents,
                        void 0,
                        { number: true }
                      ]
                    ]),
                    createVNode("p", { class: "mt-1 text-12 text-vidro" }, "2000 = R$ 20,00"),
                    unref(form).errors.bet_amount_cents ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "mt-1 text-12 text-erro"
                    }, toDisplayString(unref(form).errors.bet_amount_cents), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", {
                      class: "block text-14 text-vidro",
                      for: "rollover_in_cents"
                    }, "Valor herdado (centavos)"),
                    withDirectives(createVNode("input", {
                      id: "rollover_in_cents",
                      "onUpdate:modelValue": ($event) => unref(form).rollover_in_cents = $event,
                      type: "number",
                      min: "0",
                      step: "1",
                      class: "mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [
                        vModelText,
                        unref(form).rollover_in_cents,
                        void 0,
                        { number: true }
                      ]
                    ])
                  ])
                ]),
                createVNode("fieldset", { class: "rounded border border-vidro/20 p-4" }, [
                  createVNode("legend", { class: "px-1 text-14 text-vidro" }, "Divisão do pote (%)"),
                  createVNode("div", { class: "grid grid-cols-3 gap-4" }, [
                    createVNode("div", null, [
                      createVNode("label", {
                        class: "block text-14 text-vidro",
                        for: "pct_main"
                      }, "10 pontos"),
                      withDirectives(createVNode("input", {
                        id: "pct_main",
                        "onUpdate:modelValue": ($event) => unref(form).pct_main = $event,
                        type: "number",
                        min: "0",
                        max: "100",
                        class: "mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [
                          vModelText,
                          unref(form).pct_main,
                          void 0,
                          { number: true }
                        ]
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", {
                        class: "block text-14 text-vidro",
                        for: "pct_second"
                      }, "2º lugar"),
                      withDirectives(createVNode("input", {
                        id: "pct_second",
                        "onUpdate:modelValue": ($event) => unref(form).pct_second = $event,
                        type: "number",
                        min: "0",
                        max: "100",
                        class: "mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [
                          vModelText,
                          unref(form).pct_second,
                          void 0,
                          { number: true }
                        ]
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", {
                        class: "block text-14 text-vidro",
                        for: "pct_admin"
                      }, "Administração"),
                      withDirectives(createVNode("input", {
                        id: "pct_admin",
                        "onUpdate:modelValue": ($event) => unref(form).pct_admin = $event,
                        type: "number",
                        min: "0",
                        max: "100",
                        class: "mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [
                          vModelText,
                          unref(form).pct_admin,
                          void 0,
                          { number: true }
                        ]
                      ])
                    ])
                  ]),
                  createVNode("p", {
                    class: ["mt-2 text-14", somaPercentuais.value === 100 ? "text-jade" : "text-erro"]
                  }, " Soma: " + toDisplayString(somaPercentuais.value) + "%" + toDisplayString(somaPercentuais.value === 100 ? "" : " — ajuste para 100%"), 3),
                  unref(form).errors.pct_main ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "mt-1 text-12 text-erro"
                  }, toDisplayString(unref(form).errors.pct_main), 1)) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "grid grid-cols-3 gap-4" }, [
                  createVNode("div", null, [
                    createVNode("label", {
                      class: "block text-14 text-vidro",
                      for: "max_draws"
                    }, "Limite de sorteios"),
                    withDirectives(createVNode("input", {
                      id: "max_draws",
                      "onUpdate:modelValue": ($event) => unref(form).max_draws = $event,
                      type: "number",
                      min: "0",
                      max: "99",
                      class: "mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [
                        vModelText,
                        unref(form).max_draws,
                        void 0,
                        { number: true }
                      ]
                    ]),
                    createVNode("p", { class: "mt-1 text-12 text-vidro" }, "0 = sem limite: joga até alguém ganhar")
                  ]),
                  createVNode("div", null, [
                    createVNode("label", {
                      class: "block text-14 text-vidro",
                      for: "max_bets_per_person"
                    }, "Cartelas por pessoa"),
                    withDirectives(createVNode("input", {
                      id: "max_bets_per_person",
                      "onUpdate:modelValue": ($event) => unref(form).max_bets_per_person = $event,
                      type: "number",
                      min: "0",
                      class: "mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [
                        vModelText,
                        unref(form).max_bets_per_person,
                        void 0,
                        { number: true }
                      ]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", {
                      class: "block text-14 text-vidro",
                      for: "min_paid_bets"
                    }, "Mínimo de pagas"),
                    withDirectives(createVNode("input", {
                      id: "min_paid_bets",
                      "onUpdate:modelValue": ($event) => unref(form).min_paid_bets = $event,
                      type: "number",
                      min: "0",
                      class: "mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-16 font-tabular focus:border-aceso focus:outline-none"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [
                        vModelText,
                        unref(form).min_paid_bets,
                        void 0,
                        { number: true }
                      ]
                    ])
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("label", {
                    class: "block text-14 text-vidro",
                    for: "whatsapp_group_url"
                  }, "Link do grupo do WhatsApp (opcional)"),
                  withDirectives(createVNode("input", {
                    id: "whatsapp_group_url",
                    "onUpdate:modelValue": ($event) => unref(form).whatsapp_group_url = $event,
                    type: "url",
                    placeholder: "https://chat.whatsapp.com/...",
                    class: "mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-16 focus:border-aceso focus:outline-none"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).whatsapp_group_url]
                  ]),
                  createVNode("p", { class: "mt-1 text-12 text-vidro" }, "Aparece como botão na página de acompanhamento."),
                  unref(form).errors.whatsapp_group_url ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "mt-1 text-12 text-erro"
                  }, toDisplayString(unref(form).errors.whatsapp_group_url), 1)) : createCommentVNode("", true)
                ]),
                unref(form).max_draws > 0 ? (openBlock(), createBlock("div", { key: 0 }, [
                  createVNode("label", {
                    class: "block text-14 text-vidro",
                    for: "no_winner_policy"
                  }, "Se ninguém fechar 10 pontos até o limite"),
                  withDirectives(createVNode("select", {
                    id: "no_winner_policy",
                    "onUpdate:modelValue": ($event) => unref(form).no_winner_policy = $event,
                    class: "mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-16 focus:border-aceso focus:outline-none"
                  }, [
                    createVNode("option", { value: "highest_score" }, "Paga a maior pontuação"),
                    createVNode("option", { value: "rollover" }, "Acumula para a próxima rodada")
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, unref(form).no_winner_policy]
                  ])
                ])) : createCommentVNode("", true),
                createVNode("button", {
                  type: "submit",
                  disabled: unref(form).processing,
                  class: "rounded bg-aceso px-6 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-60"
                }, " Criar rodada ", 8, ["disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Rounds/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
