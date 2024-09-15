<template>
  <div>
    <h2>Create Artist</h2>
    <div>
      <label for="name">Name:</label>
      <input v-model="name" type="text" id="name" placeholder="Enter artist name" />
    </div>

    <div>
      <label for="status">Status:</label>
      <input v-model="status" type="text" id="status" placeholder="Enter artist status" />
    </div>

    <div>
      <label for="avatar">Avatar:</label>
      <input type="file" @change="handleFileChange" accept="image/*" />
    </div>

    <button @click="createArtist">Create Artist</button>

    <div v-if="responseMessage">
      <h3>Response</h3>
      <p>{{ responseMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const name = ref('');
const status = ref('');
const avatarFile = ref(null);
const avatarBase64 = ref('');
const responseMessage = ref('');

// Handle file change (read the image and convert to Base64)
const handleFileChange = (event) => {
  const file = event.target.files[0];
  avatarFile.value = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    avatarBase64.value = e.target.result.split(',')[1]; // Only keep the base64 string part
  };
  reader.readAsDataURL(file);
  console.log(avatarBase64.value);
};

// Function to create the artist
const createArtist = async () => {
  // Ensure all fields are filled in
  if (!name.value || !status.value || !avatarBase64.value || !avatarFile.value.type) {
    responseMessage.value = 'Please fill in all fields and upload a valid image.';
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
      responseMessage.value = `Success: ${responseData.message}, Artist ID: ${responseData.artistId}`;
    } else {
      const errorData = await response.json();
      responseMessage.value = `Error: ${errorData.message}`;
    }
  } catch (error) {
    responseMessage.value = `Error: ${error.message}`;
  }
};
</script>

<style scoped>
/* Add basic styling for the form */
div {
  margin-bottom: 10px;
}
label {
  margin-right: 10px;
}
input {
  padding: 5px;
  margin-bottom: 10px;
}
button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #45a049;
}
</style>
