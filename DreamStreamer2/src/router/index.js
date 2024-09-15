import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "../views/HomeView.vue";
import { fetchUserAttributes } from "aws-amplify/auth"
// authenticated users can access this route

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: LandingPage,
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("../views/SignUp.vue"),
    },
    {
      path: "/signin",
      name: "signin",
      component: () => import("../views/SignIn.vue"),
    },
    {
      path: "/userhome",
      name: "userhome",
      component: () => import("../views/user/UserHome.vue"),
    },

    {
      path: "/adminhome",
      name: "adminhome",
      component: () => import("../views/admin/AdminHome.vue"),
    },
    {
      path: "/adminhome/addartist",
      name: "addartist",
      component: () => import("../views/admin/AddArtist.vue"),
    },
    {
      path: "/adminhome/viewartists",
      name: "viewartists",
      component: () => import("../views/admin/ViewAllArtist.vue"),
    },
    {
      path: "/adminhome/addgenre",
      name: "addgenre",
      component: () => import("../views/admin/AddGenre.vue"),
    },
    {
      path: "/adminhome/viewgenres",
      name: "viewgenres",
      component: () => import("../views/admin/ViewAllGenre.vue"),
    },
    {
      path: "/adminhome/addsongs",
      name: "addsongs",
      component: () => import("../views/admin/AddSong.vue"),
    },
    {
      path: "/adminhome/viewsongs",
      name: "viewsongs",
      component: () => import("../views/admin/ViewAllSongs.vue"),
    }
    
  ],
});

router.beforeEach((to, from, next) => {
  if (to.name !== 'signin' && to.name !== 'signup' && to.name !== 'home') {
    fetchUserAttributes().then((user) => {
      if (user) {
        next();
      } else {
        router.push("/signin");
        console.log("User not signed in");
      }
    });
  } else {
    next();
  }
}
);

export default router;
