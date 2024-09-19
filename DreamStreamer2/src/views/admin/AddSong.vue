<template>
  <AdminHomeTest>
    <div class="form-container">
      <h2>Create Song</h2>

      <!-- Success and Error Messages -->
      <transition name="fade">
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </transition>
      <transition name="fade">
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </transition>

      <!-- Song Form -->
      <form @submit.prevent="createSong">
        <!-- Song Name -->
        <div class="form-group">
          <label for="name">Song Name:</label>
          <input v-model="song.name" type="text" id="name" required class="form-input" />
        </div>

        <!-- Genre Dropdown -->
        <div class="form-group">
          <label for="genre">Genre:</label>
          <select v-model="song.genre_id" required class="form-input">
            <option v-for="genre in genres" :key="genre.ID" :value="genre.ID">{{ genre.NAME }}</option>
          </select>
        </div>

        <!-- Artist Dropdown -->
        <div class="form-group">
          <label for="artist">Artist:</label>
          <select v-model="song.artist_id" required class="form-input">
            <option v-for="artist in artists" :key="artist.ID" :value="artist.ID">{{ artist.NAME }}</option>
          </select>
        </div>

        <!-- Song File Upload -->
        <div class="form-group">
          <label for="songFile">Song File:</label>
          <input @change="onSongFileChange" type="file" id="songFile" accept="audio/*" required class="form-input" />
          <p v-if="uploading" class="loading-message">
            <span class="spinner"></span>Uploading song, please wait...
          </p>
        </div>

        <!-- Thumbnail Upload -->
        <div class="form-group">
          <label for="thumbnailFile">Thumbnail:</label>
          <input @change="onThumbnailFileChange" type="file" id="thumbnailFile" accept="image/*" required class="form-input" />
        </div>

        <!-- Duration -->
        <p v-if="song.duration">Duration: {{ song.duration }} seconds</p>

        <!-- Status -->
        <div class="form-group">
          <label for="status">Status:</label>
          <select v-model="song.status" required class="form-input">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <!-- Submit Button with Loading Spinner -->
        <button :disabled="uploading || !song.songUrl" type="submit" class="form-button">
          <span v-if="uploading" class="spinner"></span>
          <span v-else>Create Song</span>
        </button>
      </form>
    </div>
  </AdminHomeTest>
</template>

<script setup>
import AdminHomeTest from '@/layouts/AdminHomeTest.vue';
import { ref } from 'vue';

const song = ref({
  name: '',
  genre_id: null,
  artist_id: null,
  songUrl: '',
  duration: null,
  status: 'active',
  thumbnailFile: null,
  thumbnailMimeType: '',
});

const genres = ref([]);
const artists = ref([]);
const errorMessage = ref(null);
const successMessage = ref(null);
const uploading = ref(false);

// Fetch genres and artists for dropdowns
const fetchGenresAndArtists = async () => {
  const genreResponse = await fetch('https://e8ft24nt6g.execute-api.ap-southeast-1.amazonaws.com/dev/genreViewAll');
  genres.value = await genreResponse.json();

  const artistResponse = await fetch('https://x6krsc98il.execute-api.ap-southeast-1.amazonaws.com/dev/viewallartist');
  artists.value = await artistResponse.json();
};

// Handle thumbnail file change
const onThumbnailFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      song.value.thumbnailFile = reader.result.split(',')[1];  // Base64 encode the image file
      song.value.thumbnailMimeType = file.type;  // Capture the MIME type
    };
  }
};

// Handle song file upload and duration calculation
const onSongFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    uploading.value = true;

    // Calculate duration using Audio API
    const audio = new Audio(URL.createObjectURL(file));
    audio.addEventListener('loadedmetadata', () => {
      song.value.duration = audio.duration.toFixed(2);  // Get duration in seconds
    });

    const formData = { fileName: file.name };

    try {
      // Step 1: Get pre-signed URL from Lambda
      const presignResponse = await fetch('https://drj8e1e679.execute-api.ap-southeast-1.amazonaws.com/dev/preassignedUrl', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });

      const { uploadUrl, songUrl } = await presignResponse.json();

      // Step 2: Upload song to S3 using the pre-signed URL
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
      });

      // Store song URL for form submission
      song.value.songUrl = songUrl;
      uploading.value = false;
    } catch (error) {
      errorMessage.value = 'Error uploading song';
      uploading.value = false;
    }
  }
};

// Create song function
const createSong = async () => {
  if (!song.value.songUrl) {
    errorMessage.value = 'Please upload a song file first.';
    return;
  }

  const payload = {
    name: song.value.name,
    genreId: song.value.genre_id,
    artistId: song.value.artist_id,
    songUrl: song.value.songUrl,
    thumbnailBase64: song.value.thumbnailFile,
    thumbnailMimeType: song.value.thumbnailMimeType,
    duration: song.value.duration,
    status: song.value.status,
  };

  const apiUrl = 'https://drj8e1e679.execute-api.ap-southeast-1.amazonaws.com/dev/songAdd';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.json();
      errorMessage.value = `Error: ${errorData.message}`;
    } else {
      successMessage.value = 'Song created successfully!';
      // Reset form
      song.value = {
        name: '',
        genre_id: null,
        artist_id: null,
        songUrl: '',
        duration: null,
        status: 'active',
        thumbnailFile: null,
        thumbnailMimeType: '',
      };
    }
  } catch (error) {
    errorMessage.value = `Error: ${error.message}`;
  }
};

// Fetch genres and artists when the component is mounted
fetchGenresAndArtists();
</script>

<style scoped>
.form-container {
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

button:disabled {
  background-color: #999;
  cursor: not-allowed;
}

button:hover:enabled {
  background-color: #555;
}

.success-message {
  color: green;
  text-align: center;
  margin-top: 10px;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}

/* Fade-in and fade-out animation for messages */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* Spinner for loading animation */
.spinner {
  border: 4px solid #f3f3f3;
  border-radius: 50%;
  border-top: 4px solid #333;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 5px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
