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
              <button class="action-button">
                <i class="fa fa-plus"></i>
              </button>
  
              <button class="action-button edit-button">
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
                <span class="song-duration">({{ song.DURATION }} seconds)</span>
              </div>
              <!-- Play button for each song -->
              <button class="small-play-button" @click="playSong(song)">
                <i class="fa fa-play"></i>
              </button>
              <button
                class="small-play-button"
                @click="removeSong(song.ID, albumId)"
              >
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
            <img
              :src="currentSong.THUMBNAIL_URL"
              alt="Thumbnail"
              class="w-16 h-16 rounded-full"
            />
            <div class="song-details">
              <p class="song-name">{{ currentSong.NAME }}</p>
              <p class="artist-name">
                {{ getArtistName(currentSong.ARTIST_ID) }}
              </p>
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
          ></audio>
        </div>
      </div>
  
      <!-- Error or Loading States -->
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else class="loading-message">Loading...</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
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
  
  // Fetch album details by albumId from the Lambda API
  const fetchAlbum = async (albumId) => {
    try {
      const response = await fetch(
        `https://4tvu26kjyf.execute-api.ap-southeast-1.amazonaws.com/dev/viewAlbumById?album_id=${albumId}`
      );
      const data = await response.json();
      album.value = data.album;
      albumSongs.value = data.songs || []; // Make sure albumSongs is an array
    } catch (err) {
      error.value = "Error fetching album: " + err.message;
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
      const data = await response.json();
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
    const previousIndex =
      (currentIndex - 1 + albumSongs.value.length) % albumSongs.value.length;
    playSong(albumSongs.value[previousIndex]);
  };
  
  // Fetch the album on component mount
  onMounted(() => {
    albumId.value = route.params.albumId; // Default to albumId=1 if not provided
    fetchAlbum(albumId.value);
  });
  
  onMounted(() => {
    fetchGenresAndArtists();
  });
  </script>
  
  <style scoped>
  .container {
    font-family: "Arial", sans-serif;
    background-color: #f9f9f9;
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
  
  /* Song List and Media Player Styles (kept the same) */
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
    margin-left: 10px;
  }
  
  /* Small Play Button for Each Song */
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
  </style>
  