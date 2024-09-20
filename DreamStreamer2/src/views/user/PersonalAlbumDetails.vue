<template>
    <div class="container">
      <div v-if="album" class="album-card">
        <!-- Album Art and Info -->
        <div class="album-header">
          <img :src="album.ALBUM_ART" alt="Album Art" class="album-art" />
          <div class="album-info">
            <h2 class="album-title">{{ album.NAME }}</h2>
            <p class="album-details">
              <strong>Tracks:</strong> {{ albumSongs.length }}
            </p>
            <div class="flex space-x-2">
              <button class="action-button" @click="openSongsModel">
                <i class="fa fa-plus"></i>
              </button>
  
              <button class="action-button edit-button" @click="openEditModel">
                <i class="fa fa-edit"></i>
              </button>
            </div>
          </div>
          <!-- Large Play Button for Album -->
          <button class="large-play-button" @click="playAlbum">
            <i class="fa fa-play"></i>
          </button>
        </div>
  
        <!-- Song List -->
        <div v-if="albumSongs.length" class="song-list-container">
          <h3 class="song-list-title">Songs</h3>
          <ul class="song-list">
            <li v-for="song in albumSongs" :key="song.ID" class="song-item">
              <div class="song-thumbnail">
                <img :src="song.THUMBNAIL_URL" alt="Song Thumbnail" />
              </div>
              <div class="song-details">
                <strong class="song-title">{{ song.NAME }}</strong>
                <span class="song-duration">{{ getArtistName(song.ARTIST_ID) }}</span>
              </div>
              <!-- Play button for each song -->
              <button class="small-play-button" @click="playSong(song)">
                <i class="fa fa-play"></i>
              </button>
              <button class="small-play-button" @click="removeSong(song.ID, albumId)">
                <i class="fa fa-trash"></i>
              </button>
            </li>
          </ul>
        </div>
  
        <!-- No Songs Message -->
        <div v-else class="song-list-container">
          <h3 class="song-list-title">No songs yet</h3>
        </div>
  
        <!-- Media Player Fixed at the Bottom -->
        <div v-if="currentSong" class="media-player">
          <div class="media-info">
            <img :src="currentSong.THUMBNAIL_URL" alt="Thumbnail" class="w-16 h-16 rounded-full" />
            <div class="song-details">
              <p class="song-name">{{ currentSong.NAME }}</p>
              <p class="artist-name">{{ getArtistName(currentSong.ARTIST_ID) }}</p>
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
          <audio ref="audioPlayer" class="w-full" @timeupdate="updateProgress" @ended="nextSong"></audio>
        </div>
      </div>
  
      <!-- Error or Loading States -->
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else class="loading-message">Loading...</div>
  
      <!-- Modal for Adding Songs -->
      <div v-if="showSongsModal" class="modal-overlay" @click.self="closeSongsModal">
        <div class="modal">
          <h3 class="modal-title">Add Songs to Album</h3>
  
          <!-- Search bar for filtering songs -->
          <div class="search-bar">
            <input v-model="songSearchQuery" type="text" placeholder="Search songs..." class="search-input" />
          </div>
  
          <!-- Scrollable song list -->
          <div class="scrollable-song-list">
            <div v-for="song in filteredSongs" :key="song.id" class="scrollable-song-item">
              <img :src="song.thumbnail_url" alt="Thumbnail" class="song-thumbnail" />
              <div class="song-info">
                <strong>{{ song.name }}</strong>
                <span>{{ song.artist_name }}</span>
              </div>
              <button class="small-add-button" @click="addSongToAlbum(song.id)">
                Add
              </button>
            </div>
          </div>
  
          <button @click="closeSongsModal" class="close-btn">Close</button>
        </div>
      </div>
  
      <!-- Modal for Editing Album Name -->
      <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
        <div class="modal">
          <h3>Edit Album Name</h3>
          <div class="mb-4">
            <label for="albumName" class="block text-sm font-medium text-gray-700">Album Name</label>
            <input type="text" v-model="editedAlbumName" id="albumName" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <button @click="updateAlbumName" class="update-btn">Update Album Name</button>
          <button @click="closeEditModal" class="close-btn">Close</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from "vue";
  import { useRoute } from "vue-router";
  
  const album = ref(null);
  const albumSongs = ref([]);
  const error = ref(null);
  const currentSong = ref(null);
  const isPlaying = ref(false);
  const audioDuration = ref(0);
  const currentTime = ref(0);
  const route = useRoute();
  const genres = ref([]);
  const artists = ref([]);
  const audioPlayer = ref(null);
  const albumId = ref(null);
  const songs = ref([]);
  const songSearchQuery = ref("");
  
  // Modal state management
  const showSongsModal = ref(false);
  const showEditModal = ref(false);
  const editedAlbumName = ref("");
  
  // Fetch album details by albumId from the Lambda API
  const fetchAlbum = async (albumId) => {
    try {
      const response = await fetch(
        `https://4tvu26kjyf.execute-api.ap-southeast-1.amazonaws.com/dev/viewAlbumById?album_id=${albumId}`
      );
      const data = await response.json();
      album.value = data.album;
      albumSongs.value = data.songs || []; // Make sure albumSongs is an array
      editedAlbumName.value = album.value.NAME; // Initialize with current album name
    } catch (err) {
      error.value = "Error fetching album: " + err.message;
    }
  };
  
  // Open the modal to add songs
  const openSongsModel = () => {
    showSongsModal.value = true;
  };
  
  // Close the modal to add songs
  const closeSongsModal = () => {
    showSongsModal.value = false;
  };
  
  // Open the modal to edit album name
  const openEditModel = () => {
    showEditModal.value = true;
  };
  
  // Close the modal to edit album name
  const closeEditModal = () => {
    showEditModal.value = false;
  };
  
  // Update album name
  const updateAlbumName = () => {
    album.value.NAME = editedAlbumName.value;
    closeEditModal();
  };
  
  // Filtered Songs for the modal search
  const filteredSongs = computed(() => {
    return songs.value.filter((song) =>
      song.name.toLowerCase().includes(songSearchQuery.value.toLowerCase()) ||
      song.artist_name.toLowerCase().includes(songSearchQuery.value.toLowerCase())
    );
  });
  
  // Add song to album
  const addSongToAlbum = async (songId) => {
    try {
      const response = await fetch(
        `https://4tvu26kjyf.execute-api.ap-southeast-1.amazonaws.com/dev/addSongPersonalAlbum?album_id=${albumId.value}&song_id=${songId}`,
        {
          method: "POST",
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Error adding song to album");
      }
      fetchAlbum(albumId.value);
    } catch (error) {
      console.error("Error adding song to album:", error);
      errorMessage.value = "Song already exists in the album.";
      return;
    }
    // You can implement the actual logic here
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
    }
  };
  
  // Remove a song from the album
  const removeSong = async (songId, albumId) => {
    try {
      const response = await fetch(
        `https://4tvu26kjyf.execute-api.ap-southeast-1.amazonaws.com/dev/deleteSongFromAlbum?song_id=${songId}&album_id=${albumId}`,
        {
          method: "DELETE",
        }
      );
      albumSongs.value = albumSongs.value.filter((song) => song.ID !== songId);
    } catch (err) {
      error.value = "Error removing song: " + err.message;
    }
  };
  
  // Play the entire album (first song)
  const playAlbum = () => {
    if (albumSongs.value.length > 0) {
      playSong(albumSongs.value[0]);
    }
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
  
  // Get artist name based on artistId
  const getArtistName = (artistId) => {
    const artist = artists.value.find((a) => a.ID === artistId);
    return artist ? artist.NAME : "Unknown Artist";
  };
  
  // Play a specific song
  const playSong = (song) => {
    currentSong.value = song;
    const audio = audioPlayer.value;
    audio.src = song.SONG_URL;
    audio.play();
    isPlaying.value = true;
    audio.onloadedmetadata = () => {
      audioDuration.value = audio.duration;
    };
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    const audio = audioPlayer.value;
    if (isPlaying.value) {
      audio.pause();
    } else {
      audio.play();
    }
    isPlaying.value = !isPlaying.value;
  };
  
  // Update progress bar
  const updateProgress = () => {
    currentTime.value = audioPlayer.value.currentTime;
  };
  
  // Seek functionality
  const seek = () => {
    audioPlayer.value.currentTime = currentTime.value;
  };
  
  // Go to next song
  const nextSong = () => {
    const currentIndex = albumSongs.value.findIndex(
      (song) => song.ID === currentSong.value.ID
    );
    const nextIndex = (currentIndex + 1) % albumSongs.value.length;
    playSong(albumSongs.value[nextIndex]);
  };
  
  // Go to previous song
  const previousSong = () => {
    const currentIndex = albumSongs.value.findIndex(
      (song) => song.ID === currentSong.value.ID
    );
    const previousIndex = (currentIndex - 1 + albumSongs.value.length) % albumSongs.value.length;
    playSong(albumSongs.value[previousIndex]);
  };
  
  // Fetch the album on component mount
  onMounted(() => {
    albumId.value = route.params.albumId;
    fetchAlbum(albumId.value);
    fetchGenresAndArtists();
    fetchSongs();
  });
  </script>
  
  <style scoped>
  /* Your existing styles */
  .container {
    font-family: "Arial", sans-serif;
    background-color: #ebebeb;
    padding: 10px;
    max-width: 100%;
    margin: 0 auto;
    color: #333;
  }
  
  .album-card {
    background-color: #ffffff84;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
  
  .album-header {
    display: flex;
    align-items: center;
    position: relative;
  }
  
  .album-art {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
    margin-right: 20px;
  }
  
  .album-info {
    flex: 1;
  }
  
  .album-title {
    font-size: 24px;
    margin: 0;
    color: #333;
  }
  
  .album-details {
    color: #666;
    line-height: 1.6;
  }
  
  /* Button Styling */
  .action-button {
    display: inline-flex;
    align-items: center;
    background-color: #222936;
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .action-button:hover {
    background-color: #45a049;
  }
  
  .edit-button {
    background-color: #222936;
  }
  
  .edit-button:hover {
    background-color: #e67e22;
  }
  
  /* Large Play Button */
  .large-play-button {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background-color: #222936;
    color: white;
    border: none;
    font-size: 36px;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  
  /* Modal Styling */
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
    z-index: 1000;
  }
  
  .modal {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 500px;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  
  .close-btn,
  .update-btn {
    background-color: #e74c3c;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    margin-top: 10px;
  }
  
  .update-btn {
    background-color: #222936;
    margin-bottom: 10px;
  }
  
  .search-bar {
    margin-bottom: 15px;
  }
  
  .search-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
  }
  
  .scrollable-song-list {
    max-height: 250px;
    overflow-y: auto;
    margin-bottom: 15px;
  }
  
  .scrollable-song-item {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #f1f1f1;
    margin-bottom: 10px;
    border-radius: 5px;
  }
  
  .scrollable-song-item img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
    margin-right: 10px;
  }
  
  .song-info {
    display: flex;
    flex-direction: column;
  }

  .song-info strong {
    font-size: 16px;
    color: #333;
    margin-right: 10px;
  }
  
  .small-add-button {
    background-color: #222936;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    margin-left: auto;
  }
  
  /* Song List and Media Player Styles (same as your original) */
  .song-list-container {
    margin-top: 30px;
  }
  
  .song-list-title {
    font-size: 20px;
    margin-bottom: 10px;
  }
  
  .song-list {
    list-style: none;
    padding: 0;
  }
  
  .song-item {
    display: flex;
    align-items: center;
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  .song-thumbnail img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
    margin-right: 20px;
  }
  
  .song-details {
    flex: 1;
  }
  
  .song-title {
    font-size: 16px;
    color: #333;
  }
  
  .song-duration {
    color: #888;
    font-size: small;
  }
  
  .small-play-button {
    background-color: #222936;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin: 5px;
  }
  
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
  </style>
  