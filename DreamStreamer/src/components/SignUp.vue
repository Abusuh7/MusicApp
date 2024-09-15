<template>
    <div class="login-container">
      <div class="login-form">
        <h2>Login</h2>
  
        <!-- Username Input -->
        <div class="form-group">
          <label for="username">Username</label>
          <input
            v-model="username"
            type="text"
            id="username"
            placeholder="Enter Username"
          />
        </div>
  
        <!-- Password Input -->
        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Enter Password"
          />
        </div>
  
        <!-- Error Message -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
  
        <!-- Submit Button -->
        <button @click="loginUser" :disabled="loading">
          <span v-if="loading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { signIn, confirmSignUp, fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
  import { Amplify } from "aws-amplify";
  import awsconfig from "../aws-exports"; // Import the aws-exports.js file
  
  Amplify.configure(awsconfig); // Configure Amplify with the generated settings
  
  // Define refs for user input and error messages
  const username = ref("");
  const password = ref("");
  const verifcationCode = ref("");
  const verifcationPopup = ref(false);
  const errorMessage = ref("");
  const loading = ref(false);
  
  // Function to log in the user
  const loginUser = async () => {
    errorMessage.value = ""; // Clear previous errors
    loading.value = true; // Start loading state
  
    // Simple validation
    if (!username.value || !password.value) {
      errorMessage.value = "Username and password are required";
      loading.value = false;
      return;
    }
  
    try {
      const user = await signIn(username.value, password.value);
      if (user.nextStep.signInStep === "") {
        verifcationPopup.value = true;
        await confirmSignUp(verifcationCode.value);
        console.log("MFA required:", user);
        return;
      }
      console.log("Successfully logged in:", user);
      // Redirect or navigate to the desired page after successful login
    } catch (error) {
      console.error("Error signing in:", error);
      errorMessage.value = error.message || "An error occurred during login.";
    } finally {
      loading.value = false; // Stop loading state
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
  }
  
  .login-form {
    background: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 300px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    font-size: 14px;
    margin-bottom: 5px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
  }
  
  button[disabled] {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  button:hover:enabled {
    background-color: #45a049;
  }
  
  .error-message {
    color: red;
    margin-bottom: 10px;
  }
  </style>
  