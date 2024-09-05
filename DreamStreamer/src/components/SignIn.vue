<script setup>
import { RouterLink, RouterView } from "vue-router";
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";

import { Amplify } from "aws-amplify";
import awsconfig from "../aws-exports";
import NavbarComponent from "../components/LoggedNavbar.vue";
import FooterComponent from "../components/Footer.vue";




Amplify.configure(awsconfig);
</script>

<template>
  <div class="auth-container">
    <authenticator
      class="auth-container-form"
      variation="modal"
      :social-providers="['apple', 'facebook', 'google']"
    >
      <template v-slot="{ user, signOut }">
        <!-- <h1>Hello {{ user.username }}!</h1>
        <button @click="signOut">Sign Out</button> -->
        <div>
          <navbar-component></navbar-component>
          <main>
            <div
              class="relative py-20 flex content-center items-center justify-center"
              style="min-height: 75vh"
            >
              <div
                class="absolute top-0 w-full h-full bg-center bg-cover"
                style="
                  background-image: url('https://images.unsplash.com/photo-1496957961599-e35b69ef5d7c?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
                "
              >
                <span
                  id="blackOverlay"
                  class="w-full h-full absolute opacity-75 bg-black"
                ></span>
              </div>
              <div class="container relative mx-auto">
                <div class="items-center flex flex-wrap">
                  <div
                    class="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center"
                  >
                    <div class="pr-12">
                      <h1 class="text-white font-semibold text-4xl">
                        Welcome to DreamStreamer,
                        {{
                          user.username.charAt(0).toUpperCase() +
                          user.username.slice(1)
                        }}!
                      </h1>
                      <p class="mt-4 text-lg text-gray-300">
                        “The true beauty of music is that it connects people. It
                        carries a message, and we, the musicians, are the
                        messengers.”<br />
                        ~ Roy Ayers ~
                      </p>
                      <div class="mt-8">
                        <button
                          class="bg-gray-50 text-gray-800 font-bold uppercase text-sm px-6 py-3 rounded shadow-lg outline-none focus:outline-none mr-1 mb-1 hover:bg-gray-300"
                          type="button"
                          style="transition: all 0.15s ease 0s"
                        >
                          Start Listening
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
                style="height: 70px"
              >
                <svg
                  class="absolute bottom-0 overflow-hidden"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  version="1.1"
                  viewBox="0 0 2560 100"
                  x="0"
                  y="0"
                >
                  <polygon
                    class="text-gray-300 fill-current"
                    points="2560 0 2560 100 0 100"
                  ></polygon>
                </svg>
              </div>
            </div>
            <section class="pb-20 bg-gray-300">
              <div class="container mx-auto px-4 py-20">

                <!-- PLaylist Container -->
                <div class="flex flex-wrap items-center justify-center text-center mb-10">
                  <div class="w-full lg:w-6/12 px-4">
                    <h2 class="text-4xl font-semibold">
                      Discover Your Perfect Playlist
                    </h2>
                    <p class="text-lg leading-relaxed m-4 text-gray-600">
                      Explore a world of music tailored to your unique tastes.
                      Our app offers a wide range of playlists that cater to
                      every mood and occasion, so you can enjoy your favorite
                      tunes wherever you go.
                    </p>
                  </div>
                </div>

                <div class="flex flex-wrap">
                  <div class="w-full md:w-4/12 px-4 text-center">
                    <div
                      class="relative flex flex-col min-w-0 break-words bg-gray-100 w-full mb-8 shadow-lg rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
                    >
                      <div class="flex flex-row">
                        <!-- Image container -->
                        <div class="overflow-hidden">
                          <img
                            class="h-48 w-60 transform transition duration-300 ease-in-out hover:scale-110"
                            src="https://images.unsplash.com/photo-1669173034813-fff51b1ee64d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Playlists for Every Mood"
                          />
                        </div>
                        <!-- Text container -->
                        <div class="px-4 py-5 flex-col">
                          <div
                            class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-800"
                          >
                            <i class="fa-solid fa-icons"></i>
                          </div>
                          <h6 class="text-xl font-semibold">
                            Playlists for Every Mood
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="w-full md:w-4/12 px-4 text-center">
                    <div
                      class="relative flex flex-col min-w-0 break-words bg-gray-100 w-full mb-8 shadow-lg rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
                    >
                      <div class="flex flex-row">
                        <!-- Image container -->
                        <div class="overflow-hidden">
                          <img
                            class="h-48 w-60 transform transition duration-300 ease-in-out hover:scale-110"
                            src="https://images.unsplash.com/photo-1669173034813-fff51b1ee64d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Playlists for Every Mood"
                          />
                        </div>
                        <!-- Text container -->
                        <div class="px-4 py-5 flex-col">
                          <div
                            class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-800"
                          >
                            <i class="fa-solid fa-icons"></i>
                          </div>
                          <h6 class="text-xl font-semibold">
                            Playlists for Every Mood
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="w-full md:w-4/12 px-4 text-center">
                    <div
                      class="relative flex flex-col min-w-0 break-words bg-gray-100 w-full mb-8 shadow-lg rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
                    >
                      <div class="flex flex-row">
                        <!-- Image container -->
                        <div class="overflow-hidden">
                          <img
                            class="h-48 w-60 transform transition duration-300 ease-in-out hover:scale-110"
                            src="https://images.unsplash.com/photo-1669173034813-fff51b1ee64d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Playlists for Every Mood"
                          />
                        </div>
                        <!-- Text container -->
                        <div class="px-4 py-5 flex-col">
                          <div
                            class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-800"
                          >
                            <i class="fa-solid fa-icons"></i>
                          </div>
                          <h6 class="text-xl font-semibold">
                            Playlists for Every Mood
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Made For User Container -->
                <!-- <div class="flex flex-wrap items-center mt-35">
                  <div class="w-full md:w-5/12 px-4 mr-auto ml-auto">
                    <h3 class="text-3xl mb-2 font-semibold leading-normal">
                      Made For {{  user.username.charAt(0).toUpperCase() + user.username.slice(1) }}
                    </h3>
                    <p
                      class="text-lg font-light leading-relaxed mt-4 mb-4 text-gray-700"
                    >
                      Immerse yourself in music that goes wherever you do. Our
                      app creates personalized playlists that match your unique
                      vibe, helping you discover new sounds effortlessly.
                    </p>
                    <p
                      class="text-lg font-light leading-relaxed mt-0 mb-4 text-gray-700"
                    >
                      Whether you’re commuting, working out, or relaxing, enjoy
                      a seamless music experience that fits your lifestyle. Your
                      favorite tunes are always within reach, ready to enhance
                      every moment.
                    </p>
                    <a
                      href="https://www.creative-tim.com/learning-lab/tailwind-starter-kit#/presentation"
                      class="font-bold text-gray-800 mt-8"
                      >Learn More!</a
                    >
                  </div>
                </div> -->
              </div>
            </section>

            <!-- Made For User 2 -->
            <section class="relative py-20">
              <div
                class="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20"
                style="height: 80px"
              >
                <svg
                  class="absolute bottom-0 overflow-hidden"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  version="1.1"
                  viewBox="0 0 2560 100"
                  x="0"
                  y="0"
                >
                  <polygon
                    class="text-white fill-current"
                    points="2560 0 2560 100 0 100"
                  ></polygon>
                </svg>
              </div>
              <div class="container mx-auto px-4">
                <div class="flex flex-wrap items-center justify-center text-center mb-10">
                  <div class="w-full lg:w-6/12 px-4">
                    <h2 class="text-4xl font-semibold">
                      Made For {{  user.username.charAt(0).toUpperCase() + user.username.slice(1) }}
                    </h2>
                    <p class="text-lg leading-relaxed m-4 text-gray-600">
                      Explore a world of music tailored to your unique tastes.
                      Our app offers a wide range of playlists that cater to
                      every mood and occasion, so you can enjoy your favorite
                      tunes wherever you go.
                    </p>
                  </div>
                </div>

                <div class="flex flex-wrap">
                  <div class="w-full md:w-4/12 px-4 text-center">
                    <div
                      class="relative flex flex-col min-w-0 break-words bg-gray-300 w-full mb-8 shadow-lg rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
                    >
                      <div class="flex flex-row">
                        <!-- Image container -->
                        <div class="overflow-hidden">
                          <img
                            class="h-48 w-60 transform transition duration-300 ease-in-out hover:scale-110"
                            src="https://images.unsplash.com/photo-1669173034813-fff51b1ee64d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Playlists for Every Mood"
                          />
                        </div>
                        <!-- Text container -->
                        <div class="px-4 py-5 flex-col">
                          <div
                            class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-800"
                          >
                            <i class="fa-solid fa-icons"></i>
                          </div>
                          <h6 class="text-xl font-semibold">
                            Playlists for Every Mood
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="w-full md:w-4/12 px-4 text-center">
                    <div
                      class="relative flex flex-col min-w-0 break-words bg-gray-300 w-full mb-8 shadow-lg rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
                    >
                      <div class="flex flex-row">
                        <!-- Image container -->
                        <div class="overflow-hidden">
                          <img
                            class="h-48 w-60 transform transition duration-300 ease-in-out hover:scale-110"
                            src="https://images.unsplash.com/photo-1669173034813-fff51b1ee64d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Playlists for Every Mood"
                          />
                        </div>
                        <!-- Text container -->
                        <div class="px-4 py-5 flex-col">
                          <div
                            class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-800"
                          >
                            <i class="fa-solid fa-icons"></i>
                          </div>
                          <h6 class="text-xl font-semibold">
                            Playlists for Every Mood
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="w-full md:w-4/12 px-4 text-center">
                    <div
                      class="relative flex flex-col min-w-0 break-words bg-gray-300 w-full mb-8 shadow-lg rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
                    >
                      <div class="flex flex-row">
                        <!-- Image container -->
                        <div class="overflow-hidden">
                          <img
                            class="h-48 w-60 transform transition duration-300 ease-in-out hover:scale-110"
                            src="https://images.unsplash.com/photo-1669173034813-fff51b1ee64d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Playlists for Every Mood"
                          />
                        </div>
                        <!-- Text container -->
                        <div class="px-4 py-5 flex-col">
                          <div
                            class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-800"
                          >
                            <i class="fa-solid fa-icons"></i>
                          </div>
                          <h6 class="text-xl font-semibold">
                            Playlists for Every Mood
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Made For User Container -->
                <!-- <div class="flex flex-wrap items-center mt-35">
                  <div class="w-full md:w-5/12 px-4 mr-auto ml-auto">
                    <h3 class="text-3xl mb-2 font-semibold leading-normal">
                      Made For {{  user.username.charAt(0).toUpperCase() + user.username.slice(1) }}
                    </h3>
                    <p
                      class="text-lg font-light leading-relaxed mt-4 mb-4 text-gray-700"
                    >
                      Immerse yourself in music that goes wherever you do. Our
                      app creates personalized playlists that match your unique
                      vibe, helping you discover new sounds effortlessly.
                    </p>
                    <p
                      class="text-lg font-light leading-relaxed mt-0 mb-4 text-gray-700"
                    >
                      Whether you’re commuting, working out, or relaxing, enjoy
                      a seamless music experience that fits your lifestyle. Your
                      favorite tunes are always within reach, ready to enhance
                      every moment.
                    </p>
                    <a
                      href="https://www.creative-tim.com/learning-lab/tailwind-starter-kit#/presentation"
                      class="font-bold text-gray-800 mt-8"
                      >Learn More!</a
                    >
                  </div>
                </div> -->
              </div>
            </section>
            <section class="pt-20 pb-48">
              <div class="container mx-auto px-4">
                <div class="flex flex-wrap justify-center text-center mb-24">
                  <div class="w-full lg:w-6/12 px-4">
                    <h2 class="text-4xl font-semibold">
                      Frequestly Listened Arsist
                    </h2>
                    <p class="text-lg leading-relaxed m-4 text-gray-600">
                      Discover your most-played artists, curated just for you.
                      Revisit your favorites and dive deeper into the music you
                      love.
                    </p>
                  </div>
                </div>
                <div class="flex flex-wrap">
                  <div class="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                    <div class="px-6">
                      <img
                        alt="..."
                        src="../assets/img/ariana.jpg"
                        class="shadow-lg rounded-full max-w-full mx-auto"
                        style="max-width: 120px"
                      />
                      <div class="pt-6 text-center">
                        <h5 class="text-xl font-bold">Ariana Grande</h5>
                        <p
                          class="mt-1 text-sm text-gray-500 uppercase font-semibold"
                        >
                          Artist
                        </p>
                        <div class="mt-6">
                          <button
                            class="bg-red-500 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                            type="button"
                          >
                            <i class="fab fa-youtube"></i></button
                          ><button
                            class="bg-blue-400 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                            type="button"
                          >
                            <i class="fab fa-twitter"></i></button
                          ><button
                            class="bg-gray-800 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                            type="button"
                          >
                            <i class="fab fa-instagram"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                    <div class="px-6">
                      <img
                        alt="..."
                        src="../assets/img/justin.jpeg"
                        class="shadow-lg rounded-full max-w-full mx-auto"
                        style="max-width: 120px"
                      />
                      <div class="pt-6 text-center">
                        <h5 class="text-xl font-bold">Justin Bieber</h5>
                        <p
                          class="mt-1 text-sm text-gray-500 uppercase font-semibold"
                        >
                          Artist
                        </p>
                        <div class="mt-6">
                          <button
                            class="bg-red-500 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                            type="button"
                          >
                            <i class="fab fa-youtube"></i></button
                          ><button
                            class="bg-blue-400 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                            type="button"
                          >
                            <i class="fab fa-twitter"></i></button
                          ><button
                            class="bg-gray-800 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                            type="button"
                          >
                            <i class="fab fa-instagram"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                    <div class="px-6">
                      <img
                        alt="..."
                        src="../assets/img/katty.webp"
                        class="shadow-lg rounded-full max-w-full mx-auto"
                        style="max-width: 120px"
                      />
                      <div class="pt-6 text-center">
                        <h5 class="text-xl font-bold">Katy Perry</h5>
                        <p
                          class="mt-1 text-sm text-gray-500 uppercase font-semibold"
                        >
                          Artist
                        </p>
                        <div class="mt-6">
                          <button
                            class="bg-red-500 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                            type="button"
                          >
                            <i class="fab fa-youtube"></i></button
                          ><button
                            class="bg-blue-400 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                            type="button"
                          >
                            <i class="fab fa-twitter"></i></button
                          ><button
                            class="bg-gray-800 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                            type="button"
                          >
                            <i class="fab fa-instagram"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                    <div class="px-6">
                      <img
                        alt="..."
                        src="../assets/img/salena.webp"
                        class="shadow-lg rounded-full max-w-full mx-auto"
                        style="max-width: 120px"
                      />
                      <div class="pt-6 text-center">
                        <h5 class="text-xl font-bold">Selena Gomez</h5>
                        <p
                          class="mt-1 text-sm text-gray-500 uppercase font-semibold"
                        >
                          Artist
                        </p>
                        <div class="mt-6">
                          <button
                            class="bg-red-500 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                            type="button"
                          >
                            <i class="fab fa-youtube"></i></button
                          ><button
                            class="bg-blue-400 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                            type="button"
                          >
                            <i class="fab fa-twitter"></i></button
                          ><button
                            class="bg-gray-800 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                            type="button"
                          >
                            <i class="fab fa-instagram"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section class="pb-20 relative block bg-gray-900">
              <div
                class="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20"
                style="height: 80px"
              >
                <svg
                  class="absolute bottom-0 overflow-hidden"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  version="1.1"
                  viewBox="0 0 2560 100"
                  x="0"
                  y="0"
                >
                  <polygon
                    class="text-gray-900 fill-current"
                    points="2560 0 2560 100 0 100"
                  ></polygon>
                </svg>
              </div>
              <div class="container mx-auto px-4 lg:pt-24 lg:pb-64">
                <div class="flex flex-wrap text-center justify-center">
                  <div class="w-full lg:w-6/12 px-4">
                    <h2 class="text-4xl font-semibold text-white">
                      Build something
                    </h2>
                    <p class="text-lg leading-relaxed mt-4 mb-4 text-gray-500">
                      Put the potentially record low maximum sea ice extent tihs
                      year down to low ice. According to the National Oceanic
                      and Atmospheric Administration, Ted, Scambos.
                    </p>
                  </div>
                </div>
                <div class="flex flex-wrap mt-12 justify-center">
                  <div class="w-full lg:w-3/12 px-4 text-center">
                    <div
                      class="text-gray-900 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center"
                    >
                      <i class="fas fa-medal text-xl"></i>
                    </div>
                    <h6 class="text-xl mt-5 font-semibold text-white">
                      Excelent Services
                    </h6>
                    <p class="mt-2 mb-4 text-gray-500">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                  </div>
                  <div class="w-full lg:w-3/12 px-4 text-center">
                    <div
                      class="text-gray-900 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center"
                    >
                      <i class="fas fa-poll text-xl"></i>
                    </div>
                    <h5 class="text-xl mt-5 font-semibold text-white">
                      Grow your market
                    </h5>
                    <p class="mt-2 mb-4 text-gray-500">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                  </div>
                  <div class="w-full lg:w-3/12 px-4 text-center">
                    <div
                      class="text-gray-900 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center"
                    >
                      <i class="fas fa-lightbulb text-xl"></i>
                    </div>
                    <h5 class="text-xl mt-5 font-semibold text-white">
                      Launch time
                    </h5>
                    <p class="mt-2 mb-4 text-gray-500">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <section class="relative block py-24 lg:pt-0 bg-gray-900">
              <div class="container mx-auto px-4">
                <div class="flex flex-wrap justify-center lg:-mt-64 -mt-48">
                  <div class="w-full lg:w-6/12 px-4">
                    <div
                      class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300"
                    >
                      <div class="flex-auto p-5 lg:p-10">
                        <h4 class="text-2xl font-semibold">
                          Want to work with us?
                        </h4>
                        <p class="leading-relaxed mt-1 mb-4 text-gray-600">
                          Complete this form and we will get back to you in 24
                          hours.
                        </p>
                        <div class="relative w-full mb-3 mt-8">
                          <label
                            class="block uppercase text-gray-700 text-xs font-bold mb-2"
                            for="full-name"
                            >Full Name</label
                          ><input
                            type="text"
                            class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                            placeholder="Full Name"
                            style="transition: all 0.15s ease 0s"
                          />
                        </div>
                        <div class="relative w-full mb-3">
                          <label
                            class="block uppercase text-gray-700 text-xs font-bold mb-2"
                            for="email"
                            >Email</label
                          ><input
                            type="email"
                            class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                            placeholder="Email"
                            style="transition: all 0.15s ease 0s"
                          />
                        </div>
                        <div class="relative w-full mb-3">
                          <label
                            class="block uppercase text-gray-700 text-xs font-bold mb-2"
                            for="message"
                            >Message</label
                          ><textarea
                            rows="4"
                            cols="80"
                            class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                            placeholder="Type a message..."
                          ></textarea>
                        </div>
                        <div class="text-center mt-6">
                          <button
                            class="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                            type="button"
                            style="transition: all 0.15s ease 0s"
                          >
                            Send Message
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <footer-component></footer-component>
        </div>
      </template>
    </authenticator>
  </div>
</template>

<!-- <style scoped>
.auth-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('https://images.unsplash.com/photo-1511367734837-f2956f0d8020?q=80&w=2005&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); /* Replace with your image path */
  background-size: cover;
  background-position: center;
  position: relative;
}

.auth-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* Black shade with 50% opacity */
  z-index: 1;
}

.auth-container > * {
  position: relative;
  z-index: 2;
  color: white; /* Ensure text is visible over the darkened background */
}

</style> -->
