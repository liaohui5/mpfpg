import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/prompt",
    },
    {
      path: "/prompt",
      name: "PromptGenerate",
      component: () => import("@/pages/PromptGeneratePage.vue"),
    },
    {
      path: "/config",
      name: "Config",
      component: () => import("@/pages/ConfigPage.vue"),
    },
  ],
});

export default router;
