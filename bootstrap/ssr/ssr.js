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
    title: (title) => title ? `${title} — MegaPalmeira` : "MegaPalmeira",
    resolve: (name) => resolvePageComponent(
      `./Pages/${name}.vue`,
      /* @__PURE__ */ Object.assign({ "./Pages/Admin/Bets/Index.vue": () => import("./assets/Index-UhNHMSrz.js"), "./Pages/Admin/Dashboard.vue": () => import("./assets/Dashboard-Cq7V9h0B.js"), "./Pages/Admin/Rounds/Create.vue": () => import("./assets/Create-B4eQKLBY.js"), "./Pages/Admin/Rounds/Index.vue": () => import("./assets/Index-C0vckBSJ.js"), "./Pages/Admin/Rounds/Relatorio.vue": () => import("./assets/Relatorio-DM5a9_X5.js"), "./Pages/Admin/Rounds/Show.vue": () => import("./assets/Show-C_Cp-R58.js"), "./Pages/Admin/Settings/Index.vue": () => import("./assets/Index-BRFewItr.js"), "./Pages/Admin/Users/Form.vue": () => import("./assets/Form-4JhdjdDH.js"), "./Pages/Admin/Users/Index.vue": () => import("./assets/Index-CUyR1e6t.js"), "./Pages/Auth/ConfirmPassword.vue": () => import("./assets/ConfirmPassword-CcDrr5l8.js"), "./Pages/Auth/Login.vue": () => import("./assets/Login-DIzok755.js"), "./Pages/Auth/TwoFactorChallenge.vue": () => import("./assets/TwoFactorChallenge-3Tp3NUYt.js"), "./Pages/Auth/TwoFactorSetup.vue": () => import("./assets/TwoFactorSetup-D3e5P1TS.js"), "./Pages/Public/Apostar.vue": () => import("./assets/Apostar-CObQN9Mx.js"), "./Pages/Public/Checkout.vue": () => import("./assets/Checkout-DFHxxqCp.js"), "./Pages/Public/Home.vue": () => import("./assets/Home-CoHjNF1R.js"), "./Pages/Public/MinhasCartelas.vue": () => import("./assets/MinhasCartelas-Dryn-w4R.js"), "./Pages/Public/Regulamento.vue": () => import("./assets/Regulamento-BQrfDr78.js") })
    ),
    setup({ App, props, plugin }) {
      return createSSRApp({ render: () => h(App, props) }).use(plugin);
    }
  })
);
