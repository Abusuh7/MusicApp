<template>
      <div>
        <h2>Albums</h2>
  
        <!-- Search Bar -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by album name, artist, or genre..."
          class="search-bar"
        />
  
        <!-- Album grid display -->
        <div class="album-grid">
          <div v-for="album in paginatedAlbums" :key="album.albumId" class="album-card">
            <img
              v-if="album.albumArt"
              :src="album.albumArt"
              alt="Album Art"
              class="album-art"
              @click="selectAlbum(album.albumId)"
            />
            <span v-else>No Image</span>
            <h3>{{ album.albumName }}</h3>
          </div>
        </div>
  
        <!-- Pagination controls -->
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
        </div>
         
  
        <!-- Media Player fixed at the bottom -->
        <div v-if="currentSong" class="media-player">
          <div class="media-info">
            <img :src="currentSong.thumbnailUrl" alt="Thumbnail" class="w-16 h-16 rounded-full" />
            <div class="song-details">
              <p class="song-name">{{ currentSong.songName }}</p>
              <p class="artist-name">{{ getArtistName(selectedAlbum.artistId) }}</p>
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
  </template>
  
  
  <script setup>
  import router from '@/router';
import { ref, computed, onMounted } from 'vue';
  
  const albums = ref([]);
  const currentSong = ref(null);
  const searchQuery = ref('');
  const errorMessage = ref(null);
  const currentPage = ref(1);
  const itemsPerPage = 20;
  const artists = ref([]);
  const genres = ref([]);
  const allSongs = ref([]);
  let isPlaying = ref(false);
  let currentTime = ref(0);
  let audioDuration = ref(0);
  
  // Fetch all albums and their songs
  const fetchAlbums = async () => {
    try {
      const response = await fetch('https://a3h7foerhc.execute-api.ap-southeast-1.amazonaws.com/dev/viewAllAlbums');
      const data = await response.json();
      albums.value = data;
    } catch (error) {
      errorMessage.value = 'Error fetching albums';
    }
  };
  
  // Fetch all songs to add
  const fetchAllSongs = async () => {
    try {
      const response = await fetch('https://drj8e1e679.execute-api.ap-southeast-1.amazonaws.com/dev/songViewAll');
      const data = await response.json();
      allSongs.value = data;
    } catch (error) {
      errorMessage.value = 'Error fetching songs';
    }
  };
  
  // Fetch genres and artists for dropdowns
  const fetchGenresAndArtists = async () => {
    const genreResponse = await fetch('https://e8ft24nt6g.execute-api.ap-southeast-1.amazonaws.com/dev/genreViewAll');
    genres.value = await genreResponse.json();
  
    const artistResponse = await fetch('https://x6krsc98il.execute-api.ap-southeast-1.amazonaws.com/dev/viewallartist');
    artists.value = await artistResponse.json();
  };
  
  // Filter and paginate albums based on search query and pagination
  const filteredAlbums = computed(() => {
    return albums.value.filter(album =>
      album.albumName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      getArtistName(album.artistId).toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      getGenreName(album.genreId).toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
  
  const totalPages = computed(() => Math.ceil(filteredAlbums.value.length / itemsPerPage));
  
  const paginatedAlbums = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredAlbums.value.slice(start, end);
  });
  
  // Pagination control
  const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value += 1;
  };
  
  const prevPage = () => {
    if (currentPage.value > 1) currentPage.value -= 1;
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
  
  // Format release year date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.getFullYear();
  };
  
  // Select an album and show its details
  const selectAlbum = (albumId) => {
    router.push({ name: 'albumdetails', params: { albumId } });
  };

  
  // Play a specific song using the media player
  const playSong = (song) => {
    currentSong.value = song;
    const audioPlayer = document.querySelector('audio');
    if (audioPlayer) {
      audioPlayer.src = song.songUrl;
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
    const currentIndex = selectedAlbum.value.songs.findIndex(song => song.songId === currentSong.value.songId);
    const nextIndex = (currentIndex + 1) % selectedAlbum.value.songs.length;
    playSong(selectedAlbum.value.songs[nextIndex]);
  };
  
  // Go to previous song
  const previousSong = () => {
    const currentIndex = selectedAlbum.value.songs.findIndex(song => song.songId === currentSong.value.songId);
    const previousIndex = (currentIndex - 1 + selectedAlbum.value.songs.length) % selectedAlbum.value.songs.length;
    playSong(selectedAlbum.value.songs[previousIndex]);
  };
  
  // Fetch albums, genres, and artists when the component is mounted
  onMounted(() => {
    fetchAlbums();
    fetchGenresAndArtists();
    fetchAllSongs();
  });
  </script>
  
  <style scoped>
  .album-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .album-card {
    width: 150px;
    text-align: center;
    cursor: pointer;
  }
  
  .album-art {
    border-radius: 10px;
    transition: transform 0.3s ease;
  }
  
  .album-art:hover {
    transform: scale(1.05);
  }
  
  /* Modal Styles */
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
    max-width: 90%;
    max-height: 90%;
    overflow-y: auto;
  }
  
  .modal-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
  }
  
  .song-list {
    margin-top: 1rem;
    padding-left: 1rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .form-group input,
  .form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 20px;
  }
  
  .close-modal-btn,
  .edit-btn,
  .delete-btn {
    background-color: #333;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    text-align: center;
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
    gap: 10px;
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
  
  .search-bar {
    margin-bottom: 20px;
    padding: 10px;
    width: 100%;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }
  
  button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #333;
    color: white;
  }
  </style>