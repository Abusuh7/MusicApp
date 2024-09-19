<template>
    <div>
      <!-- Show loading spinner while fetching data -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
      </div>
  
      <!-- Once data is loaded, display the content -->
      <div v-else>
        <div class="album-header">
          <h2>Frequently Listened</h2>
          <b><a href="/moresongs" class="show-all">Show all</a></b>
        </div>
    
        <!-- Album grid display (horizontal scroll) -->
        <div class="album-grid-horizontal">
          <div v-for="song in songs" :key="song.id" @click="playSong(song)" class="album-card">
            <div class="album-art-container">
              <img
                v-if="song.thumbnail_url"
                :src="song.thumbnail_url"
                alt="Album Art"
                class="album-art"
              />
              <span v-else>No Image</span>
              <div class="play-icon">
                <i class="fa fa-play"></i>
              </div>
            </div>
    
            <!-- Album Name and Artist -->
            <div class="album-info">
              <h3 class="album-name">{{ song.name }}</h3>
              <p class="artist-name">{{ song.artist_name }}</p>
            </div>
          </div>
        </div>
    
        <!-- Media Player fixed at the bottom -->
        <div v-if="currentSong" class="media-player">
          <div class="media-info">
            <img
              :src="currentSong.thumbnail_url"
              alt="Thumbnail"
              class="w-16 h-16 rounded-full"
            />
            <div class="song-details">
              <p class="song-name">{{ currentSong.name }}</p>
              <p class="artist-name">{{ currentSong.artist_name }}</p>
            </div>
          </div>
          <div class="media-controls">
            <button @click="previousSong" class="control-btn">
              <i class="fa-solid fa-backward"></i>
            </button>
            <button @click="togglePlayPause" class="control-btn">
              <font-awesome-icon v-if="isPlaying" :icon="['fas', 'pause']" />
              <font-awesome-icon v-else :icon="['fas', 'play']" />
            </button>
            <button @click="nextSong" class="control-btn">
              <i class="fa-solid fa-forward"></i>
            </button>
          </div>
          <!-- Progress bar -->
          <div class="progress-bar">
            <input
              type="range"
              min="0"
              :max="audioDuration"
              v-model="currentTime"
              @input="seek"
              class="w-full"
            />
          </div>
          <audio
            ref="audioPlayer"
            class="w-full"
            @timeupdate="updateProgress"
            @ended="nextSong"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from "vue-router";
  import { ref, onMounted } from "vue";
  
  const router = useRouter();
  
  const songs = ref([]);
  const artists = ref([]);
  const genres = ref([]);
  const errorMessage = ref("");
  const currentSong = ref(null);
  let isPlaying = ref(false);
  let currentTime = ref(0);
  let audioDuration = ref(0);
  let loading = ref(true); // Loading state
  
  const selectAlbum = (songId) => {
    console.log("Song clicked: ", songId);
    router.push({ name: "songdetails", params: { songId } });
  };
  
  // Fetch genres and artists for dropdowns
  const fetchGenresAndArtists = async () => {
    const genreResponse = await fetch(
      "https://e8ft24nt6g.execute-api.ap-southeast-1.amazonaws.com/dev/genreViewAll"
    );
    genres.value = await genreResponse.json();
  
    const artistResponse = await fetch(
      "https://x6krsc98il.execute-api.ap-southeast-1.amazonaws.com/dev/viewallartist"
    );
    artists.value = await artistResponse.json();
  };
  
  // Fetch songs from the API
  const fetchSongs = async () => {
    try {
      const response = await fetch(
        "https://drj8e1e679.execute-api.ap-southeast-1.amazonaws.com/dev/songViewAll"
      );
      songs.value = await response.json();
    } catch (error) {
      errorMessage.value = "Error fetching songs";
    } finally {
      // Stop loading spinner once songs are fetched
      loading.value = false;
    }
  };
  
  // Play a selected song
  const playSong = (song) => {
    currentSong.value = song;
    const audioPlayer = document.querySelector('audio');
    if (audioPlayer) {
      audioPlayer.src = song.song_url;
      audioPlayer.play();
      isPlaying.value = true;
    }
    audioPlayer.addEventListener('loadedmetadata', () => {
      audioDuration.value = audioPlayer.duration;
    });
  };
  
  // Toggle play/pause functionality
  const togglePlayPause = () => {
    const audioPlayer = document.querySelector('audio');
    if (isPlaying.value) {
      audioPlayer.pause();
    } else {
      audioPlayer.play();
    }
    isPlaying.value = !isPlaying.value;
  };
  
  // Update progress bar
  const updateProgress = () => {
    const audioPlayer = document.querySelector('audio');
    currentTime.value = audioPlayer.currentTime;
  };
  
  // Seek functionality
  const seek = () => {
    const audioPlayer = document.querySelector('audio');
    audioPlayer.currentTime = currentTime.value;
  };
  
  // Go to next song
  const nextSong = () => {
    const currentIndex = songs.value.findIndex(song => song.id === currentSong.value.id);
    const nextIndex = (currentIndex + 1) % songs.value.length;
    playSong(songs.value[nextIndex]);
  };
  
  // Go to previous song
  const previousSong = () => {
    const currentIndex = songs.value.findIndex(song => song.id === currentSong.value.id);
    const previousIndex = (currentIndex - 1 + songs.value.length) % songs.value.length;
    playSong(songs.value[previousIndex]);
  };
  
  // Fetch albums, genres, and artists when the component is mounted
  onMounted(() => {
    fetchSongs();
    fetchGenresAndArtists();
  });
  </script>
  
  <style scoped>
  /* Header with Show all link */
  .album-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .album-header h2 {
    color: #000000;
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .show-all {
    color: #292929;
    font-size: 0.875rem;
    text-decoration: none;
    transition: color 0.3s;
  }
  
  .show-all:hover {
    color: #000000;
  }
  
  /* Horizontal scrolling album grid */
  .album-grid-horizontal {
    background-color: rgb(242, 242, 242);
    display: flex;
    gap: 20px;
    overflow-x: auto;
    padding: 10px;
    margin-bottom: 30px;
    scrollbar-width: none; /* Hide scrollbar in Firefox */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  
  .album-grid-horizontal::-webkit-scrollbar {
    display: none; /* Hide scrollbar in Chrome, Safari, and Edge */
  }
  
  .album-card {
    width: 180px;
    flex-shrink: 0;
    cursor: pointer;
    text-align: left;
    transition: transform 0.3s ease;
  }
  
  .album-card:hover {
    transform: scale(1.05);
  }
  
  .album-art-container {
    position: relative;
    width: 100%;
    height: 180px;
  }
  
  .album-art {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    object-fit: cover;
  }
  
  .play-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 36px;
    color: white;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .album-art-container:hover .play-icon {
    opacity: 1;
  }
  
  .album-art-container:hover .album-art {
    filter: brightness(70%);
  }
  
  .album-info {
    margin-top: 10px;
  }
  
  .album-name {
    color: #000000;
    font-size: 1rem;
    font-weight: bold;
  }
  
  .artist-name {
    color: #999;
    font-size: 0.875rem;
  }
  
  /* Media Player Styles */
  .media-player {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #333;
    color: white;
    padding: 10px;
    display: flex;
    align-items: center;
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }
  
  .media-info {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
  
  .media-info img {
    height: 50px;
    width: 50px;
    margin-right: 10px;
    border-radius: 5px;
  }
  
  .song-details {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .song-name {
    font-weight: bold;
    font-size: 1.2rem;
  }
  
  .artist-name {
    color: #aaa;
  }
  
  .media-controls {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .control-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  .progress-bar {
    margin-left: 20px;
    flex-grow: 1;
  }
  
  audio {
    display: none;
  }
  
  /* Loading Spinner */
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .spinner {
    border: 8px solid #f3f3f3;
    border-top: 8px solid #1f2937;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>
  