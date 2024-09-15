<template>
    <div>
      <h2>All Songs</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Genre</th>
            <th>Artist</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="song in songs" :key="song.id">
            <td>{{ song.name }}</td>
            <td>{{ song.genre_name }}</td>
            <td>{{ song.artist_name }}</td>
            <td>{{ song.duration }} seconds</td>
            <td>{{ song.status }}</td>
            <td>
              <button @click="playSong(song)">Play</button>
              <button @click="editSong(song)">Edit</button>
              <button @click="deleteSong(song.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <div class="media-player" v-if="currentSong">
        <div class="media-info">
          <img :src="currentSong.thumbnail_url" alt="Thumbnail" />
          <p>{{ currentSong.name }}</p>
        </div>
        <audio controls :src="currentSong.song_url" ref="audioPlayer"></audio>
      </div>
  
      <!-- Edit Song Modal -->
      <div v-if="isEditing">
        <div class="modal">
          <h3>Edit Song</h3>
          <form @submit.prevent="updateSong">
            <label for="name">Song Name:</label>
            <input v-model="songToEdit.name" type="text" id="name" required />
  
            <label for="genre">Genre:</label>
            <select v-model="songToEdit.genre_id" required>
              <option v-for="genre in genres" :key="genre.ID" :value="genre.ID">{{ genre.NAME }}</option>
            </select>
  
            <label for="artist">Artist:</label>
            <select v-model="songToEdit.artist_id" required>
              <option v-for="artist in artists" :key="artist.ID" :value="artist.ID">{{ artist.NAME }}</option>
            </select>
  
            <label for="status">Status:</label>
            <select v-model="songToEdit.status" required>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
  
            <label for="songFile">Change Song (optional):</label>
            <input @change="onSongFileChange" type="file" id="songFile" accept="audio/*" />
  
            <label for="thumbnailFile">Change Thumbnail (optional):</label>
            <input @change="onThumbnailFileChange" type="file" id="thumbnailFile" accept="image/*" />
  
            <p v-if="songToEdit.duration">Duration: {{ songToEdit.duration }} seconds</p>
  
            <button type="submit">Save Changes</button>
            <button @click="isEditing = false">Cancel</button>
          </form>
        </div>
      </div>
  
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const songs = ref([]);
  const currentSong = ref(null);
  const isEditing = ref(false);
  const songToEdit = ref(null);
  const errorMessage = ref(null);
  const genres = ref([]);
  const artists = ref([]);
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
  };
  
  // Edit a selected song
  const editSong = (song) => {
    songToEdit.value = { ...song }; // Clone the song to avoid directly mutating the list
    isEditing.value = true;
  };
  
  // Handle new song file change
  const onSongFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    // Calculate duration using Audio API
    const audio = new Audio(URL.createObjectURL(file));
    audio.addEventListener('loadedmetadata', () => {
      songToEdit.value.duration = audio.duration.toFixed(2);  // Get duration in seconds
    });
  
    // Call the API to get the pre-signed URL
    const formData = { fileName: file.name };
  
    try {
      const presignResponse = await fetch('https://drj8e1e679.execute-api.ap-southeast-1.amazonaws.com/dev/preassignedUrl', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });
  
      const { uploadUrl, songUrl } = await presignResponse.json();
      console.log("uploadUrl", uploadUrl);
        console.log("songUrl", songUrl);
  
      // Upload the song to S3 using the pre-signed URL
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
      });
  
      // Store the uploaded song URL for later update
      songToEdit.value.songUrl = songUrl;
    } catch (error) {
      errorMessage.value = 'Error uploading song';
      console.error('Error uploading song:', error);
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
          base64: reader.result.split(',')[1], // Base64 encode the image file
          mimeType: file.type, // Get MIME type
        };
      };
    }
  };
  
  // Update the song
  const updateSong = async () => {
    let thumbnailBase64 = songToEdit.value.thumbnail_url;
  
    // If a new thumbnail was uploaded, use it
    if (newThumbnailFile) {
      thumbnailBase64 = newThumbnailFile.base64;
    }
  
    // Prepare the payload for updating
    const payload = {
      name: songToEdit.value.name,
      genreId: songToEdit.value.genre_id,
      artistId: songToEdit.value.artist_id,
      status: songToEdit.value.status,
      songUrl: songToEdit.value.songUrl || currentSong.value.song_url, // Newly uploaded song URL or the existing one
      thumbnailBase64, // New or existing thumbnail
      thumbnailMimeType: newThumbnailFile?.mimeType, // New thumbnail MIME type (if any)
      duration: songToEdit.value.duration, // Updated or existing duration
    };
  
    try {
      const response = await fetch(`https://drj8e1e679.execute-api.ap-southeast-1.amazonaws.com/dev/songUpdate?songId=${songToEdit.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update song');
      }
  
      alert('Song updated successfully!');
      fetchSongs(); // Refresh the list of songs
      isEditing.value = false;  // Close the edit mode
    } catch (error) {
      errorMessage.value = 'Error updating song';
      console.error('Error updating song:', error);
    }
  };
  
  // Delete a song
  const deleteSong = async (id) => {
    try {
      await fetch(`https://drj8e1e679.execute-api.ap-southeast-1.amazonaws.com/dev/songDelete?songId=${id}`, {
        method: 'DELETE',
      });
  
      // Remove song from the list
      songs.value = songs.value.filter(song => song.id !== id);
    } catch (error) {
      errorMessage.value = 'Error deleting song';
    }
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
  }
  
  th, td {
    padding: 10px;
    border-bottom: 1px solid #ccc;
    text-align: left;
  }
  
  button {
    margin: 5px;
    padding: 5px 10px;
  }
  
  .media-player {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #333;
    color: white;
    display: flex;
    align-items: center;
    padding: 10px;
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.5);
  }
  
  .media-info {
    display: flex;
    align-items: center;
    margin-right: 25px;
  }
  
  .media-info img {
    height: 50px;
    width: 50px;
    margin-right: 10px;
  }
  
  audio {
    width: 100%;
  }
  
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
  }
  
  .modal button {
    margin-top: 10px;
  }
  </style>
  