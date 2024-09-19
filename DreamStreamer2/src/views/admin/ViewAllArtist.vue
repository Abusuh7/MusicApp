<template>
  <AdminHomeTest>
    <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h2>Artist List</h2>
      
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
          placeholder="Search by artist name..."
          class="w-full px-4 py-2 border rounded-lg focus:outline-none"
        />
      </div>
      
      <!-- Table for artist list -->
      <div class="max-w-full overflow-x-auto">
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-2 text-left dark:bg-meta-4">
              <th class="min-w-[220px] py-4 px-4 font-medium text-black xl:pl-11">Name</th>
              <th class="min-w-[150px] py-4 px-4 font-medium text-black">Avatar</th>
              <th class="min-w-[120px] py-4 px-4 font-medium text-black">Status</th>
              <th class="py-4 px-4 font-medium text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="artist in paginatedArtists"
              :key="artist.ID"
              class="bg-white hover:bg-gray-100"
            >
              <td class="py-5 px-4 pl-9 xl:pl-11">
                <h5 class="font-medium text-black ">{{ artist.NAME }}</h5>
              </td>
              <td class="py-5 px-4">
                <img :src="artist.AVATAR" alt="Avatar" class="w-16 h-16 rounded-full">
              </td>
              <td class="py-5 px-4">
                <p
                  class="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium"
                  :class="{
                    'bg-success text-success': artist.STATUS === 'active',
                    'bg-danger text-danger': artist.STATUS === 'inactive'
                  }"
                >
                  {{ artist.STATUS }}
                </p>
              </td>
              <td class="py-5 px-4">
                <div class="flex items-center space-x-3.5">
                  <button @click="editArtist(artist)" class="hover:text-primary">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>

                  <button @click="deleteArtist(artist.ID, artist.AVATAR)" class="hover:text-primary">
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

      <!-- Edit Artist Modal -->
      <div v-if="showEditForm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h3 class="text-xl font-semibold mb-4">Edit Artist</h3>
          <div class="mb-4">
            <label for="name" class="block text-gray-700 font-bold mb-2">Name:</label>
            <input
              v-model="editedArtist.NAME"
              type="text"
              id="name"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="mb-4">
            <label for="status" class="block text-gray-700 font-bold mb-2">Status:</label>
            <input
              v-model="editedArtist.STATUS"
              type="text"
              id="status"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="mb-4">
            <label for="avatar" class="block text-gray-700 font-bold mb-2">Avatar:</label>
            <input
              type="file"
              @change="onFileChange"
              id="avatar"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="flex justify-end">
            <button @click="updateArtist" class="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
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
import { ref, computed, onMounted } from 'vue';
import AdminHomeTest from '@/layouts/AdminHomeTest.vue';

const artists = ref([]);
const showEditForm = ref(false);
const editedArtist = ref({});
const newAvatarFile = ref(null);
const successMessage = ref('');
const errorMessage = ref('');
const searchQuery = ref('');

// Pagination Variables
const currentPage = ref(1);
const itemsPerPage = 5;

// Handle file change for avatar
const onFileChange = (event) => {
  const fileInput = event.target;
  if (fileInput.files && fileInput.files[0]) {
    newAvatarFile.value = fileInput.files[0];
  }
};

// Fetch all artists
const fetchArtists = async () => {
  try {
    const response = await fetch('https://x6krsc98il.execute-api.ap-southeast-1.amazonaws.com/dev/viewallartist');
    if (response.ok) {
      artists.value = await response.json();
    } else {
      errorMessage.value = 'Failed to fetch artists';
    }
  } catch (error) {
    errorMessage.value = error.message;
  }
};

// Edit artist
const editArtist = (artist) => {
  editedArtist.value = { ...artist };
  showEditForm.value = true;
};

// Cancel edit
const cancelEdit = () => {
  showEditForm.value = false;
};

// Update artist
const updateArtist = async () => {
  const reader = new FileReader();
  if (newAvatarFile.value) {
    reader.readAsDataURL(newAvatarFile.value);
  }

  reader.onloadend = async () => {
    const base64String = reader.result?.toString().split(',')[1] || '';

    const requestData = {
      name: editedArtist.value.NAME,
      status: editedArtist.value.STATUS,
      avatarBase64: base64String,
      avatarMimeType: newAvatarFile.value?.type || '',
      oldAvatarUrl: editedArtist.value.AVATAR,
    };

    try {
      const response = await fetch(
        `https://x6krsc98il.execute-api.ap-southeast-1.amazonaws.com/dev/artistUpdate?artistId=${editedArtist.value.ID}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        successMessage.value = 'Artist updated successfully';
        showEditForm.value = false;
        setTimeout(() => {
          successMessage.value = '';
        }, 3000); // Automatically hide success message after 3 seconds
        fetchArtists();
      } else {
        errorMessage.value = 'Failed to update artist';
      }
    } catch (error) {
      errorMessage.value = error.message;
    }
  };
};

// Delete artist
const deleteArtist = async (artistId, avatarUrl) => {
  try {
    const response = await fetch(`https://x6krsc98il.execute-api.ap-southeast-1.amazonaws.com/dev/artistDelete?artistId=${artistId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avatarUrl }),
    });

    if (response.ok) {
      successMessage.value = 'Artist deleted successfully';
      setTimeout(() => {
        successMessage.value = '';
      }, 3000); // Automatically hide success message after 3 seconds
      fetchArtists();
    } else {
      errorMessage.value = 'Failed to delete artist';
    }
  } catch (error) {
    errorMessage.value = error.message;
  }
};

// Filter artists by search query
const filteredArtists = computed(() => {
  return artists.value.filter(artist =>
    artist.NAME.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Paginated artists based on current page
const paginatedArtists = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredArtists.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredArtists.value.length / itemsPerPage));

// Pagination control
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value += 1;
};

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value -= 1;
};

// Fetch artists on mount
onMounted(() => {
  fetchArtists();
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
