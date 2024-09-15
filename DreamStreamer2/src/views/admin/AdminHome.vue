<script setup>
import NavbarComponent from "../../components/LoggedNavbar.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const toggleAddArtist = () => {
    router.push("/adminhome/addartist");
}

const toggleViewAllArtist = () => {
    router.push("/adminhome/viewartists");
}

const toggleAddGenre = () => {
    router.push("/adminhome/addgenre");
}

const toggleViewAllGenre = () => {
    router.push("/adminhome/viewgenres");
}

const toggleAddSong = () => {
    router.push("/adminhome/addsongs");
}

const toggleViewAllSong = () => {
    router.push("/adminhome/viewsongs");
}


</script>

<template>
    <NavbarComponent />
    <div>
        <h1>Admin Home</h1>
        <p>Welcome to the admin home page</p>
        <br>
        <button @click="toggleAddArtist">Add Artist</button>
        <br>
        <button @click="toggleViewAllArtist">View All Artist</button>
        <br><br>
        <button @click="toggleAddGenre">Add Genre</button>
        <br>
        <button @click="toggleViewAllGenre">View All Genre</button>
        <br><br>
        <button @click="toggleAddSong">Add Song</button>
        <br>
        <button @click="toggleViewAllSong">View All Songs</button>
    </div>
</template>