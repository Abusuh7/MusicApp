<template>
  <div>
    <h2>Create Genre</h2>

    <div>
      <label for="name">Name:</label>
      <input v-model="formData.name" type="text" id="name" placeholder="Enter genre name" />
    </div>

    <div>
      <label for="description">Description:</label>
      <input v-model="formData.description" type="text" id="description" placeholder="Enter genre description" />
    </div>

    <div>
      <label for="avatar">Avatar:</label>
      <input type="file" @change="handleFileChange" id="avatar" />
    </div>

    <div>
      <label for="status">Status:</label>
      <select v-model="formData.status">
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    <button @click="submitGenre">Create Genre</button>

    <div v-if="successMessage">
      <p>{{ successMessage }}</p>
    </div>

    <div v-if="errorMessage">
      <p>Error: {{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const formData = ref({
  name: '',
  description: '',
  avatar: null,
  status: 'active',
});

const successMessage = ref(null);
const errorMessage = ref(null);

// Handle file input change
const handleFileChange = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    formData.value.avatar = reader.result.split(',')[1]; // Base64 encoded
  };
  reader.readAsDataURL(file);
};

// Function to submit the form (create genre)
const submitGenre = async () => {
  const apiUrl = 'https://e8ft24nt6g.execute-api.ap-southeast-1.amazonaws.com/dev/genreAdd';

  const bodyData = {
    name: formData.value.name,
    description: formData.value.description,
    avatarBase64: formData.value.avatar, // Base64 string
    avatarMimeType: 'image/jpeg', // Adjust based on file type
    status: formData.value.status,
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    if (response.ok) {
      successMessage.value = 'Genre created successfully!';
      resetForm();
    } else {
      const errorData = await response.json();
      errorMessage.value = `Error: ${errorData.message}`;
    }
  } catch (error) {
    errorMessage.value = `Error: ${error.message}`;
  }
};

// Reset the form after submission
const resetForm = () => {
  formData.value.name = '';
  formData.value.description = '';
  formData.value.avatar = null;
  formData.value.status = 'active';
  successMessage.value = null;
  errorMessage.value = null;
};
</script>

<style scoped>
input[type="file"] {
  margin-top: 10px;
}

button {
  margin-top: 20px;
}
</style>
