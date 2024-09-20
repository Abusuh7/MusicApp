<template>
  <div class="song-container">
    <div class="song-header">
      <h2>Browse Songs</h2>
    </div>

    <!-- Notification Messages -->
    <transition name="fade" mode="out-in">
      <div v-if="successMessage" class="notification success">
        {{ successMessage }}
      </div>
    </transition>
    <transition name="fade" mode="in-out">
      <div v-if="errorMessage" class="notification error">
        {{ errorMessage }}
      </div>
    </transition>

    <!-- Loading Animation -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
    </div>

    <!-- Search Bar -->
    <div v-else>
      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by song name, artist, or genre..."
        />
      </div>

      <!-- Table for song list -->
      <div class="song-list-container">
        <div v-for="song in paginatedSongs" :key="song.id" class="song-row">
          <div class="song-thumbnail-info">
            <img :src="song.thumbnail_url" alt="Thumbnail" class="song-thumbnail" />
            <div class="song-info">
              <p class="song-title">{{ song.name }}</p>
              <p class="song-artist">{{ song.artist_name }}</p>
            </div>
          </div>
          <div class="song-actions">
            <button @click="playSong(song)" class="action-btn play-btn">
              <i class="fa-solid fa-play"></i>
            </button>
            <button @click="playSong(song)" class="action-btn like-btn">
              <i class="fa-regular fa-heart"></i>
            </button>
            <button @click="openModal(song)" class="action-btn add-btn">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button @click="previousPage" :disabled="currentPage === 1" class="pagination-btn">
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">
          Next
        </button>
      </div>
    </div>

    <!-- Media Player fixed at the bottom -->
    <div v-if="currentSong" class="media-player">
      <div class="media-info">
        <img :src="currentSong.thumbnail_url" alt="Thumbnail" class="w-16 h-16 rounded-full" />
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
      <div class="progress-bar">
        <input type="range" min="0" :max="audioDuration" v-model="currentTime" @input="seek" class="w-full" />
      </div>
      <audio ref="audioPlayer" class="w-full" @timeupdate="updateProgress" @ended="nextSong" />
    </div>

    <!-- Add Song Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3 class="modal-title">Select an Album</h3>
        <div class="custom-dropdown">
          <div
            v-for="album in albums"
            :key="album.ID"
            class="album-option"
            @click="selectAlbum(album)"
          >
            <img :src="album.ALBUM_ART" alt="Album Art" class="album-art" />
            <span>{{ album.NAME }}</span>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="addSongToAlbum" class="submit-btn">Add to Album</button>
          <button @click="closeModal" class="close-btn">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getCurrentUser } from "aws-amplify/auth";

const songs = ref([]);
const currentSong = ref(null);
const errorMessage = ref(null);
const successMessage = ref(null);
const searchQuery = ref("");
let isPlaying = ref(false);
let currentTime = ref(0);
let audioDuration = ref(0);
const isLoading = ref(true);
const userName = ref("");
const userId = ref("");
const albums = ref([]);

// Modal-related data
const showModal = ref(false);
const selectedSong = ref(null);
const selectedAlbum = ref(null);


// Pagination Variables
const currentPage = ref(1);
const itemsPerPage = 6;

// Fetch Songs
const fetchSongs = async () => {
  try {
    const response = await fetch("https://drj8e1e679.execute-api.ap-southeast-1.amazonaws.com/dev/songViewAll");
    songs.value = await response.json();
  } catch (error) {
    errorMessage.value = "Error fetching songs";
  } finally {
    isLoading.value = false;
  }
};

  // Fetch all albums and their songs
  const fetchAlbums = async (user_id) => {
    try {
      const response = await fetch(
        `https://4tvu26kjyf.execute-api.ap-southeast-1.amazonaws.com/dev/viewAllPerosnalAlbum?user_id=${user_id}`
      );
      const data = await response.json();
      albums.value = data;
    } catch (error) {
      errorMessage.value = "Error fetching albums";
    }
  };

  // Add Song to Album
const addSongToAlbum = async () => {
  if (selectedSong.value && selectedAlbum.value) {
    try {
      const response = await fetch(
        `https://4tvu26kjyf.execute-api.ap-southeast-1.amazonaws.com/dev/addSongPersonalAlbum?album_id=${selectedAlbum.value.ID}&song_id=${selectedSong.value.id}`,
        {
          method: "POST",
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Error adding song to album");
      }
    } catch (error) {
      console.error("Error adding song to album:", error);
      errorMessage.value = "Song already exists in the album.";
      return;
    }
    console.log(`Adding song ID: ${selectedSong.value.id} to album ID: ${selectedAlbum.value.ID}`);
    successMessage.value = `Song "${selectedSong.value.name}" added to album!`;
    closeModal();
  } else {
    errorMessage.value = "Please select an album.";
  }
};

  
  onMounted(async () => {
    try {
      const user = await getCurrentUser();
      userName.value = user.username;
      userId.value = user.userId;
  
      if (userId.value) {
        console.log("Fetching albums for user ID:", userId.value);
        fetchAlbums(userId.value);
      }else{
        console.log("User ID not found");
      }

    } catch (error) {
      console.error("Error fetching user:", error);
    }
  });

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

// Show Modal
const openModal = (song) => {
  selectedSong.value = song;
  showModal.value = true;
};

// Close Modal
const closeModal = () => {
  showModal.value = false;
  selectedSong.value = null;
  selectedAlbum.value = null;
};

// Select Album
const selectAlbum = (album) => {
  selectedAlbum.value = album;
};



const filteredSongs = computed(() => {
  return songs.value.filter(
    (song) =>
      song.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      song.artist_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Paginated Songs
const paginatedSongs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredSongs.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredSongs.value.length / itemsPerPage));

// Pagination control
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value += 1;
};

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value -= 1;
};

onMounted(() => {
  fetchSongs();
});
</script>

<style scoped>
/* Global Container */
.song-container {
  font-family: 'Poppins', sans-serif;
  background-color: #f6f6f6;
  padding: 20px;
  border-radius: 12px;
  max-width: 100;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

/* Header */
.song-header {
  margin-bottom: 20px;
}

.song-header h2 {
  font-size: 26px;
  color: #333;
  font-weight: 700;
  text-align: center;
}

/* Notification Messages */
.notification {
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
}

.success {
  background-color: #4caf50;
  color: white;
}

.error {
  background-color: #f44336;
  color: white;
}

/* Loading Spinner */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.spinner {
  border: 8px solid #f3f3f3;
  border-radius: 50%;
  border-top: 8px solid #1f2937;
  width: 50px;
  height: 50px;
  -webkit-animation: spin 1s linear infinite;
  animation: spin 1s linear infinite;
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
   100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Search Bar */
.search-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.search-bar input {
  width: 100%;
  max-width: 600px;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-bar input:focus {
  border-color: #1f2937;
}

/* Song List */
.song-list-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.song-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.song-thumbnail-info {
  display: flex;
  align-items: center;
}

.song-thumbnail {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 15px;
}

.song-info {
  display: flex;
  flex-direction: column;
}

.song-title {
  font-weight: bold;
  color: #333;
}

.song-artist {
  font-size: 14px;
  color: #888;
}

/* Action Buttons */
.song-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.action-btn {
  background-color: #2e3b4d;
  color: white;
  border: none;
  padding: 13px;
  border-radius: 100%;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #0056b3;
}

.play-btn i,
.like-btn i,
.add-btn i {
  font-size: 15px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-evenly;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 25px;
}

.pagination-btn {
  padding: 10px 20px;
  background-color: #2c3a4d;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pagination-btn:disabled {
  background-color: #ccc;
}

.pagination-btn:not(:disabled):hover {
  background-color: #1f2937;
}

.pagination span {
  font-size: 16px;
  margin-top: 10px;
}

/* Media Player (Fixed at the Bottom) */
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

/* Global Container */
.song-container {
  font-family: 'Poppins', sans-serif;
  background-color: #f6f6f6;
  padding: 20px;
  border-radius: 12px;
  max-width: 100;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

/* Album List */
.custom-dropdown {
  max-height: 250px;
  overflow-y: auto;
  padding-right: 5px;
}

.album-option {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.album-option:hover {
  background-color: #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.album-art {
  width: 50px;
  height: 50px;
  margin-right: 15px;
  border-radius: 8px;
  object-fit: cover;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.submit-btn,
.close-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  width: 45%;
}

.submit-btn {
  background-color: #2e3b4d;
  color: white;
}

.close-btn {
  background-color: #f44336;
  color: white;
}

.submit-btn:hover {
  background-color: #1f2835;
}

.close-btn:hover {
  background-color: #e53935;
}

/* Modal Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
