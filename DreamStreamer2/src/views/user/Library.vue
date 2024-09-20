<template>
  <div class="max-w-lg mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">My Playlist's</h1>

    <!-- Button to Open Modal -->
    <button @click="openModal" class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
      Create New Album
    </button>

    <!-- Success or Error Messages -->
    <div v-if="successMessage" class="bg-green-100 text-green-700 p-3 rounded-md mb-4">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="bg-red-100 text-red-700 p-3 rounded-md mb-4">
      {{ errorMessage }}
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">Create Personalized Album</h2>

        <form @submit.prevent="createPersonalAlbum">
          <!-- Album Name -->
          <div class="mb-4">
            <label for="album_name" class="block text-sm font-medium text-gray-700">Album Name</label>
            <input
              type="text"
              v-model="album.album_name"
              id="album_name"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <!-- Album Art Upload -->
          <div class="mb-4">
            <label for="album_art" class="block text-sm font-medium text-gray-700">Upload Album Art</label>
            <input type="file" @change="onFileChange" id="album_art" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>

          <!-- Submit Button -->
          <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            Create Album
          </button>
        </form>

        <!-- Close Modal Button -->
        <button @click="closeModal" class="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
          Close
        </button>
      </div>
    </div>
  </div>

  <PersonalAlbumView />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCurrentUser } from 'aws-amplify/auth';
import PersonalAlbumView from '@/components/UserComponents/PersonalAlbumView.vue';

// State for modal visibility
const isModalOpen = ref(false);

const album = ref({
  album_name: '',
  no_of_tracks: 0, // Initially zero
});
const albumArtFile = ref(null);
const successMessage = ref('');
const errorMessage = ref('');
const userName = ref('');
const userId = ref('');

// Handle file input change
const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    albumArtFile.value = file;
  }
};

// Open and close modal functions
const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

// Fetch the current user's name
onMounted(async () => {
  try {
    const user = await getCurrentUser();
    userName.value = user.username;
    userId.value = user.userId;
    console.log('User:', user);
  } catch (error) {
    console.error('Error fetching user:', error);
  }
});

// Create Personalized Album
const createPersonalAlbum = async () => {
  try {
    // Convert album art to base64
    let albumArtBase64 = null;
    let albumArtFilename = null;
    if (albumArtFile.value) {
      const reader = new FileReader();
      reader.readAsDataURL(albumArtFile.value);
      const base64Promise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
      });
      albumArtBase64 = await base64Promise;
      albumArtFilename = albumArtFile.value.name;
    }

    // Prepare album data
    const albumData = {
      user_id: userId.value,
      album_name: album.value.album_name,
      no_of_tracks: album.value.no_of_tracks,
      album_art_base64: albumArtBase64,
      album_art_filename: albumArtFilename,
    };

    // Send POST request to Lambda function
    const response = await fetch('https://4tvu26kjyf.execute-api.ap-southeast-1.amazonaws.com/dev/createPerosnalAlbum', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(albumData),
    });

    const result = await response.json();
    if (response.ok) {
      successMessage.value = 'Album created successfully!';
      errorMessage.value = '';
      resetForm();
      closeModal(); // Close the modal after creation
    } else {
      errorMessage.value = result.message || 'Failed to create album';
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = 'An error occurred while creating the album';
  }
};

// Reset form after successful submission
const resetForm = () => {
  album.value = {
    album_name: '',
    no_of_tracks: 0, // Reset tracks to zero
  };
  albumArtFile.value = null;
};
</script>

<style scoped>
/* Tailwind CSS is included in this example */
</style>
