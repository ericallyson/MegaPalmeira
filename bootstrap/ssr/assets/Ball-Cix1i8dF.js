import { defineComponent, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate } from "vue/server-renderer";
import { d as dezena } from "./format-BNqt_JV5.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Ball",
  __ssrInlineRender: true,
  props: {
    n: {},
    lit: { type: Boolean, default: false },
    size: { default: "md" },
    contest: { default: null },
    justLit: { type: Boolean, default: false },
    bloom: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const sizeClass = computed(
      () => ({
        hero: "h-12 w-12 text-16",
        md: "h-8 w-8 text-14",
        sm: "h-6 w-6 text-12"
      })[props.size]
    );
    const label = computed(
      () => props.lit ? `${props.n}, sorteado${props.contest ? ` no concurso ${props.contest}` : ""}` : `${props.n}, não sorteado`
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        role: "img",
        "aria-label": label.value,
        class: ["inline-flex items-center justify-center rounded-full font-mono font-tabular", [
          sizeClass.value,
          __props.lit ? "border border-aceso bg-aceso font-bold text-tinta shadow-[0_0_0_2px_rgba(255,194,75,0.55),0_0_16px_rgba(255,138,61,0.4)]" : "border border-vidro/30 bg-noite font-normal text-vidro",
          { "animar-anel": __props.justLit, "animar-bloom": __props.bloom }
        ]]
      }, _attrs))}>${ssrInterpolate(unref(dezena)(__props.n))}</span>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Ball.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
