<template>
  <div>
    <!-- Album View Component (will show after welcome) -->
    <AlbumView/>
    <br><br>
    <SongsView/>
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

</style>
