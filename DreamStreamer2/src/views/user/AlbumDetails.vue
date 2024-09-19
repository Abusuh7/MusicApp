<template>
    <UserNavbar />
    <div class="container">
      <div v-if="album" class="album-card">
        <!-- Album Art and Info -->
        <div class="album-header">
          <img :src="album.albumArt" alt="Album Art" class="album-art" />
          <div class="album-info">
            <h2 class="album-title">{{ album.albumName }}</h2>
            <p class="album-details">
              <strong>Artist:</strong> {{ getArtistName(album.artistId) }}<br />
              <strong>Genre:</strong> {{ getGenreName(album.genreId) }}<br />
              <strong>Release Year:</strong> {{ formatDate(album.releaseYear) }}<br />
              <strong>Tracks:</strong> {{ album.noOfTracks }}
            </p>
          </div>
          <!-- Large Play Button for Album -->
          <button class="large-play-button" @click="playAlbum">
            <i class="fa fa-play"></i>
          </button>
        </div>
  
        <!-- Song List -->
        <div v-if="album.songs.length" class="song-list-container">
          <h3 class="song-list-title">Songs</h3>
          <ul class="song-list">
            <li v-for="song in album.songs" :key="song.songId" class="song-item">
              <div class="song-thumbnail">
                <img :src="song.thumbnailUrl" alt="Song Thumbnail" />
              </div>
              <div class="song-details">
                <strong class="song-title">{{ song.songName }}</strong>
                <span class="song-duration">({{ song.duration }} seconds)</span>
              </div>
              <!-- Play button for each song -->
              <button class="small-play-button" @click="playSong(song)">
                <i class="fa fa-play"></i>
              </button>
            </li>
          </ul>
        </div>
  
        <!-- Media Player Fixed at the Bottom (Reference Media Player) -->
        <div v-if="currentSong" class="media-player">
          <div class="media-info">
            <img :src="currentSong.thumbnailUrl" alt="Thumbnail" class="w-16 h-16 rounded-full" />
            <div class="song-details">
              <p class="song-name">{{ currentSong.songName }}</p>
              <p class="artist-name">{{ getArtistName(album.artistId) }}</p>
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
    </div>
  </template>
  
  <script setup>
import UserNavbar from '@/components/UserComponents/UserNavbar.vue';
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  const album = ref(null);
  const error = ref(null);
  const currentSong = ref(null);
  const isPlaying = ref(false);
  const audioDuration = ref(0);
  const currentTime = ref(0);
  const genres = ref([]);
  const artists = ref([]);
  const route = useRoute();
  const audioPlayer = ref(null);
  
  // Fetch album details by albumId from the Lambda API
  const fetchAlbum = async (albumId) => {
    try {
      const response = await fetch(`https://a3h7foerhc.execute-api.ap-southeast-1.amazonaws.com/dev/albumById?albumId=${albumId}`);
      const albums = await response.json();
      if (albums.length > 0) {
        album.value = albums[0];
      } else {
        error.value = 'No album found';
      }
    } catch (err) {
      error.value = 'Error fetching album: ' + err.message;
    }
  };
  
  // Fetch genres and artists for dropdowns
  const fetchGenresAndArtists = async () => {
    const genreResponse = await fetch('https://e8ft24nt6g.execute-api.ap-southeast-1.amazonaws.com/dev/genreViewAll');
    genres.value = await genreResponse.json();
  
    const artistResponse = await fetch('https://x6krsc98il.execute-api.ap-southeast-1.amazonaws.com/dev/viewallartist');
    artists.value = await artistResponse.json();
  };
  
  // Get artist name based on artistId
  const getArtistName = (artistId) => {
    const artist = artists.value.find((a) => a.ID === artistId);
    return artist ? artist.NAME : 'Unknown Artist';
  };
  
  // Get genre name based on genreId
  const getGenreName = (genreId) => {
    const genre = genres.value.find((g) => g.ID === genreId);
    return genre ? genre.NAME : 'Unknown Genre';
  };
  
  // Format release year (assuming it's a date string)
  const formatDate = (releaseYear) => {
    return new Date(releaseYear).getFullYear();
  };
  
  // Play the entire album (first song)
  const playAlbum = () => {
    if (album.value && album.value.songs.length > 0) {
      playSong(album.value.songs[0]);
    }
  };
  
  // Play a specific song
  const playSong = (song) => {
    currentSong.value = song;
    const audio = audioPlayer.value;
    audio.src = song.songUrl;
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
  
  // Seek to new position in song
  const seek = () => {
    audioPlayer.value.currentTime = currentTime.value;
  };
  
  // Fetch the album on component mount
  onMounted(() => {
    const albumId = route.params.albumId || 1; // Default to albumId=1 if not provided
    fetchAlbum(albumId);
  });
  
  // Fetch genres and artists when the component is mounted
  onMounted(() => {
    fetchGenresAndArtists();
  });
  </script>
  
  <style scoped>
  .container {
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f4;
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
    margin-bottom: 10px;
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
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
  