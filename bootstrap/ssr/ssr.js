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
      /* @__PURE__ */ Object.assign({ "./Pages/Admin/Bets/Index.vue": () => import("./assets/Index-CvB1rhvz.js"), "./Pages/Admin/Dashboard.vue": () => import("./assets/Dashboard-Z2ch4_ko.js"), "./Pages/Admin/Rounds/Create.vue": () => import("./assets/Create-6RNBT39T.js"), "./Pages/Admin/Rounds/Index.vue": () => import("./assets/Index-Cmc2Wx9f.js"), "./Pages/Admin/Rounds/Relatorio.vue": () => import("./assets/Relatorio-BAfDJNTx.js"), "./Pages/Admin/Rounds/Show.vue": () => import("./assets/Show-D2QF_-v7.js"), "./Pages/Admin/Sellers/Form.vue": () => import("./assets/Form-CQg-vAPe.js"), "./Pages/Admin/Sellers/Index.vue": () => import("./assets/Index-C4FjdLV-.js"), "./Pages/Admin/Settings/Index.vue": () => import("./assets/Index-DPChGe89.js"), "./Pages/Admin/Users/Form.vue": () => import("./assets/Form-DbznVSqn.js"), "./Pages/Admin/Users/Index.vue": () => import("./assets/Index-BU-XbpT6.js"), "./Pages/Auth/ConfirmPassword.vue": () => import("./assets/ConfirmPassword-CcDrr5l8.js"), "./Pages/Auth/Login.vue": () => import("./assets/Login-DlUAxFDi.js"), "./Pages/Auth/TwoFactorChallenge.vue": () => import("./assets/TwoFactorChallenge-3Tp3NUYt.js"), "./Pages/Auth/TwoFactorSetup.vue": () => import("./assets/TwoFactorSetup-D3e5P1TS.js"), "./Pages/Public/ApostadorLogin.vue": () => import("./assets/ApostadorLogin-DkYhScgu.js"), "./Pages/Public/ApostadorPortal.vue": () => import("./assets/ApostadorPortal-Cbty0Fvf.js"), "./Pages/Public/Apostar.vue": () => import("./assets/Apostar-BLcr7CUS.js"), "./Pages/Public/Checkout.vue": () => import("./assets/Checkout-CIBWaHK2.js"), "./Pages/Public/Home.vue": () => import("./assets/Home-22Cqk8Us.js"), "./Pages/Public/MinhasCartelas.vue": () => import("./assets/MinhasCartelas-3sceyDq0.js"), "./Pages/Public/Regulamento.vue": () => import("./assets/Regulamento-BQrfDr78.js"), "./Pages/Public/VendedorLogin.vue": () => import("./assets/VendedorLogin-BALGUuC8.js"), "./Pages/Public/VendedorPainel.vue": () => import("./assets/VendedorPainel-rR4BhI_o.js") })
    ),
    setup({ App, props, plugin }) {
      return createSSRApp({ render: () => h(App, props) }).use(plugin);
    }
  })
);
