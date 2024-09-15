<template>
  <div>
    <h2>Create Song</h2>
    <form @submit.prevent="createSong">
      <label for="name">Song Name:</label>
      <input v-model="song.name" type="text" id="name" required />

      <label for="genre">Genre:</label>
      <select v-model="song.genre_id" required>
        <option v-for="genre in genres" :key="genre.ID" :value="genre.ID">{{ genre.NAME }}</option>
      </select>

      <label for="artist">Artist:</label>
      <select v-model="song.artist_id" required>
        <option v-for="artist in artists" :key="artist.ID" :value="artist.ID">{{ artist.NAME }}</option>
      </select>

      <label for="songFile">Song File:</label>
      <input @change="onSongFileChange" type="file" id="songFile" accept="audio/*" required />
      <p v-if="uploading">Uploading song, please wait...</p>

      <label for="thumbnailFile">Thumbnail:</label>
      <input @change="onThumbnailFileChange" type="file" id="thumbnailFile" accept="image/*" required />

      <p v-if="song.duration">Duration: {{ song.duration }} seconds</p>

      <label for="status">Status:</label>
      <select v-model="song.status" required>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <button type="submit" :disabled="uploading">Create Song</button>
    </form>

    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const song = ref({
  name: '',
  genre_id: null,
  artist_id: null,
  songUrl: '',
  duration: null,
  status: 'active',
  thumbnailFile: null,
  thumbnailMimeType: '',  // Added MIME type field
});

const genres = ref([]);
const artists = ref([]);
const errorMessage = ref(null);
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

      console.log("uploadUrl", uploadUrl);
      console.log("songUrl", songUrl);

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
    genreId: song.value.genre_id,  // Changed to match Lambda expectation
    artistId: song.value.artist_id,  // Changed to match Lambda expectation
    songUrl: song.value.songUrl,
    thumbnailBase64: song.value.thumbnailFile,
    thumbnailMimeType: song.value.thumbnailMimeType,  // Added MIME type field
    duration: song.value.duration,
    status: song.value.status,
  };

  console.log("Sending payload:", payload);

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
      alert('Song created successfully!');
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
label {
  display: block;
  margin-top: 10px;
}

input,
select {
  margin-bottom: 10px;
}

button {
  margin-top: 10px;
}

p {
  color: red;
}
</style>
