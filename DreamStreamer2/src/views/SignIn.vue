<template>
  <div>
    <main>
      <section class="absolute w-full h-full">
        <!-- Background div -->
        <div
          class="absolute top-0 w-full h-full bg-gray-900"
          style="background-size: cover; background-position: center;"
          :style="{
            'background-image': backgroundImage
          }"
        ></div>

        <!-- Form content -->
        <div class="container mx-auto px-4 h-full">
          <div class="flex content-center items-center justify-center h-full">
            <div class="w-full lg:w-4/12 px-4">
              <div
                class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 bg-opacity-80 border-0"
              >
                <div class="rounded-t mb-0 px-6 py-6">
                  <div class="text-center mb-3">
                    <h6 class="text-gray-600 text-sm font-bold">Sign in with</h6>
                  </div>
                  <div class="btn-wrapper text-center">
                    <button
                      class="bg-white active:bg-gray-100 text-gray-800 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs"
                      type="button"
                      style="transition: all 0.15s ease 0s;"
                    >
                      <img alt="..." class="w-5 mr-1" src="../assets/img/github.svg" />Github
                    </button>
                    <button
                      class="bg-white active:bg-gray-100 text-gray-800 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs"
                      type="button"
                      style="transition: all 0.15s ease 0s;"
                    >
                      <img alt="..." class="w-5 mr-1" src="../assets/img/google.svg" />Google
                    </button>
                  </div>
                  <hr class="mt-6 border-b-1 border-gray-400" />
                </div>
                <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <div class="text-gray-500 text-center mb-3 font-bold">
                    <small>Or sign in with credentials</small>
                  </div>

                  <!-- Display error message if any -->
                  <div v-if="errorMessage" class="text-red-500 text-center mb-4">
                    {{ errorMessage }}
                  </div>

                  <form @submit.prevent="submitForm">
                    <div class="relative w-full mb-3">
                      <label
                        class="block uppercase text-gray-700 text-xs font-bold mb-2"
                        for="username"
                        >Username</label
                      >
                      <input
                        type="text"
                        v-model="username"
                        class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        placeholder="Username"
                        required
                        style="transition: all 0.15s ease 0s;"
                      />
                    </div>
                    <div class="relative w-full mb-3">
                      <label
                        class="block uppercase text-gray-700 text-xs font-bold mb-2"
                        for="password"
                        >Password</label
                      >
                      <input
                        type="password"
                        v-model="password"
                        class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        placeholder="Password"
                        required
                        style="transition: all 0.15s ease 0s;"
                      />
                    </div>
                    <div>
                      <label class="inline-flex items-center cursor-pointer">
                        <input
                          id="customCheckLogin"
                          type="checkbox"
                          class="form-checkbox border-0 rounded text-gray-800 ml-1 w-5 h-5"
                          style="transition: all 0.15s ease 0s;"
                        />
                        <span class="ml-2 text-sm font-semibold text-gray-700"
                          >Remember me</span
                        >
                      </label>
                    </div>
                    <div class="text-center mt-6">
                      <button
                        class="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                        type="submit"
                        style="transition: all 0.15s ease 0s;"
                      >
                        Sign In
                      </button>
                    </div>
                    <!-- Forgot password and Sign up links -->
                    <div class="flex flex-wrap mt-6 text-center">
                      <div class="w-1/2">
                        <a href="#" class="text-gray-600 hover:text-gray-900 transition-all duration-150 ease-in-out"
                          ><small>Forgot password?</small></a
                        >
                      </div>
                      <div class="w-1/2">
                        <a
                          @click.prevent="toggleSignup"
                          href="#"
                          class="text-gray-600 hover:text-gray-900 font-bold transition-all duration-150 ease-in-out"
                          ><small>Create new account</small></a
                        >
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { signIn, fetchUserAttributes, getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const password = ref("");
const backgroundImage = ref("");
const errorMessage = ref("");

// Function to detect screen size and switch background images
const setBackgroundImage = () => {
  const screenWidth = window.innerWidth;
  if (screenWidth <= 640) {
    // Use portrait image for small screens
    backgroundImage.value =
      "url(https://images.unsplash.com/photo-1692651763027-72aeb12130d7?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)";
  } else {
    // Use landscape image for larger screens
    backgroundImage.value =
      "url(https://images.unsplash.com/photo-1633704685725-4c225ff0bd8a?q=80&w=2529&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)";
  }
};

onMounted(() => {
  setBackgroundImage();
  window.addEventListener("resize", setBackgroundImage);
});

const submitForm = async () => {
  try {
    await signIn({
      username: username.value,
      password: password.value,
    });
    console.log("User signed in");

    const user = await fetchUserAttributes();
    const authSession = await fetchAuthSession();
    console.log("User attributes:", user);
    console.log("Auth session:", authSession);

    // Navigate based on user role
    if (user["custom:role"] === "0") {
      router.push("/userhome");
    } else {
      router.push("/adminhome");
    }
  } catch (error) {
    errorMessage.value = "Sign-in failed. Please check your credentials.";
    console.error("Sign-in error:", error);
  }
};

// Navigate to signup page
const toggleSignup = () => {
  router.push("/signup");
};
</script>

<style scoped>
@media (max-width: 640px) {
  .bg-gray-900 {
    background-position: center top;
  }
}

.bg-opacity-80 {
  background-color: rgba(255, 255, 255, 0.8);
}

/* Styling for hover effects */
a {
  transition: color 0.15s ease-in-out;
}

/* Additional error styling */
.text-red-500 {
  color: #f56565;
}
</style>
