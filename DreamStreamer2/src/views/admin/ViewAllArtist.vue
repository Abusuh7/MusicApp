<template>
  <div>
    <h2>Artist List</h2>
    <ul v-if="artists.length">
      <li v-for="artist in artists" :key="artist.ID">
        {{ artist.ID }}
        <h3>{{ artist.NAME }}</h3>
        <img :src="artist.AVATAR" alt="Avatar" width="100" />
        <p>Status: {{ artist.STATUS }}</p>
        <button @click="editArtist(artist)">Edit</button>
        <button @click="deleteArtist(artist.ID, artist.AVATAR)">Delete</button>
      </li>
      <br>
    </ul>

    <div v-if="showEditForm">
      <h3>Edit Artist</h3>
      <input v-model="editedArtist.NAME" type="text" />
      <input v-model="editedArtist.STATUS" type="text" />
      <input type="file" @change="onFileChange" />
      <button @click="updateArtist">Save</button>
      <button @click="cancelEdit">Cancel</button>
    </div>

    <div v-if="errorMessage">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  data() {
    return {
      artists: [],
      showEditForm: false,
      editedArtist: {},
      newAvatarFile: null,
      errorMessage: ''
    };
  },
  methods: {
    // Handle file change for image
    onFileChange(event) {
      this.newAvatarFile = event.target.files[0];
    },
    // Fetch all artists
    async fetchArtists() {
      try {
        const response = await fetch('https://x6krsc98il.execute-api.ap-southeast-1.amazonaws.com/dev/viewallartist');
        if (response.ok) {
          this.artists = await response.json();
        } else {
          this.errorMessage = "Failed to fetch artists";
        }
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    // Edit artist
    editArtist(artist) {
      this.editedArtist = { ...artist };
      this.showEditForm = true;
    },
    // Update artist
    async updateArtist() {
      const reader = new FileReader();
      reader.readAsDataURL(this.newAvatarFile);

      reader.onloadend = async () => {
        const base64String = reader.result.split(',')[1]; // Extract base64 string

        const requestData = {
          name: this.editedArtist.NAME,
          status: this.editedArtist.STATUS,
          avatarBase64: base64String,
          avatarMimeType: this.newAvatarFile.type,
          oldAvatarUrl: this.editedArtist.AVATAR
        };

        try {
          const response = await fetch(`https://x6krsc98il.execute-api.ap-southeast-1.amazonaws.com/dev/artistUpdate?artistId=${this.editedArtist.ID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
          });

          console.log(requestData )

          if (response.ok) {
            this.showEditForm = false;
            this.fetchArtists();
          } else {
            this.errorMessage = "Failed to update artist";
          }
        } catch (error) {
          this.errorMessage = error.message;
        }
      };
    },
    // Delete artist
    async deleteArtist(artistId, avatarUrl) {
      try {
        const response = await fetch(`https://x6krsc98il.execute-api.ap-southeast-1.amazonaws.com/dev/artistDelete?artistId=${artistId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatarUrl }) // Pass avatar URL to delete image
        });

        if (response.ok) {
          this.fetchArtists();
          alert('Artist deleted successfully');
        } else {
          this.errorMessage = "Failed to delete artist";
        }
      } catch (error) {
        this.errorMessage = error.message;
      }
    }
  },
  mounted() {
    this.fetchArtists();
  }
};
</script>
