<script setup>
import { ref } from "vue";
import { signUp } from "aws-amplify/auth";

const username = ref("");
const email = ref("");
const password = ref("");

const signUpUser = async () => {
    try {
        await signUp({
            username: username.value,
            password: password.value,
            options: {
                userAttributes: {
                    email: email.value,
                    custome:role
                }
            },
        });
    } catch (error) {
        console.error("Error signing up user:", error);
    }
};


</script>


<template>
    <div>
        <form >
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" placeholder="Enter Username">
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="Enter Email">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Enter Password">
            </div>
            <button>Submit</button>
        </form>
    </div>
</template>