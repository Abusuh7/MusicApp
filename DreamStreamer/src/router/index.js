import { createRouter, createWebHistory } from "vue-router";
import LandingView from "../views/Landing.vue";
import UserDashboard from "../views/UserDashboard.vue";
import AdminDashboard from "../views/AdminDashboard.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
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
      path: "/user-dashboard",
      name: "UserDashboard",
      component: UserDashboard,
    },
    {
      path: "/admin-dashboard",
      name: "AdminDashboard",
      component: AdminDashboard,
    },
  ],
});

export default router;
