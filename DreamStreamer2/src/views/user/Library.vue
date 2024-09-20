<template>
  <div class="max-w-lg mx-auto p-6">
    <!-- <h1 class="text-2xl font-bold mb-6">My Playlist's</h1> -->

    <!-- Button to Open Modal -->
    <button @click="openModal" class="create-album-btn">
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
      <div class="modal-container">
        <h2 class="modal-title">Create Personalized Album</h2>

        <form @submit.prevent="createPersonalAlbum">
          <!-- Album Name -->
          <div class="form-group">
            <label for="album_name" class="form-label">Album Name</label>
            <input
              type="text"
              v-model="album.album_name"
              id="album_name"
              class="form-input"
              required
            />
          </div>

          <!-- Album Art Upload -->
          <div class="form-group">
            <label for="album_art" class="form-label">Upload Album Art</label>
            <input type="file" @change="onFileChange" id="album_art" class="form-input" />
          </div>

          <!-- Submit Button -->
          <button type="submit" class="modal-submit-btn">
            Create Album
          </button>
        </form>

        <!-- Close Modal Button -->
        <button @click="closeModal" class="modal-close-btn">
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
/* Styling for the "Create New Album" Button */
.create-album-btn {
  background: linear-gradient(135deg, #566887 0%, #262d3c 100%);
  color: white;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: 30px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: inline-block;
  text-align: center;
  font-size: 16px;
  width: 100%;
}

.create-album-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.create-album-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

/* Modal Styling */
.modal-container {
  background-color: white;
  padding: 30px;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
  position: relative;
  text-align: center;
}

.modal-title {
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #1f2937;
}

/* Form Group Styling */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 1rem;
  color: #4b5563;
  margin-bottom: 6px;
  text-align: left;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  border-color: #3b82f6;
}

/* Modal Buttons */
.modal-submit-btn {
  background-color: #2e3b4d;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  width: 100%;
  font-weight: bold;
  margin-top: 20px;
  transition: background-color 0.2s ease;
}

.modal-submit-btn:hover {
  background-color: #1f2834;
}

.modal-close-btn {
  background-color: #ef4444;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  width: 100%;
  font-weight: bold;
  margin-top: 10px;
  transition: background-color 0.2s ease;
}

.modal-close-btn:hover {
  background-color: #dc2626;
}

/* Modal Transition and Animation */
.modal-container {
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
