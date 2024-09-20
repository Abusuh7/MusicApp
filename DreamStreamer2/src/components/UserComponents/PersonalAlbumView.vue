<template>
  <div>
    <!-- Show loading spinner while fetching data -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>

    <!-- Once data is loaded, display the albums -->
    <div v-else>
      <div class="album-header">
        <h2>Your Library</h2>
        <b><a href="" class="show-all">Show all</a></b>
      </div>

      <!-- Album grid display (horizontal scroll) -->
      <div class="album-grid-horizontal">
        <div v-for="album in albums" :key="album.ID" class="album-card">
          <img
            v-if="album.NAME"
            :src="album.ALBUM_ART"
            alt="Album Art"
            class="album-art"
            @click="selectAlbum(album.ID)"
          />
          <span v-else>No Image</span>

          <!-- Album Name and Artist -->
          <div class="album-info">
            <h3 class="album-name">{{ album.NAME }}</h3>
            <p class="artist-name">By {{ userName.charAt(0).toUpperCase() + userName.slice(1) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { getCurrentUser } from "aws-amplify/auth";

const router = useRouter();

const albums = ref([]);
const errorMessage = ref("");
const loading = ref(true); // Loading state
const userName = ref("");
const userId = ref("");

const selectAlbum = (albumId) => {
  console.log("Album clicked: ", albumId);
  router.push({ name: "personalalbumdetails", params: { albumId } });
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
  } finally {
    // Stop loading spinner once albums are fetched
    loading.value = false;
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
    } else {
      console.log("User ID not found");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
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

.album-art {
  width: 100%;
  height: 180px;
  border-radius: 10px;
  object-fit: cover;
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
  color: #7a7a7a;
  font-size: 0.875rem;
}

/* Scrollbar Styling */
.album-grid-horizontal::-webkit-scrollbar {
  width: 0px;
}

.album-grid-horizontal {
  -ms-overflow-style: none; /* Hide scrollbar in IE and Edge */
  scrollbar-width: none; /* Hide scrollbar in Firefox */
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
