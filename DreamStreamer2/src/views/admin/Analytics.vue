<template>
  <AdminHomeTest>
    <div class="analytics-container">
      <h1>Platform Analytics</h1>

      <!-- Loading Indicator -->
      <div v-if="loading" class="loading">
        <p>Loading analytics...</p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
      </div>

      <!-- Display analytics after data is fetched -->
      <div v-else-if="analytics" class="analytics-data">
        <div class="stats-section">
          <h2 class="section-title">General Statistics</h2>
          <div class="stats-grid">
            <div class="stat-card" v-if="analytics.totalAlbums !== undefined">
              <i class="fas fa-record-vinyl"></i>
              <div class="stat-info">
                <strong>Total Albums</strong>
                <p>{{ analytics.totalAlbums }}</p>
              </div>
            </div>

            <div class="stat-card" v-if="analytics.totalSongs !== undefined">
              <i class="fas fa-music"></i>
              <div class="stat-info">
                <strong>Total Songs</strong>
                <p>{{ analytics.totalSongs }}</p>
              </div>
            </div>

            <div
              class="stat-card"
              v-if="analytics.totalActiveSongs !== undefined"
            >
              <i class="fas fa-check-circle"></i>
              <div class="stat-info">
                <strong>Total Active Songs</strong>
                <p>{{ analytics.totalActiveSongs }}</p>
              </div>
            </div>

            <div class="stat-card" v-if="analytics.totalArtists !== undefined">
              <i class="fas fa-users"></i>
              <div class="stat-info">
                <strong>Total Artists</strong>
                <p>{{ analytics.totalArtists }}</p>
              </div>
            </div>

            <div
              class="stat-card"
              v-if="analytics.songsReleasedThisYear !== undefined"
            >
              <i class="fas fa-calendar-alt"></i>
              <div class="stat-info">
                <strong>Songs Released This Year</strong>
                <p>{{ analytics.songsReleasedThisYear }}</p>
              </div>
            </div>

            <div
              class="stat-card"
              v-if="analytics.averageSongsPerAlbum !== undefined"
            >
              <i class="fas fa-chart-bar"></i>
              <div class="stat-info">
                <strong>Average Songs Per Album</strong>
                <p>{{ analytics.averageSongsPerAlbum }}</p>
              </div>
            </div>

            <div
              class="stat-card"
              v-if="analytics.mostPopularGenre !== undefined"
            >
              <i class="fas fa-fire"></i>
              <div class="stat-info">
                <strong>Most Popular Genre</strong>
                <p>{{ analytics.mostPopularGenre }}</p>
              </div>
            </div>

            <div
              class="stat-card"
              v-if="analytics.mostRecentAlbum !== undefined"
            >
              <i class="fas fa-clock"></i>
              <div class="stat-info">
                <strong>Most Recent Album</strong>
                <p>{{ analytics.mostRecentAlbum }}</p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="top-genres-section"
          v-if="analytics.topGenres && analytics.topGenres.length > 0"
        >
          <h2 class="section-title">Top Genres</h2>
          <ul>
            <li v-for="(genre, index) in analytics.topGenres" :key="index">
              <i class="fas fa-tag"></i> {{ genre.genreName }} -
              {{ genre.songCount }} songs
            </li>
          </ul>
        </div>

        <div
          class="top-artists-section"
          v-if="
            analytics.topArtistsBySongs &&
            analytics.topArtistsBySongs.length > 0
          "
        >
          <h2 class="section-title">Top Artists by Number of Songs</h2>
          <ul>
            <li
              v-for="(artist, index) in analytics.topArtistsBySongs"
              :key="index"
            >
              <i class="fas fa-microphone"></i> {{ artist.artistName }} -
              {{ artist.songCount }} songs
            </li>
          </ul>
        </div>
      </div>
    </div>
  </AdminHomeTest>
</template>

<script setup>
import AdminHomeTest from "@/layouts/AdminHomeTest.vue";
import { ref, onMounted } from "vue";

const analytics = ref(null); // Holds the fetched analytics data
const loading = ref(true); // Loading state
const errorMessage = ref(null); // Error message state

// Function to fetch analytics data from backend
const fetchAnalytics = async () => {
  try {
    const response = await fetch(
      "https://6v4p84lqd6.execute-api.ap-southeast-1.amazonaws.com/dev/analytics"
    ); // Replace with your actual Lambda URL
    if (!response.ok) {
      throw new Error("Failed to fetch analytics");
    }

    const data = await response.json();
    analytics.value = data; // Assign the fetched data to analytics
  } catch (error) {
    errorMessage.value = error.message; // Set error message if there's a failure
  } finally {
    loading.value = false; // Stop the loading state
  }
};

// Fetch the analytics data when the component is mounted
onMounted(() => {
  fetchAnalytics();
});
</script>

<style scoped>
/* General Container */
.analytics-container {
  font-family: "Poppins", sans-serif;
  background-color: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Header */
h1 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #333;
}

/* Section Title */
.section-title {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #1a202c;
  text-align: left;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

/* Stat Card */
.stat-card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.stat-card i {
  font-size: 2rem;
  margin-right: 15px;
  color: #2d3748;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-info strong {
  font-size: 1.2rem;
  color: #2d3748;
}

.stat-info p {
  font-size: 1.5rem;
  color: #1a202c;
  margin: 0;
}

/* Top Genres & Artists */
ul {
  list-style: none;
  padding-left: 0;
}

ul li {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #2d3748;
}

ul li i {
  margin-right: 8px;
  color: #4a5568;
}

/* Loading State */
.loading {
  text-align: center;
  font-size: 1.5rem;
  color: #555;
}

/* Error Message */
.error-message {
  text-align: center;
  color: #ff4d4d;
  font-weight: bold;
}
</style>
