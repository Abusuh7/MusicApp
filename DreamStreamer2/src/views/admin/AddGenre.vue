<template>
  <AdminHomeTest>
    <div class="form-container">
      <h2>Create Genre</h2>

      <!-- Success and Error Messages -->
      <transition name="fade">
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </transition>
      <transition name="fade">
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </transition>

      <!-- Genre Form -->
      <form @submit.prevent="submitGenre">
        <!-- Genre Name -->
        <div class="form-group">
          <label for="name">Name:</label>
          <input
            v-model="formData.name"
            type="text"
            id="name"
            placeholder="Enter genre name"
            class="form-input"
            required
          />
        </div>

        <!-- Genre Description -->
        <div class="form-group">
          <label for="description">Description:</label>
          <input
            v-model="formData.description"
            type="text"
            id="description"
            placeholder="Enter genre description"
            class="form-input"
            required
          />
        </div>

        <!-- Avatar Upload -->
        <div class="form-group">
          <label for="avatar">Avatar:</label>
          <input
            type="file"
            @change="handleFileChange"
            id="avatar"
            class="form-input"
            accept="image/*"
            required
          />
        </div>

        <!-- Status -->
        <div class="form-group">
          <label for="status">Status:</label>
          <select v-model="formData.status" class="form-input">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <!-- Submit Button -->
        <button :disabled="!formData.name || !formData.description || !formData.avatar" class="form-button">
          <span v-if="loading" class="spinner"></span>
          <span v-else>Create Genre</span>
        </button>
      </form>
    </div>
  </AdminHomeTest>
</template>

<script setup>
import AdminHomeTest from "@/layouts/AdminHomeTest.vue";
import { ref } from "vue";

const formData = ref({
  name: "",
  description: "",
  avatar: null,
  status: "active",
});

const successMessage = ref(null);
const errorMessage = ref(null);
const loading = ref(false);

// Handle file input change
const handleFileChange = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    formData.value.avatar = reader.result.split(",")[1]; // Base64 encoded
  };
  reader.readAsDataURL(file);
};

// Function to submit the form (create genre)
const submitGenre = async () => {
  if (!formData.value.name || !formData.value.description || !formData.value.avatar) {
    errorMessage.value = "Please fill out all required fields.";
    return;
  }

  loading.value = true;

  const apiUrl =
    "https://e8ft24nt6g.execute-api.ap-southeast-1.amazonaws.com/dev/genreAdd";

  const bodyData = {
    name: formData.value.name,
    description: formData.value.description,
    avatarBase64: formData.value.avatar,
    avatarMimeType: "image/jpeg", // Adjust based on file type
    status: formData.value.status,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    if (response.ok) {
      successMessage.value = "Genre created successfully!";
      resetForm();
    } else {
      const errorData = await response.json();
      errorMessage.value = `Error: ${errorData.message}`;
    }
  } catch (error) {
    errorMessage.value = `Error: ${error.message}`;
  } finally {
    loading.value = false;
  }
};

// Reset the form after submission
const resetForm = () => {
  formData.value.name = "";
  formData.value.description = "";
  formData.value.avatar = null;
  formData.value.status = "active";
  successMessage.value = null;
  errorMessage.value = null;
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

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
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

.success-message {
  color: green;
  text-align: center;
  margin-top: 10px;
}

.error-message {
  color: red;
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
