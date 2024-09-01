<template>
  <div id="app">
    <form @submit.prevent="login" name="login_form" class="login-form">
      <h1>Login to Your Account</h1>
      <input
          type="text"
          placeholder="Username"
          aria-label="Username"
          name="username"
          v-model="username"
          required
          autofocus
      />
      <input
          type="password"
          placeholder="Password"
          aria-label="Password"
          name="password"
          v-model="password"
          required
      />

      <span class="span">Don't have an account?</span>
      <router-link to="/signup" class="signup-btn">Create an account</router-link>

      <button type="submit" :disabled="!(username.length && password.length)">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const username = ref("");
const password = ref("");

const login = () => {
  alert(`Username: ${username.value}, Password: ${password.value}`);
};

</script>

<style scoped>
body {
  background-color: #fff;
}



h1 {
  font-size: 18px;
  font-weight: normal;
  margin: 0;
  padding: 0;
  margin-bottom: 20px;
}

form.login-form {
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 50px auto 0 auto;
  padding: 25px 15px;
  text-align: center;
  width: 100%;
}

span {
  margin-right: 5px;
  font-size: 12px;
  font-weight: normal;
}

input,
button {
  border-radius: 3px;
}

input {
  border: 1px solid #dbd9d9;
  display: block;
  font-size: 12px;
  margin-bottom: 15px;
  outline: 0;
  padding: 9px 12px;
  width: 100%;
}

input:focus {
  border: 3px solid #9bcb3b;
  outline: 0;
}

button {
  background-color: #9bcb3b;
  border: 0;
  font-size: 14px;
  font-weight: bold;
  height: 50px;
  margin-top: 10px;
  outline: 0;
  text-transform: uppercase;
  width: 100%;
}

button:hover {
  background-color: #88b732;
  cursor: pointer;
}

button:active {
  background-color: #7da530;
}

button[disabled] {
  background-color: #cccccc;
  color: #000;
  cursor: not-allowed;
}

@media (min-width: 768px) {
  body {
    background-color: #dadbdd;
  }

  form.login-form {
    margin-top: 150px;
    width: 375px;
  }
}
</style>
