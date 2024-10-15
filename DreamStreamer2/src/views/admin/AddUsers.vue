<template>
    <AdminHomeTest>
      <div class="container">
        <h1 class="title">Create New User</h1>
  
        <!-- Modal content for creating a new user -->
        <div class="modal-content">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            v-model="newUser.username"
            placeholder="Enter username"
            class="input-field"
          />
  
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="newUser.email"
            placeholder="Enter email"
            class="input-field"
          />
  
          <label for="role">Role</label>
          <select id="role" v-model="newUser.role" class="select-field">
            <option value="0">User</option>
            <option value="1">Admin</option>
          </select>
  
          <div class="button-container">
            <button class="modal-btn primary-btn" @click="createUser">Create User</button>
            <button class="modal-btn cancel-btn" @click="clearForm">Clear Form</button>
          </div>
        </div>
      </div>
    </AdminHomeTest>
  </template>
  
  <script setup>
  import AdminHomeTest from "@/layouts/AdminHomeTest.vue";
  import { ref } from "vue";
  
  // New user data
  const newUser = ref({
    username: '',
    email: '',
    role: '0'  // Default to User role
  });
  
  // Function to create a new user by calling the backend Lambda function
  const createUser = async () => {
    try {
      const requestBody = {
        username: newUser.value.username,
        email: newUser.value.email,
        password: "aaAA12!@",  // Default temporary password
        role: newUser.value.role
      };
  
      const response = await fetch(
        "https://6vq0xwus5b.execute-api.ap-southeast-1.amazonaws.com/dev/userCreate",  // Replace with your Lambda API endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        }
      );
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error("Failed to create user: " + errorMessage);
      }
  
      console.log("User created successfully:", await response.json());
      clearForm(); // Clear form after successful creation
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  
  // Function to clear the form
  const clearForm = () => {
    newUser.value = {
      username: '',
      email: '',
      role: '0'  // Default role
    };
  };
  </script>
  
  <style scoped>
  .container {
    margin: 0 auto;
    padding: 20px;
    max-width: 600px;
    font-family: Arial, sans-serif;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .title {
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
    font-weight: bold;
    color: #333;
  }
  
  .modal-content {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .modal-content label {
    font-weight: bold;
    font-size: 14px;
    color: #333;
  }
  
  .input-field {
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 14px;
    transition: border 0.3s;
  }
  
  .input-field:focus {
    border-color: #4caf50;
    outline: none;
  }
  
  .select-field {
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 14px;
    transition: border 0.3s;
  }
  
  .select-field:focus {
    border-color: #4caf50;
    outline: none;
  }
  
  .button-container {
    display: flex;
    gap: 10px;
  }
  
  .modal-btn {
    padding: 12px 16px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;
    flex: 1;
  }
  
  .primary-btn {
    background-color: #555;
    color: white;
    border: none;
  }
  
  .primary-btn:hover {
    background-color: #434343;
  }
  
  .cancel-btn {
    background-color: #f44336;
    color: white;
    border: none;
  }
  
  .cancel-btn:hover {
    background-color: #e41c1c;
  }
  </style>
  