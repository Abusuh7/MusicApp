<template>
  <AdminHomeTest>
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
            @click="selectAlbum(album)"
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

      <!-- Album Details Modal -->
      <div v-if="selectedAlbum" class="modal-overlay">
        <div class="modal album-modal">
          <h3 class="modal-title">{{ selectedAlbum.albumName }}</h3>
          <p><strong>Artist:</strong> {{ getArtistName(selectedAlbum.artistId) }}</p>
          <p><strong>Genre:</strong> {{ getGenreName(selectedAlbum.genreId) }}</p>
          <p><strong>Number of Tracks:</strong> {{ selectedAlbum.noOfTracks }}</p>
          <p><strong>Release Year:</strong> {{ formatDate(selectedAlbum.releaseYear) }}</p>

          <!-- Songs list -->
          <ul class="song-list">
            <li v-for="song in selectedAlbum.songs" :key="song.songId" class="song-item">
              <div class="song-info">
                <strong>{{ song.songName }}</strong> ({{ song.duration }} sec)
              </div>
              <div class="song-actions">
                <button @click="playSong(song)" class="play-btn">Play</button>
              </div>
            </li>
          </ul>

          <!-- Actions -->
          <div class="modal-buttons">
            <button @click="editAlbum(selectedAlbum)" class="edit-btn">Edit</button>
            <button @click="deleteAlbum(selectedAlbum.albumId)" class="delete-btn">Delete</button>
            <button @click="closeModal" class="close-modal-btn">Close</button>
          </div>
        </div>
      </div>

      <!-- Edit Album Modal -->
      <div v-if="isEditing" class="modal-overlay">
        <div class="modal scrollable-modal album-edit-modal">
          <h3 class="modal-title">Edit Album: {{ albumToEdit.albumName }}</h3>

          <div class="form-group">
            <label for="name">Album Name:</label>
            <input v-model="albumToEdit.albumName" type="text" required />
          </div>

          <div class="form-group">
            <label for="artist">Artist:</label>
            <select v-model="albumToEdit.artistId" required>
              <option v-for="artist in artists" :key="artist.ID" :value="artist.ID">{{ artist.NAME }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="genre">Genre:</label>
            <select v-model="albumToEdit.genreId" required>
              <option v-for="genre in genres" :key="genre.ID" :value="genre.ID">{{ genre.NAME }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="year">Release Year:</label>
            <input v-model="albumToEdit.year" type="date" required />
          </div>

          <div class="form-group">
            <label for="studio">Studio:</label>
            <input v-model="albumToEdit.studio" type="text" required />
          </div>

          <div class="form-group">
            <label for="status">Status:</label>
            <select v-model="albumToEdit.status" required>
              <option value="released">Released</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div class="form-group">
            <label for="album_art">Album Art (optional):</label>
            <input type="file" @change="onAlbumArtFileChange" accept="image/*" />
          </div>

          <!-- Current Songs in Album -->
          <div class="form-group">
            <label for="songs">Current Songs in Album:</label>
            <ul class="current-songs-list">
              <li v-for="song in albumToEdit.songs" :key="song.songId" class="song-item">
                <div class="song-info">
                  <strong>{{ song.songName }}</strong>
                </div>
                <div class="song-actions">
                  <button @click="removeSong(song)" class="remove-song-btn">Remove</button>
                </div>
              </li>
            </ul>
          </div>

          <!-- Add New Songs -->
          <div class="form-group">
            <label for="new-songs">Add Songs:</label>
            <select v-model="selectedNewSongs" multiple>
              <option v-for="song in availableSongs" :key="song.id" :value="song.id">
                {{ song.name }}
              </option>
            </select>
          </div>

          <p v-if="albumToEdit.songs.length === 0">No songs left. The album will be deleted.</p>

          <div class="modal-buttons">
            <button @click="saveAlbum">Save</button>
            <button @click="cancelEdit">Cancel</button>
          </div>
        </div>
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
  </AdminHomeTest>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import AdminHomeTest from '@/layouts/AdminHomeTest.vue';

const albums = ref([]);
const selectedAlbum = ref(null);
const currentSong = ref(null);
const isEditing = ref(false);
const albumToEdit = ref(null);
const searchQuery = ref('');
const errorMessage = ref(null);
const currentPage = ref(1);
const itemsPerPage = 30;
const artists = ref([]);
const genres = ref([]);
const allSongs = ref([]);
let selectedNewSongs = ref([]);
let albumArtBase64 = '';
let albumArtFilename = '';
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

// Handle album art file change
const onAlbumArtFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      albumArtBase64 = reader.result.split(',')[1];
      albumArtFilename = file.name;
    };
  }
};

// Filter available songs that are not already in the album
const availableSongs = computed(() => {
  const albumSongIds = albumToEdit.value?.songs.map(song => song.songId) || [];
  return allSongs.value.filter(song => !albumSongIds.includes(song.id));
});

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
const selectAlbum = (album) => {
  selectedAlbum.value = album;
};

// Close the modal and stop the media player
const closeModal = () => {
  selectedAlbum.value = null;
  currentSong.value = null;
  isPlaying.value = false;
  const audioPlayer = document.querySelector('audio');
  if (audioPlayer) {
    audioPlayer.pause();
  }
  isEditing.value = false;
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

// Delete an album
const deleteAlbum = async (albumId) => {
  if (confirm('Are you sure you want to delete this album?')) {
    try {
      await fetch(`https://a3h7foerhc.execute-api.ap-southeast-1.amazonaws.com/dev/deleteAlbum?albumId=${albumId}`, {
        method: 'DELETE',
      });
      fetchAlbums();
      selectedAlbum.value = null;
    } catch (error) {
      errorMessage.value = 'Error deleting album';
    }
  }
};

// Edit an album
const editAlbum = (album) => {
  albumToEdit.value = { ...album };
  isEditing.value = true;
};

// Remove a song from the album
const removeSong = (song) => {
  albumToEdit.value.songs = albumToEdit.value.songs.filter(s => s.songId !== song.songId);
  if (albumToEdit.value.songs.length === 0) {
    deleteAlbum(albumToEdit.value.albumId);
    isEditing.value = false;
  }
};

// Save the edited album
const saveAlbum = async () => {
  if (albumToEdit.value.songs.length === 0) {
    await deleteAlbum(albumToEdit.value.albumId);
  } else {
    const payload = {
      name: albumToEdit.value.albumName,
      genre_id: albumToEdit.value.genreId,
      artist_id: albumToEdit.value.artistId,
      year: albumToEdit.value.year,
      studio: albumToEdit.value.studio,
      status: albumToEdit.value.status,
      updatedSongs: albumToEdit.value.songs.map(song => song.songId).concat(selectedNewSongs.value),
      album_art_base64: albumArtBase64 || null,
      album_art_filename: albumArtFilename || null,
    };

    try {
      const response = await fetch(`https://a3h7foerhc.execute-api.ap-southeast-1.amazonaws.com/dev/updateAlbum?albumId=${albumToEdit.value.albumId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save album.');
      }

      await fetchAlbums();
      isEditing.value = false;
    } catch (error) {
      errorMessage.value = error.message || 'Error saving album';
    }
  }
};

// Cancel edit
const cancelEdit = () => {
  isEditing.value = false;
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