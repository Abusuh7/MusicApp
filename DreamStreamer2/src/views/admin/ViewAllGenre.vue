<template>
  <AdminHomeTest>
    <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h2>Genre Management</h2>

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
          placeholder="Search by genre name..."
          class="w-full px-4 py-2 border rounded-md focus:outline-none"
        />
      </div>

      <!-- Table for genre list -->
      <div class="max-w-full overflow-x-auto">
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-2 text-left dark:bg-meta-4">
              <th class="min-w-[220px] py-4 px-4 font-medium text-black xl:pl-11">Name</th>
              <th class="min-w-[150px] py-4 px-4 font-medium text-black">Description</th>
              <th class="min-w-[150px] py-4 px-4 font-medium text-black">Avatar</th>
              <th class="min-w-[120px] py-4 px-4 font-medium text-black">Status</th>
              <th class="py-4 px-4 font-medium text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="genre in paginatedGenres" :key="genre.ID" class="bg-white hover:bg-gray-100">
              <td class="py-5 px-4 pl-9 xl:pl-11">{{ genre.NAME }}</td>
              <td class="py-5 px-4">{{ genre.DESCRIPTION }}</td>
              <td class="py-5 px-4"><img :src="genre.AVATAR" alt="Genre Avatar" class="w-16 h-16 rounded-full" /></td>
              <td class="py-5 px-4">
                <p
                  class="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium"
                  :class="{
                    'bg-success text-success': genre.STATUS === 'active',
                    'bg-danger text-danger': genre.STATUS === 'inactive'
                  }"
                >
                  {{ genre.STATUS }}
                </p>
              </td>
              <td class="py-5 px-4">
                <div class="flex items-center space-x-3.5">
                  <button @click="editGenre(genre)" class="hover:text-primary">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button @click="deleteGenre(genre.ID)" class="hover:text-primary">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div class="flex justify-between items-center mt-4">
        <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-300 rounded-md">
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 bg-gray-300 rounded-md">
          Next
        </button>
      </div>

      <!-- Edit Genre Modal -->
      <div v-if="showEditForm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h3 class="text-xl font-semibold mb-4">Edit Genre</h3>
          <div class="mb-4">
            <label for="name" class="block text-gray-700 font-bold mb-2">Name:</label>
            <input v-model="formData.name" type="text" id="name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div class="mb-4">
            <label for="description" class="block text-gray-700 font-bold mb-2">Description:</label>
            <input v-model="formData.description" type="text" id="description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div class="mb-4">
            <label for="avatar" class="block text-gray-700 font-bold mb-2">Avatar:</label>
            <input type="file" @change="handleFileChange" id="avatar" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div class="flex justify-end">
            <button @click="updateGenre" class="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
              Save
            </button>
            <span class="inline-block w-4"></span>
            <button @click="cancelEdit" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminHomeTest>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import AdminHomeTest from '@/layouts/AdminHomeTest.vue';

const genres = ref([]);
const formData = ref({
  name: '',
  description: '',
  avatar: null,
  status: 'active',
});
const successMessage = ref('');
const errorMessage = ref('');
const showEditForm = ref(false);
let oldAvatarUrl = ref(null);
let selectedGenreId = ref(null);

const searchQuery = ref(''); // For searching genres
const currentPage = ref(1);
const itemsPerPage = 5; // Number of items per page

// Fetch genres from the API
const fetchGenres = async () => {
  const apiUrl = 'https://e8ft24nt6g.execute-api.ap-southeast-1.amazonaws.com/dev/genreViewAll';

  try {
    const response = await fetch(apiUrl);
    if (response.ok) {
      genres.value = await response.json();
    } else {
      errorMessage.value = 'Failed to load genres';
    }
  } catch (error) {
    errorMessage.value = `Error: ${error.message}`;
  }
};

// Search and pagination logic
const filteredGenres = computed(() => {
  return genres.value.filter(genre => genre.NAME.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const totalPages = computed(() => Math.ceil(filteredGenres.value.length / itemsPerPage));

const paginatedGenres = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredGenres.value.slice(start, start + itemsPerPage);
});

// Pagination Controls
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

// Handle file input change
const handleFileChange = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    formData.value.avatar = reader.result.split(',')[1]; // Base64 encoded
  };
  reader.readAsDataURL(file);
};

// Edit Genre
const editGenre = (genre) => {
  formData.value.name = genre.NAME;
  formData.value.description = genre.DESCRIPTION;
  formData.value.status = genre.STATUS;
  oldAvatarUrl.value = genre.AVATAR;
  selectedGenreId.value = genre.ID;
  showEditForm.value = true;
};

// Update Genre
const updateGenre = async () => {
  const apiUrl = `https://e8ft24nt6g.execute-api.ap-southeast-1.amazonaws.com/dev/genreUpdate?genreId=${selectedGenreId.value}`;

  const bodyData = {
    name: formData.value.name,
    description: formData.value.description,
    avatarBase64: formData.value.avatar,
    avatarMimeType: 'image/jpeg',
    status: formData.value.status,
    oldAvatarUrl: oldAvatarUrl.value,
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    if (response.ok) {
      await fetchGenres();
      showEditForm.value = false;
      successMessage.value = 'Genre updated successfully';
      setTimeout(() => successMessage.value = '', 3000); // Hide success message after 3 seconds
    } else {
      errorMessage.value = 'Failed to update genre';
    }
  } catch (error) {
    errorMessage.value = `Error: ${error.message}`;
  }
};

// Delete Genre
const deleteGenre = async (genreId) => {
  const apiUrl = `https://e8ft24nt6g.execute-api.ap-southeast-1.amazonaws.com/dev/genreDelete?genreId=${genreId}`;

  try {
    const response = await fetch(apiUrl, { method: 'DELETE' });
    if (response.ok) {
      await fetchGenres();
      successMessage.value = 'Genre deleted successfully';
      setTimeout(() => successMessage.value = '', 3000); // Hide success message after 3 seconds
    } else {
      errorMessage.value = 'Failed to delete genre';
    }
  } catch (error) {
    errorMessage.value = `Error: ${error.message}`;
  }
};

// Cancel Edit
const cancelEdit = () => {
  showEditForm.value = false;
};

// Fetch genres on component mount
onMounted(() => {
  fetchGenres();
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

  /* Modal styling */
  .modal {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
  }

  /* Fade-in-out animation */
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
