import { createRouter, createWebHistory } from "vue-router";
import LandingView from "../views/Landing.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing",
      component: LandingView,
    },
    {
      path: "/signin",
      name: "signin",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../components/SignIn.vue"),
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("../components/SignUp.vue"),
    }

  ],
});

export default router;
