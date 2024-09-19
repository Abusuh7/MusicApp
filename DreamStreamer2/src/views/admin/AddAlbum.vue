<template>
  <AdminHomeTest>
    <div class="form-container">
      <h2>Create Album</h2>

      <!-- Success and Error Messages -->
      <transition name="fade">
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </transition>
      <transition name="fade">
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </transition>

      <form @submit.prevent="createAlbum">
        <!-- Album Name -->
        <div class="form-group">
          <label for="name">Album Name:</label>
          <input v-model="album.name" type="text" id="name" required class="form-input" />
        </div>

        <!-- Genre Dropdown -->
        <div class="form-group">
          <label for="genre">Genre:</label>
          <select v-model="album.genre_id" required class="form-select">
            <option v-for="genre in genres" :key="genre.ID" :value="genre.ID">{{ genre.NAME }}</option>
          </select>
        </div>

        <!-- Artist Dropdown -->
        <div class="form-group">
          <label for="artist">Artist:</label>
          <select v-model="album.artist_id" required class="form-select">
            <option v-for="artist in artists" :key="artist.ID" :value="artist.ID">{{ artist.NAME }}</option>
          </select>
        </div>

        <!-- Track Selection (Dynamic) -->
        <div class="form-group">
          <label for="songs">Select Songs:</label>
          <select v-model="album.songs" id="songs" multiple @change="updateTrackCount" class="form-select">
            <option v-for="song in songs" :key="song.id" :value="song.id">{{ song.name }}</option>
          </select>
        </div>

        <!-- Dynamic Number of Tracks -->
        <p class="track-count">Number of Tracks: {{ album.no_of_tracks }}</p>

        <!-- Year of Release -->
        <div class="form-group">
          <label for="year">Year of Release:</label>
          <input v-model="album.year" type="date" id="year" required class="form-input" />
        </div>

        <!-- Studio -->
        <div class="form-group">
          <label for="studio">Studio:</label>
          <input v-model="album.studio" type="text" id="studio" required class="form-input" />
        </div>

        <!-- Status Dropdown -->
        <div class="form-group">
          <label for="status">Status:</label>
          <select v-model="album.status" required class="form-select">
            <option value="released">Released</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <!-- Album Art Upload -->
        <div class="form-group">
          <label for="album_art">Album Art (optional):</label>
          <input type="file" @change="onAlbumArtFileChange" accept="image/*" class="form-file-input" />
        </div>

        <!-- Submit Button with Loading Spinner -->
        <button :disabled="isSubmitting" type="submit" class="form-button">
          <span v-if="isSubmitting" class="spinner"></span>
          <span v-else>Create Album</span>
        </button>
      </form>
    </div>
  </AdminHomeTest>
</template>

<script setup>
import AdminHomeTest from '@/layouts/AdminHomeTest.vue';
import { ref } from 'vue';

// Album state
const album = ref({
  name: '',
  genre_id: null,
  artist_id: null,
  songs: [],
  no_of_tracks: 0, // Dynamically updated
  year: '',
  studio: '',
  status: 'released',
  album_art_base64: '',
  album_art_filename: ''
});

// Placeholder image (change this to the path of your asset image)
const defaultImage = "/assets/placeholder.png";

// Data lists for genres, artists, and songs
const genres = ref([]);
const artists = ref([]);
const songs = ref([]);
const errorMessage = ref(null);
const successMessage = ref(null);
const isSubmitting = ref(false);

// Fetch genres, artists, and songs for dropdowns
const fetchGenresArtistsAndSongs = async () => {
  try {
    // Fetch genres
    const genreResponse = await fetch('https://e8ft24nt6g.execute-api.ap-southeast-1.amazonaws.com/dev/genreViewAll');
    genres.value = await genreResponse.json();

    // Fetch artists
    const artistResponse = await fetch('https://x6krsc98il.execute-api.ap-southeast-1.amazonaws.com/dev/viewallartist');
    artists.value = await artistResponse.json();

    // Fetch songs
    const songResponse = await fetch('https://drj8e1e679.execute-api.ap-southeast-1.amazonaws.com/dev/songViewAll');
    songs.value = await songResponse.json();
  } catch (error) {
    errorMessage.value = 'Error fetching data';
  }
};

// Update the number of tracks dynamically based on selected songs
const updateTrackCount = () => {
  album.value.no_of_tracks = album.value.songs.length;
};

// Handle album art file upload and convert to base64
const onAlbumArtFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      album.value.album_art_base64 = reader.result.split(',')[1]; // Get base64 content
      album.value.album_art_filename = file.name; // Store file name for later use
    };
  }
};

// Create album function
const createAlbum = async () => {
  isSubmitting.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  // Validate form
  if (!album.value.name || !album.value.genre_id || !album.value.artist_id || album.value.no_of_tracks === 0) {
    errorMessage.value = 'Please fill out all required fields and select at least one song.';
    isSubmitting.value = false;
    return;
  }

  // If no album art is uploaded, use the default image
  if (!album.value.album_art_base64) {
    album.value.album_art_base64 = defaultImage; // Use default image
    album.value.album_art_filename = 'placeholder.png'; // Set a default filename
  }

  // Payload for API
  const payload = {
    name: album.value.name,
    genre_id: album.value.genre_id,
    artist_id: album.value.artist_id,
    no_of_tracks: album.value.no_of_tracks,
    year: album.value.year,
    studio: album.value.studio,
    status: album.value.status,
    songs: album.value.songs, // Array of selected song IDs
    album_art_base64: album.value.album_art_base64, // Optional
    album_art_filename: album.value.album_art_filename // Optional
  };

  try {
    const response = await fetch('https://a3h7foerhc.execute-api.ap-southeast-1.amazonaws.com/dev/addAlbum', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      successMessage.value = 'Album created successfully!';
      // Reset form
      album.value = {
        name: '',
        genre_id: null,
        artist_id: null,
        songs: [],
        no_of_tracks: 0,
        year: '',
        studio: '',
        status: 'released',
        album_art_base64: '',
        album_art_filename: ''
      };
    } else {
      const errorData = await response.json();
      errorMessage.value = `Error: ${errorData.message}`;
    }
  } catch (error) {
    errorMessage.value = `Error: ${error.message}`;
  }

  isSubmitting.value = false;
};

// Fetch genres, artists, and songs on component mount
fetchGenresArtistsAndSongs();
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

.form-input,
.form-select,
.form-file-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.form-input:focus,
.form-select:focus,
.form-file-input:focus {
  border-color: #333;
  outline: none;
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

.track-count {
  font-size: 16px;
  margin-bottom: 15px;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}

.success-message {
  color: green;
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
