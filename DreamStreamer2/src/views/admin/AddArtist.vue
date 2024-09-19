<template>
  <AdminHomeTest>
    <div class="form-container">
      <h2>Create Artist</h2>

      <!-- Success and Error Messages -->
      <transition name="fade">
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </transition>
      <transition name="fade">
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </transition>

      <!-- Artist Form -->
      <form @submit.prevent="createArtist">
        <!-- Name -->
        <div class="form-group">
          <label for="name">Name:</label>
          <input v-model="name" type="text" id="name" placeholder="Enter artist name" class="form-input" />
        </div>

        <!-- Status -->
        <div class="form-group">
          <label for="status">Status:</label>
          <input v-model="status" type="text" id="status" placeholder="Enter artist status" class="form-input" />
        </div>

        <!-- Avatar Upload -->
        <div class="form-group">
          <label for="avatar">Avatar:</label>
          <input type="file" @change="handleFileChange" accept="image/*" class="form-file-input" />
        </div>

        <!-- Submit Button with Loading Spinner -->
        <button :disabled="isSubmitting" type="submit" class="form-button">
          <span v-if="isSubmitting" class="spinner"></span>
          <span v-else>Create Artist</span>
        </button>
      </form>
    </div>
  </AdminHomeTest>
</template>

<script setup>
import AdminHomeTest from '@/layouts/AdminHomeTest.vue';
import { ref } from 'vue';

const name = ref('');
const status = ref('');
const avatarFile = ref(null);
const avatarBase64 = ref('');
const successMessage = ref('');
const errorMessage = ref('');
const isSubmitting = ref(false);

// Handle file change (read the image and convert to Base64)
const handleFileChange = (event) => {
  const file = event.target.files[0];
  avatarFile.value = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    avatarBase64.value = e.target.result.split(',')[1]; // Only keep the base64 string part
  };
  reader.readAsDataURL(file);
};

// Function to create the artist
const createArtist = async () => {
  isSubmitting.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  // Ensure all fields are filled in
  if (!name.value || !status.value || !avatarBase64.value || !avatarFile.value.type) {
    errorMessage.value = 'Please fill in all fields and upload a valid image.';
    isSubmitting.value = false;
    return;
  }

  // Construct the payload
  const requestData = {
    name: name.value,
    avatarBase64: avatarBase64.value,
    avatarMimeType: avatarFile.value.type, // Get MIME type (e.g., image/jpeg)
    status: status.value,
  };

  // Send to the backend
  try {
    const response = await fetch('https://x6krsc98il.execute-api.ap-southeast-1.amazonaws.com/dev/addartist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      const responseData = await response.json();
      successMessage.value = `Success: ${responseData.message}, Artist ID: ${responseData.artistId}`;
      // Reset form
      name.value = '';
      status.value = '';
      avatarBase64.value = '';
      avatarFile.value = null;
    } else {
      const errorData = await response.json();
      errorMessage.value = `Error: ${errorData.message}`;
    }
  } catch (error) {
    errorMessage.value = `Error: ${error.message}`;
  }

  isSubmitting.value = false;
};
</script>

<style scoped>
.form-container {
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.form-input,
.form-file-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.form-input:focus,
.form-file-input:focus {
  border-color: #333;
  outline: none;
}

button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

button:disabled {
  background-color: #999;
  cursor: not-allowed;
}

button:hover:enabled {
  background-color: #555;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}

.success-message {
  color: green;
  text-align: center;
  margin-top: 10px;
}

/* Fade-in and fade-out animation for messages */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* Spinner for loading animation */
.spinner {
  border: 4px solid #f3f3f3;
  border-radius: 50%;
  border-top: 4px solid #333;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 5px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
