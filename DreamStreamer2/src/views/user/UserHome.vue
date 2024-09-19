<template>
  <div class="welcome-container">
    <div class="welcome-message">
      <h3>Welcome Back, {{ userName.charAt(0).toUpperCase() + userName.slice(1) }}</h3>
      <p>We hope you enjoy your time here!</p>
    </div>
    
    <!-- Album View Component (will show after welcome) -->
    <AlbumView />
    <br><br>
    <SongsView />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AlbumView from '@/components/UserComponents/AlbumView.vue';
import { getCurrentUser } from 'aws-amplify/auth';
import SongsView from '@/components/UserComponents/SongsView.vue';

// Simulating fetching the user's name
const userName = ref(''); // You can replace this with dynamic user data

const showWelcome = ref(true);

// Hide the welcome text after 3 seconds
onMounted(() => {
  setTimeout(() => {
    showWelcome.value = false;
  }, 3000); // The welcome text will disappear after 3 seconds
});

// Fetch the current user's name
onMounted(async () => {
  try {
    const user = await getCurrentUser();
    userName.value = user.username;
  } catch (error) {
    console.error('Error fetching user:', error);
  }
});
</script>

<style scoped>
.welcome-container {
  padding: 20px;
}

.welcome-message {
  background-color: #f0f8ff; /* Light, soft blue background */
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Soft shadow */
  text-align: left; /* Align text to the left */
  margin-bottom: 30px;
}

.welcome-message h3 {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50; /* Darker shade for text */
  margin-bottom: 5px;
}

.welcome-message p {
  font-size: 16px;
  color: #34495e; /* Slightly darker shade for the subtext */
  margin: 0;
}
</style>
