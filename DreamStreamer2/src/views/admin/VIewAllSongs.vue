<template>
  <AdminHomeTest>
    <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h2>Song Management</h2>

      <!-- Notification Messages -->
      <transition name="fade" mode="out-in">
        <div v-if="successMessage" class="bg-green-500 text-white p-4 rounded-md mb-4 animate-fade-in-out">
          {{ successMessage }}
        </div>
      </transition>
      <transition name="fade" mode="out-in">
        <div v-if="errorMessage" class="bg-red-500 text-white p-4 rounded-md mb-4">
          {{ errorMessage }}
        </div>
      </transition>

      <!-- Search Bar -->
      <div class="mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by song name, artist, or genre..."
          class="w-full px-4 py-2 border rounded-lg focus:outline-none"
        />
      </div>

      <!-- Table for song list -->
      <div class="max-w-full overflow-x-auto">
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-2 text-left dark:bg-meta-4">
              <th class="min-w-[220px] py-4 px-4 font-medium text-black xl:pl-11">Name</th>
              <th class="min-w-[150px] py-4 px-4 font-medium text-black">Genre</th>
              <th class="min-w-[150px] py-4 px-4 font-medium text-black">Artist</th>
              <th class="min-w-[100px] py-4 px-4 font-medium text-black">Duration</th>
              <th class="min-w-[120px] py-4 px-4 font-medium text-black">Status</th>
              <th class="py-4 px-4 font-medium text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="song in paginatedSongs" :key="song.id" class="bg-white hover:bg-gray-100">
              <td class="py-5 px-4 pl-9 xl:pl-11">{{ song.name }}</td>
              <td class="py-5 px-4">{{ song.genre_name }}</td>
              <td class="py-5 px-4">{{ song.artist_name }}</td>
              <td class="py-5 px-4">{{ song.duration }} seconds</td>
              <td class="py-5 px-4">
                <p
                  class="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium"
                  :class="{
                    'bg-success text-success': song.status === 'active',
                    'bg-danger text-danger': song.status === 'inactive'
                  }"
                >
                  {{ song.status }}
                </p>
              </td>
              <td class="py-5 px-4">
                <div class="flex items-center space-x-3.5">
                  <button @click="playSong(song)" class="hover:text-primary">
                    <i class="fa-solid fa-play"></i>
                  </button>
                  <button @click="editSong(song)" class="hover:text-primary">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button @click="deleteSong(song.id)" class="hover:text-primary">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex justify-between items-center mt-4">
        <button @click="previousPage" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-300 rounded-md">
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 bg-gray-300 rounded-md">
          Next
        </button>
      </div>

      <!-- Media Player fixed at the bottom -->
      <div v-if="currentSong" class="media-player">
        <div class="media-info">
          <img :src="currentSong.thumbnail_url" alt="Thumbnail" class="w-16 h-16 rounded-full">
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
        <!-- Progress bar (seeder) -->
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
        <audio ref="audioPlayer" class="w-full" @timeupdate="updateProgress" @ended="nextSong" />
      </div>

      <!-- Edit Song Modal -->
      <div v-if="isEditing" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h3 class="text-xl font-semibold mb-4">Edit Song</h3>
          <form @submit.prevent="updateSong">
            <div class="mb-4">
              <label for="name" class="block text-gray-700 font-bold mb-2">Song Name:</label>
              <input v-model="songToEdit.name" type="text" id="name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
            </div>
            <div class="mb-4">
              <label for="genre" class="block text-gray-700 font-bold mb-2">Genre:</label>
              <select v-model="songToEdit.genre_id" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                <option v-for="genre in genres" :key="genre.ID" :value="genre.ID">{{ genre.NAME }}</option>
              </select>
            </div>
            <div class="mb-4">
              <label for="artist" class="block text-gray-700 font-bold mb-2">Artist:</label>
              <select v-model="songToEdit.artist_id" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                <option v-for="artist in artists" :key="artist.ID" :value="artist.ID">{{ artist.NAME }}</option>
              </select>
            </div>
            <div class="mb-4">
              <label for="status" class="block text-gray-700 font-bold mb-2">Status:</label>
              <select v-model="songToEdit.status" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div class="mb-4">
              <label for="songFile" class="block text-gray-700 font-bold mb-2">Change Song (optional):</label>
              <input @change="onSongFileChange" type="file" id="songFile" accept="audio/*" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div class="mb-4">
              <label for="thumbnailFile" class="block text-gray-700 font-bold mb-2">Change Thumbnail (optional):</label>
              <input @change="onThumbnailFileChange" type="file" id="thumbnailFile" accept="image/*" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <p v-if="songToEdit.duration" class="mb-4">Duration: {{ songToEdit.duration }} seconds</p>
            <div class="flex justify-end">
              <button type="submit" class="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
                Save
              </button>
              <span class="inline-block w-4"></span>
              <button @click="isEditing = false" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminHomeTest>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AdminHomeTest from '@/layouts/AdminHomeTest.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const songs = ref([]);
const currentSong = ref(null);
const isEditing = ref(false);
const songToEdit = ref(null);
const errorMessage = ref(null);
const successMessage = ref(null);
const genres = ref([]);
const artists = ref([]);
const searchQuery = ref('');
let isPlaying = ref(false);
let currentTime = ref(0);
let audioDuration = ref(0);

// Pagination Variables
const currentPage = ref(1);
const itemsPerPage = 5;
let newSongFile = null;
let newThumbnailFile = null;

// Fetch genres and artists for dropdowns
const fetchGenresAndArtists = async () => {
  const genreResponse = await fetch('https://e8ft24nt6g.execute-api.ap-southeast-1.amazonaws.com/dev/genreViewAll');
  genres.value = await genreResponse.json();

  const artistResponse = await fetch('https://x6krsc98il.execute-api.ap-southeast-1.amazonaws.com/dev/viewallartist');
  artists.value = await artistResponse.json();
};

// Fetch songs from the API
const fetchSongs = async () => {
  try {
    const response = await fetch('https://drj8e1e679.execute-api.ap-southeast-1.amazonaws.com/dev/songViewAll');
    songs.value = await response.json();
  } catch (error) {
    errorMessage.value = 'Error fetching songs';
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

// Edit a selected song
const editSong = (song) => {
  songToEdit.value = { ...song };
  isEditing.value = true;
};

// Handle new song file change
const onSongFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const audio = new Audio(URL.createObjectURL(file));
  audio.addEventListener('loadedmetadata', () => {
    songToEdit.value.duration = audio.duration.toFixed(2);  // Get duration in seconds
  });

  const formData = { fileName: file.name };

  try {
    const presignResponse = await fetch('https://drj8e1e679.execute-api.ap-southeast-1.amazonaws.com/dev/preassignedUrl', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    });

    const { uploadUrl, songUrl } = await presignResponse.json();
    await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
    });

    songToEdit.value.songUrl = songUrl;
  } catch (error) {
    errorMessage.value = 'Error uploading song';
  }
};

// Handle new thumbnail file change
const onThumbnailFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      newThumbnailFile = {
        base64: reader.result.split(',')[1],
        mimeType: file.type,
      };
    };
  }
};

// Update the song
const updateSong = async () => {
  let thumbnailBase64 = songToEdit.value.thumbnail_url;

  if (newThumbnailFile) {
    thumbnailBase64 = newThumbnailFile.base64;
  }

  const payload = {
    name: songToEdit.value.name,
    genreId: songToEdit.value.genre_id,
    artistId: songToEdit.value.artist_id,
    status: songToEdit.value.status,
    songUrl: songToEdit.value.songUrl,
    thumbnailBase64,
    thumbnailMimeType: newThumbnailFile?.mimeType,
    duration: songToEdit.value.duration,
  };

  try {
    const response = await fetch(`https://drj8e1e679.execute-api.ap-southeast-1.amazonaws.com/dev/songUpdate?songId=${songToEdit.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Failed to update song');

    successMessage.value = 'Song updated successfully!';
    setTimeout(() => successMessage.value = '', 3000);
    fetchSongs();
    isEditing.value = false;
  } catch (error) {
    errorMessage.value = 'Error updating song';
  }
};

// Delete a song
const deleteSong = async (id) => {
  try {
    await fetch(`https://drj8e1e679.execute-api.ap-southeast-1.amazonaws.com/dev/songDelete?songId=${id}`, {
      method: 'DELETE',
    });

    songs.value = songs.value.filter(song => song.id !== id);
    successMessage.value = 'Song deleted successfully!';
    setTimeout(() => successMessage.value = '', 3000);
  } catch (error) {
    errorMessage.value = 'Error deleting song';
  }
};

// Filtered Songs
const filteredSongs = computed(() => {
  return songs.value.filter(song =>
    song.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    song.artist_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    song.genre_name.toLowerCase().includes(searchQuery.value.toLowerCase())
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
  fetchGenresAndArtists();
});
</script>

<style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  th, td {
    padding: 12px;
    text-align: left;
  }

  th {
    background-color: #f8f8f8;
  }

  td {
    border: 1px solid #ddd;
  }

  button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
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

  .modal {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
  }

  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
  }

  @keyframes fadeInOut {
    0% { opacity: 0; }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100% { opacity: 0; }
  }

  .animate-fade-in-out {
    animation: fadeInOut 3s ease-in-out;
  }
</style>
