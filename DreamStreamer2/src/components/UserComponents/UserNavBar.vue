<template>
  <header class="bg-gray-800">
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1">
        <a
          class="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
          href="https://www.creative-tim.com/learning-lab/tailwind-starter-kit#/presentation"
        >
          DreamStreamer
        </a>
      </div>
      <div class="flex lg:hidden">
        <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200" @click="mobileMenuOpen = true">
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <PopoverGroup class="hidden lg:flex lg:gap-x-12">
        <a href="/userhome" class="text-sm font-semibold leading-6 text-gray-200">Home</a>
        <a href="/moresongs" class="text-sm font-semibold leading-6 text-gray-200">Browse</a>
        <a href="/library" class="text-sm font-semibold leading-6 text-gray-200">Library</a>
      </PopoverGroup>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <button @click="toggleSignOut" class="signout-btn flex items-center">
          <i class="fa-solid fa-user" style="color: #ffffff;"></i>
          <span>SignOut</span>
        </button>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <Dialog class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-10" />
      <DialogPanel class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div class="flex items-center justify-between">
          <a
            class="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
            href="https://www.creative-tim.com/learning-lab/tailwind-starter-kit#/presentation"
          >
            DreamStreamer
          </a>
          <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
            <span class="sr-only">Close menu</span>
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <a href="/userhome" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Home</a>
              <a href="/moresongs" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Browse</a>
              <a href="/library" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Library</a>
            </div>
            <div class="py-6">
              <button @click="toggleSignOut" class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Sign Out</button>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signOut } from 'aws-amplify/auth';
import { ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const toggleSignOut = () => {
  signOut();
  router.push('/');
};
const mobileMenuOpen = ref(false);
</script>

<style scoped>
.signout-btn {
  background-color: #314157;
  color: white;
  padding: 6px 10px;
  border-radius: 20px;
  transition: background-color 0.3s ease;
  font-weight: 600;
}

.signout-btn:hover {
  background-color: #1f2937;
}

.signout-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.signout-btn span {
  font-size: 1rem;
  margin-left: 10px;
}
</style>
