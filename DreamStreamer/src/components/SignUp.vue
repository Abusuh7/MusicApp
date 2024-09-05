<script setup>
import { RouterLink } from "vue-router";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { Amplify } from "aws-amplify";
import awsconfig from "../aws-exports";
import { signUp } from "aws-amplify/auth";





const router = useRouter();


const toggleSignin = () => {
  router.push({ name: "signin" });
};

// await signUp({
//     username: "testuser",
//     password: "testpassword",
//     options: {
//         userAttributes: {
//             email: "abc@gmail.com",
//             'custom:role': 0,
//         }
//     }   
// })

const email = ref('');
const username = ref('');
const password = ref('');


const signUpUser = async () => {
  try {
    await signUp({
      username: username.value,
      password: password.value,
      options: {
        userAttributes: {
          email: email.value,
            'custom:role': 0,
        }
        }
    })
    } catch (error) {
        console.log('error signing up:', error);
        }
    }

    Amplify.configure(awsconfig);
</script>

<template>
  <div class="auth-container">
    <main>
      <section class="absolute w-full h-full">
        <!-- Background -->
        <div
          class="absolute top-0 w-full h-full bg-gray-900"
          style="background-size: 100%; background-repeat: no-repeat;"
          :style="{ backgroundImage: 'url(https://images.unsplash.com/photo-1420161900862-9a86fa1f5c79?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)' }"
        ></div>
        <!-- Form Container -->
        <div class="container mx-auto px-4 h-full">
          <div class="flex content-center items-center justify-center h-full">
            <div class="w-full lg:w-4/12 px-4">
              <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0">
                <div class="rounded-t mb-0 px-6 py-6">
                  <!-- Sign In With Socials -->
                  <div class="text-center mb-3">
                    <h6 class="text-gray-600 text-sm font-bold">Sign Up with</h6>
                  </div>
                  <div class="btn-wrapper text-center">
                    <!-- Github -->
                    <button
                      class="bg-white active:bg-gray-100 text-gray-800 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs"
                      type="button"
                      style="transition: all 0.15s ease 0s;"
                    >
                      <img alt="GitHub" class="w-5 mr-1" src="../assets/img/github.svg" /> Github
                    </button>
                    <!-- Google -->
                    <button
                      class="bg-white active:bg-gray-100 text-gray-800 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs"
                      type="button"
                      style="transition: all 0.15s ease 0s;"
                    >
                      <img alt="Google" class="w-5 mr-1" src="../assets/img/google.svg" /> Google
                    </button>
                  </div>
                  <hr class="mt-6 border-b-1 border-gray-400" />
                </div>

                <!-- Sign In Form -->
                <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <div class="text-gray-500 text-center mb-3 font-bold">
                    <small>Or sign in with credentials</small>
                  </div>
                  <form>
                    <!-- Email Input -->
                    <div class="relative w-full mb-3">
                      <label
                        class="block uppercase text-gray-700 text-xs font-bold mb-2"
                        for="email"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        v-model="email"
                        class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        placeholder="Email"
                        style="transition: all 0.15s ease 0s;"
                      />
                    </div>

                    <!-- Username Input -->
                    <div class="relative w-full mb-3">
                      <label
                        class="block uppercase text-gray-700 text-xs font-bold mb-2"
                        for="email"
                      >
                        Username
                      </label>
                      <input
                        id="username"
                        type="username"
                        v-model="username"
                        class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        placeholder="Enter Username"
                        style="transition: all 0.15s ease 0s;"
                      />
                    </div>

                    <!-- Password Input -->
                    <div class="relative w-full mb-3">
                      <label
                        class="block uppercase text-gray-700 text-xs font-bold mb-2"
                        for="password"
                      >
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        v-model="password"
                        class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        placeholder="Password"
                        style="transition: all 0.15s ease 0s;"
                      />
                    </div>

                

                    <!-- Sign In Button -->
                    <div class="text-center mt-6">
                      <button
                        class="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                        type="button"
                        style="transition: all 0.15s ease 0s;"
                        @click="signUpUser"
                      >
                        Sign Up
                      </button>
                    </div>
                  </form>
                  <!-- Forgot Password and Create New Account Links -->
                  <div class="flex justify-center mt-6">
                    <div class="text-center">
                      <button
                        @click="toggleSignin"
                        class="text-gray-700 font-bold text-base  transition-colors duration-300"
                      >
                        <small
                          >Already Have An Account?
                          <span class="text-blue-900 font-bold underline"
                            >Sign In</span
                          ></small
                        >
                      </button>
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

