<script setup>
import { useSidebarStore } from '../../stores/sidebar'
import { ref } from 'vue'
import SidebarItem from './SidebarItem.vue'

const target = ref(null)

const sidebarStore = useSidebarStore()

const menuGroups = ref([
  {
    name: 'MENU',
    menuItems: [
      {
        icon: `<svg
                  class="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299Z"
                  />
                </svg>`,
        label: 'Dashboard',
        route: '#',
        children: [{ label: 'Analytics', route: '/adminhome/analytics' }]
      },
      {
        icon: `<svg
                  class="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299Z"
                  />
                </svg>`,
        label: 'Genre',
        route: '#',
        children: [{ label: 'Create Genre', route: '/adminhome/addgenre' }, { label: 'View Genres', route: '/adminhome/viewgenres' }]
      },
      {
        icon: `<svg
                  class="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299Z"
                  />
                </svg>`,
        label: 'Artist',
        route: '#',
        children: [{ label: 'Create Artist', route: '/adminhome/addartist' }, { label: 'View Aritists', route: '/adminhome/viewartists' }]
      },
      {
        icon: `<svg
                  class="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299Z"
                  />
                </svg>`,
        label: 'Tracks',
        route: '#',
        children: [{ label: 'Create Track', route: '/adminhome/addsongs' }, { label: 'View Tracks', route: '/adminhome/viewsongs' }]
      },
      {
        icon: `<svg
                  class="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299Z"
                  />
                </svg>`,
        label: 'Albums',
        route: '#',
        children: [{ label: 'Create Album', route: '/adminhome/addalbum' }, { label: 'View Albums', route: '/adminhome/viewalbums' }]
      },
      // {
      //   icon: `<svg
      //             class="fill-current"
      //             width="18"
      //             height="18"
      //             viewBox="0 0 18 18"
      //             xmlns="http://www.w3.org/2000/svg"
      //           >
      //             <path
      //               d="M15.75 0H2.25C1.01 0 0 1.01 0 2.25v13.5C0 16.99 1.01 18 2.25 18h13.5C16.99 18 18 16.99 18 15.75V2.25C18 1.01 16.99 0 15.75 0z"
      //             />
      //           </svg>`,
      //   label: 'Calendar',
      //   route: '/calendar'
      // }
    ]
  },
  // {
  //   name: 'OTHERS',
  //   menuItems: [
  //     {
  //       icon: `<svg
  //                 class="fill-current"
  //                 width="18"
  //                 height="18"
  //                 viewBox="0 0 18 18"
  //                 xmlns="http://www.w3.org/2000/svg"
  //               >
  //                 <path
  //                   d="M12.5 0H5.5A5.5 5.5 0 000 5.5v7A5.5 5.5 0 005.5 18h7a5.5 5.5 0 005.5-5.5v-7A5.5 5.5 0 0012.5 0z"
  //                 />
  //               </svg>`,
  //       label: 'Profile',
  //       route: '/profile'
  //     }
  //   ]
  // }
])
</script>

<template>
  <aside
    class="absolute left-0 top-0 z-50 flex h-screen w-72.5 flex-col overflow-y-hidden bg-gray-800 duration-300 ease-linear lg:static lg:translate-x-0"
    :class="{
      'translate-x-0': sidebarStore.isSidebarOpen,
      '-translate-x-full': !sidebarStore.isSidebarOpen
    }"
    ref="target"
  >
    <!-- SIDEBAR HEADER -->
    <div class="flex items-center justify-between gap-2 px-6 py-5 bg-gray-900">
      <router-link to="/" class="text-white font-bold text-lg">
        DreamStreamer Admin
      </router-link>

      <button class="block lg:hidden" @click="sidebarStore.isSidebarOpen = false">
        <svg
          class="fill-current text-white"
          width="20"
          height="20"
          viewBox="0 0 20 18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
    <!-- SIDEBAR HEADER -->

    <!-- Sidebar Menu -->
    <div class="flex flex-col overflow-y-auto py-4 bg-gray-800 text-white">
      <nav>
        <template v-for="menuGroup in menuGroups" :key="menuGroup.name">
          <div class="mb-6 px-4">
            <h3 class="text-sm font-medium text-gray-400">{{ menuGroup.name }}</h3>
            <ul class="mt-2 space-y-2">
              <SidebarItem
                v-for="(menuItem, index) in menuGroup.menuItems"
                :item="menuItem"
                :key="index"
                :index="index"
              />
            </ul>
          </div>
        </template>
      </nav>
    </div>

    <!-- Promo Box -->
    <!-- <div class="mx-4 my-6 p-4 bg-indigo-500 rounded-md text-center shadow-md text-white">
      <h3 class="mb-2 font-semibold">Get TailAdmin Pro</h3>
      <p class="text-xs mb-3">Unlock premium features and elements.</p>
      <a
        href="https://tailadmin.com/pricing"
        target="_blank"
        class="block px-4 py-2 bg-white text-indigo-500 rounded-md font-medium hover:bg-gray-100"
      >
        Purchase Now
      </a>
    </div> -->
    <!-- Promo Box -->
  </aside>
</template>

<style scoped>
/* Scrollbar hidden on smaller screens */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
