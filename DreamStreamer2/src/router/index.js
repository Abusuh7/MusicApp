import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "../views/HomeView.vue";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth"
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
      component: () => import("../layouts/UserHomePageTest.vue"),
      meta: { requiresAuth: true, role: 'user' }, // Requires user role
      children: [
        {
          path: "",
          name: "userhomehome",
          component: () => import("../views/user/UserHome.vue"),
        },
        {
          path: "/library",
          name: "userlibrary",
          component: () => import("../views/user/Library.vue"),
        },
        {
          path: "/albumdetails/:albumId",
          name: "albumdetails",
          component: () => import("../views/user/AlbumDetails.vue"),
        },
        {
          path: "/moresongs",
          name: "moresongs",
          component: () => import("../views/user/MoreSongs.vue"),
        },
        {
          path: "/morealbums",
          name: "morealbums",
          component: () => import("../views/user/MoreAlbums.vue"),
        },
        {
          path: "/perosnalalbumdetails/:albumId",
          name: "personalalbumdetails",
          component: () => import("../views/user/PersonalAlbumDetails.vue"),
        },
      ],
    },
    
    
   
    {
      path: "/adminhome",
      name: "analytics",
      component: () => import("../views/admin/Analytics.vue"),
      meta: { requiresAuth: true, role: 'admin' }, // Requires admin role
    },
    {
      path: "/adminhome/addartist",
      name: "addartist",
      component: () => import("../views/admin/AddArtist.vue"),
      meta: { requiresAuth: true, role: 'admin' }, // Requires admin role
    },
    {
      path: "/adminhome/viewartists",
      name: "viewartists",
      component: () => import("../views/admin/ViewAllArtist.vue"),
      meta: { requiresAuth: true, role: 'admin' }, // Requires admin role
    },
    {
      path: "/adminhome/addgenre",
      name: "addgenre",
      component: () => import("../views/admin/AddGenre.vue"),
      meta: { requiresAuth: true, role: 'admin' }, // Requires admin role
    },
    {
      path: "/adminhome/viewgenres",
      name: "viewgenres",
      component: () => import("../views/admin/ViewAllGenre.vue"),
      meta: { requiresAuth: true, role: 'admin' }, // Requires admin role
    },
    {
      path: "/adminhome/addsongs",
      name: "addsongs",
      component: () => import("../views/admin/AddSong.vue"),
      meta: { requiresAuth: true, role: 'admin' }, // Requires admin role
    },
    {
      path: "/adminhome/viewsongs",
      name: "viewsongs",
      component: () => import("../views/admin/ViewAllSongs.vue"),
      meta: { requiresAuth: true, role: 'admin' }, // Requires admin role
    },
    {
      path: "/adminhome/addalbum",
      name: "addalbum",
      component: () => import("../views/admin/AddAlbum.vue"),
      meta: { requiresAuth: true, role: 'admin' }, // Requires admin role
    },
    {
      path: "/adminhome/viewalbums",
      name: "viewalbums",
      component: () => import("../views/admin/ViewAllAlbum.vue"),
      meta: { requiresAuth: true, role: 'admin' }, // Requires admin role
    }
  ],
});

// Add route guard to check for authentication and role-based access
router.beforeEach(async (to, from, next) => {
  const publicPages = ['signin', 'signup', 'home']; // List of public routes
  const authRequired = to.matched.some(record => record.meta.requiresAuth); // Check if route requires authentication
  let authenticated = false;
  let userRole = null;

  try {
    // Check if the user is authenticated
    const user = await getCurrentUser();
    authenticated = true;

    // Fetch user's custom:role from their attributes
    const attributes = await fetchUserAttributes();
    userRole = attributes["custom:role"];

    console.log('User is authenticated with role:', userRole);
  } catch (error) {
    // User is not authenticated
    authenticated = false;
    console.log('User is not authenticated');
  }

  if (authRequired && !authenticated) {
    // Redirect to login page if trying to access a protected route without being authenticated
    next({ name: 'signin' });
  } else if (authRequired && authenticated) {
    const requiredRole = to.meta.role;

    // Check if the user has access to the route based on their role
    if (
      (requiredRole === 'admin' && userRole !== '1') || // Admin role check
      (requiredRole === 'user' && userRole !== '0') // User role check
    ) {
      // Redirect if the user doesn't have the appropriate role
      next({ name: 'signin' });
    } else {
      next(); // User has the correct role, allow access
    }
  } else {
    next(); // Public route, no authentication required
  }
});

export default router;
