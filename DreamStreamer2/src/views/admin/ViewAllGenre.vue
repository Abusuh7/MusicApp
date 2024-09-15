<template>
  <div>
    <h2>Genre Management</h2>
    <table v-if="genres.length" border="1" cellpadding="10">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Avatar</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="genre in genres" :key="genre.ID">
          <td>{{ genre.NAME }}</td>
          <td>{{ genre.DESCRIPTION }}</td>
          <td><img :src="genre.AVATAR" alt="Genre Avatar" width="100" /></td>
          <td>{{ genre.STATUS }}</td>
          <td>
            <button @click="editGenre(genre)">Edit</button>
            <button @click="deleteGenre(genre.ID)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else>
      <p>No genres found.</p>
    </div>

    <!-- Edit Genre Form in a Popup -->
    <div v-if="showEditForm" class="modal">
      <h3>Edit Genre</h3>
      <label for="name">Name:</label>
      <input v-model="formData.name" type="text" id="name" placeholder="Enter genre name" />
      <label for="description">Description:</label>
      <input v-model="formData.description" type="text" id="description" placeholder="Enter genre description" />
      <label for="avatar">Avatar:</label>
      <input type="file" @change="handleFileChange" id="avatar" />
      <label for="status">Status:</label>
      <select v-model="formData.status">
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <button @click="updateGenre">Update Genre</button>
      <button @click="cancelEdit">Cancel</button>
    </div>

    <div v-if="errorMessage">
      <p>Error: {{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const genres = ref([]);
const formData = ref({
  name: '',
  description: '',
  avatar: null,
  status: 'active',
});
const errorMessage = ref(null);
const showEditForm = ref(false);
let oldAvatarUrl = ref(null);
let selectedGenreId = ref(null);

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
      resetForm();
    } else {
      const errorData = await response.json();
      errorMessage.value = `Error: ${errorData.message}`;
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
    } else {
      const errorData = await response.json();
      errorMessage.value = `Error: ${errorData.message}`;
    }
  } catch (error) {
    errorMessage.value = `Error: ${error.message}`;
  }
};

// Cancel Edit
const cancelEdit = () => {
  resetForm();
};

// Reset Form
const resetForm = () => {
  formData.value.name = '';
  formData.value.description = '';
  formData.value.avatar = null;
  formData.value.status = 'active';
  oldAvatarUrl.value = null;
  selectedGenreId.value = null;
  showEditForm.value = false;
};

// Fetch genres on component mount
fetchGenres();
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

img {
  border-radius: 5px;
}

button {
  margin: 5px;
}

.modal {
  border: 1px solid #ccc;
  padding: 20px;
  background-color: #fff;
  width: 300px;
}
</style>
