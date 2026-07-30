import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { createInertiaApp } from "@inertiajs/vue3";
import createServer from "@inertiajs/vue3/server";
async function resolvePageComponent(path, pages) {
  for (const p of Array.isArray(path) ? path : [path]) {
    const page = pages[p];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
createServer(
  (page) => createInertiaApp({
    page,
    render: renderToString,
    title: (title) => title ? `${title} — Bolão Dez` : "Bolão Dez",
    resolve: (name) => resolvePageComponent(
      `./Pages/${name}.vue`,
      /* @__PURE__ */ Object.assign({ "./Pages/Admin/Bets/Index.vue": () => import("./assets/Index-CWausZyl.js"), "./Pages/Admin/Dashboard.vue": () => import("./assets/Dashboard-CeLB9d9h.js"), "./Pages/Admin/Rounds/Create.vue": () => import("./assets/Create-CJMuEVjR.js"), "./Pages/Admin/Rounds/Index.vue": () => import("./assets/Index-Cvmosh8L.js"), "./Pages/Admin/Rounds/Show.vue": () => import("./assets/Show-Brf9kMJs.js"), "./Pages/Auth/ConfirmPassword.vue": () => import("./assets/ConfirmPassword-CcDrr5l8.js"), "./Pages/Auth/Login.vue": () => import("./assets/Login-BkPfsp5R.js"), "./Pages/Auth/TwoFactorChallenge.vue": () => import("./assets/TwoFactorChallenge-3Tp3NUYt.js"), "./Pages/Auth/TwoFactorSetup.vue": () => import("./assets/TwoFactorSetup-D3e5P1TS.js"), "./Pages/Public/Apostar.vue": () => import("./assets/Apostar-DI7jgMv7.js"), "./Pages/Public/Checkout.vue": () => import("./assets/Checkout-C3yJYSQM.js"), "./Pages/Public/Home.vue": () => import("./assets/Home-Ce-fp-ua.js"), "./Pages/Public/MinhasCartelas.vue": () => import("./assets/MinhasCartelas-eWaRaJZc.js"), "./Pages/Public/Regulamento.vue": () => import("./assets/Regulamento-oncAux0K.js") })
    ),
    setup({ App, props, plugin }) {
      return createSSRApp({ render: () => h(App, props) }).use(plugin);
    }
  })
);
