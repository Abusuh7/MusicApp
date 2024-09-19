<script setup>
import { ref } from 'vue';
import PricingTab from './PricingTab.vue';

const isAnnual = ref(true);
</script>

<template>
  <div class="pricing-container">

    <!-- Pricing toggle -->
    <div class="flex justify-center max-w-[14rem] m-auto mb-8 lg:mb-16">
      <div class="relative flex w-full p-1 bg-white dark:bg-slate-900 rounded-full">
        <span class="absolute inset-0 m-1 pointer-events-none" aria-hidden="true">
          <span
            class="absolute inset-0 w-1/2 bg-indigo-500 rounded-full shadow-sm shadow-indigo-950/10 transform transition-transform duration-150 ease-in-out"
            :class="isAnnual ? 'translate-x-0' : 'translate-x-full'"
          ></span>
        </span>
        <button
          class="relative flex-1 text-sm font-medium h-8 rounded-full focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 dark:focus-visible:ring-slate-600 transition-colors duration-150 ease-in-out"
          :class="isAnnual ? 'text-white' : 'text-slate-500 dark:text-slate-400'"
          @click="isAnnual = true"
          :aria-pressed="isAnnual"
        >
          Yearly <span :class="isAnnual ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'">-20%</span>
        </button>
        <button
          class="relative flex-1 text-sm font-medium h-8 rounded-full focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 dark:focus-visible:ring-slate-600 transition-colors duration-150 ease-in-out"
          :class="isAnnual ? 'text-slate-500 dark:text-slate-400' : 'text-white'"
          @click="isAnnual = false"
          :aria-pressed="isAnnual"
        >
          Monthly
        </button>
      </div>
    </div>

    <!-- Pricing Cards -->
    <div class="pricing-grid max-w-[80rem] mx-auto grid gap-8 lg:grid-cols-3 items-start lg:max-w-none">

      <!-- Pricing tab 1 (Back) -->
      <PricingTab
        :yearly="isAnnual"
        planName="Individual"
        :price="{ yearly: 29, monthly: 4 }"
        planDescriptionAnnual="Free for 3 months, then $29/year"
        planDescriptionMonthly="Free for 3 months, then $4/month"
        :features="[ 
          '1 Premium account', 
          'Unlimited skips and ad-free', 
          'Offline listening', 
          'Cancel anytime'
        ]"
        class="card-back"
      />

      <!-- Pricing tab 2 (Front - Popular) -->
      <PricingTab
        :yearly="isAnnual"
        :popular="true"
        planName="Student"
        :price="{ yearly: 20, monthly: 2 }"
        planDescriptionAnnual="Discounted student plan: $20/year"
        planDescriptionMonthly="Student plan: $2/month"
        :features="[ 
          '1 verified Premium account', 
          'All Individual plan benefits', 
          'Student-only pricing', 
          'Cancel anytime'
        ]"
        class="card-front"
      />

      <!-- Pricing tab 3 (Back) -->
      <PricingTab
        :yearly="isAnnual"
        planName="Family"
        :price="{ yearly: 69, monthly: 6 }"
        planDescriptionAnnual="Family plan: $69/year for up to 6 people"
        planDescriptionMonthly="Family plan: $6/month for up to 6 people"
        :features="[ 
          'Up to 6 Premium accounts', 
          'Ad-free, unlimited skips', 
          'Content control for explicit tracks', 
          'Cancel anytime'
        ]"
        class="card-back"
      />

    </div>

  </div>
</template>

<style scoped>
/* Pricing Container */
.pricing-container {
  perspective: 1500px; /* Enables 3D effect */
}

/* 3D Effect on the Pricing Cards */
.pricing-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  perspective-origin: center;
  gap: 2rem;
  max-width: 80rem; /* Max width increased for larger cards */
}

/* Back Cards (Slightly pushed back) */
.card-back {
  transform: translateZ(-50px) scale(0.95); /* Move the card back */
  transition: transform 0.4s ease-in-out, box-shadow 0.4s ease;
  width: 100%; /* Set card width to 100% of grid space */
}

/* Front Card (Popular) */
.card-front {
  transform: translateZ(40px); /* Bring the "Popular" card forward */
  z-index: 2; /* Ensure it appears on top */
  transition: transform 0.4s ease-in-out, box-shadow 0.4s ease;
  width: 100%; /* Set card width to 100% of grid space */
}

/* Hover effect to bring cards forward */
.card-front:hover,
.card-back:hover {
  transform: translateZ(70px); /* Bring the card more forward on hover */
}

/* Add border and shadow to all cards */
.PricingTab {
  border: 2px solid #e2e8f0; /* Light gray border */
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  background-color: rgba(255, 255, 255, 0.85); /* Light background with opacity */
  backdrop-filter: blur(10px); /* Apply blur to give depth */
  width: 100%; /* Make sure the card takes the full width of its container */
}
</style>
