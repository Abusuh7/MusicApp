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
                    <h6 class="text-gray-600 text-sm font-bold">Sign Up with</h6>
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
                    <small>Or sign up with credentials</small>
                  </div>

                  <!-- Display error message if any -->
                  <div v-if="errorMessage" class="text-red-500 text-center mb-4">
                    {{ errorMessage }}
                  </div>

                  <!-- Display success message -->
                  <div v-if="successMessage" class="text-green-500 text-center mb-4">
                    {{ successMessage }}
                  </div>

                  <form v-if="!confirmationRequired" @submit.prevent="submitForm">
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
                        for="email"
                        >Email</label
                      >
                      <input
                        type="email"
                        v-model="email"
                        class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        placeholder="Email"
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

                    <div class="text-center mt-6">
                      <button
                        class="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                        type="submit"
                        style="transition: all 0.15s ease 0s;"
                      >
                        Sign Up
                      </button>
                    </div>
                  </form>

                  <!-- Confirmation Code Form -->
                  <form v-else @submit.prevent="confirmSignUp1">
                    <div class="relative w-full mb-3">
                      <label
                        class="block uppercase text-gray-700 text-xs font-bold mb-2"
                        for="confirmationCode"
                        >Confirmation Code</label
                      >
                      <input
                        type="text"
                        v-model="confirmationCode"
                        class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        placeholder="Enter confirmation code"
                        required
                        style="transition: all 0.15s ease 0s;"
                      />
                    </div>

                    <div class="text-center mt-6">
                      <button
                        class="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                        type="submit"
                        style="transition: all 0.15s ease 0s;"
                      >
                        Confirm Code
                      </button>
                    </div>
                  </form>

                  <!-- Sign In Link -->
                  <div class="flex flex-wrap mt-6 text-center">
                    <div class="w-full">
                      <a
                        @click.prevent="toggleSignin"
                        href="#"
                        class="text-gray-600 hover:text-gray-900 font-bold transition-all duration-150 ease-in-out"
                        ><small>Already have an account? Sign In</small></a
                      >
                    </div>
                  </div>
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
import { signUp, confirmSignUp } from "aws-amplify/auth";
import { useRouter } from "vue-router";

const router = useRouter();

// Declare reactive variables
const username = ref("");
const email = ref("");
const password = ref("");
const confirmationCode = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const confirmationRequired = ref(false);

// Background image for different screen sizes
const backgroundImage = ref("");

const setBackgroundImage = () => {
  const screenWidth = window.innerWidth;
  if (screenWidth <= 640) {
    backgroundImage.value =
      "url(https://images.unsplash.com/photo-1692651763027-72aeb12130d7?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)";
  } else {
    backgroundImage.value =
      "url(https://images.unsplash.com/photo-1633704685725-4c225ff0bd8a?q=80&w=2529&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)";
  }
};

// Switch background images on mount and resize
onMounted(() => {
  setBackgroundImage();
  window.addEventListener("resize", setBackgroundImage);
});

// Toggle to Sign In page
const toggleSignin = () => {
  router.push("/signin");
};

// Submit sign up form
const submitForm = async () => {
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: username.value,
      password: password.value,
      options: {
        userAttributes: {
          email: email.value,
          "custom:role": "0", // Add custom attributes if needed
        },
      },
    });

    console.log("Sign up successful:", isSignUpComplete, userId, nextStep);
    confirmationRequired.value = true; // Switch to confirmation form
    successMessage.value = "Sign-up successful. Please enter the confirmation code sent to your email.";
  } catch (error) {
    errorMessage.value = "Error signing up: " + error.message;
    console.error("Error during sign up", error);
  }
};

// Confirm sign up with the code
const confirmSignUp1 = async () => {
  try {
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username: username.value,
      confirmationCode: confirmationCode.value,
    });

    console.log("Sign up confirmation successful:", isSignUpComplete, nextStep);
    successMessage.value = "Sign-up confirmed successfully!";
    router.push("/signin"); // Redirect to sign-in page after successful confirmation
  } catch (error) {
    errorMessage.value = "Error confirming code: " + error.message;
    console.error("Error during confirmation", error);
  }
};
</script>

<style scoped>
/* Add background image styling for small screens */
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

/* Additional success styling */
.text-green-500 {
  color: #48bb78;
}
</style>
