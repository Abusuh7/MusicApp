<template>
    <div class="container">
      <!-- Check if song data is available -->
      <div v-if="song">
        <h1>{{ song.name }}</h1>
        <img :src="song.thumbnail_url" alt="Thumbnail" class="thumbnail" />
        <p><strong>Artist:</strong> {{ song.artist_name }}</p>
        <p><strong>Genre:</strong> {{ song.genre_name }}</p>
        <p><strong>Duration:</strong> {{ song.duration }}</p>
  
        <!-- Audio player -->
        <audio ref="audioPlayer" controls>
          <source :src="song.song_url" type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      </div>
  
      <!-- Loading message -->
      <div v-else-if="loading">
        <p>Loading song details...</p>
      </div>
  
      <!-- Error message -->
      <div v-else-if="error">
        <p>{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  
  export default {
    setup() {
      const song = ref(null);
      const loading = ref(true);
      const error = ref(null);
      const route = useRoute(); // to access the songId from the URL query parameters
  
      const fetchSong = async () => {
        const songId = route.params.songId || 1; // Default songId if not provided
        try {
          const response = await fetch(
            `https://drj8e1e679.execute-api.ap-southeast-1.amazonaws.com/dev/songByID?songId=${songId}`
          );
          if (!response.ok) {
            throw new Error("Song not found");
          }
          const data = await response.json();
          song.value = data;
        } catch (err) {
          error.value = err.message;
        } finally {
          loading.value = false;
        }
      };
  
      onMounted(() => {
        fetchSong(); // Fetch song when component is mounted
      });
  
      return {
        song,
        loading,
        error,
      };
    },
  };
  </script>
  
  <style scoped>
  .container {
    font-family: Arial, sans-serif;
    padding: 20px;
  }
  
  .thumbnail {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
  }
  
  audio {
    margin-top: 10px;
    width: 100%;
  }
  </style>
  