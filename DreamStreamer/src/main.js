import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css';
//in your `main.js` file
import '../node_modules/flowbite-vue/dist/index.css'
import { Amplify } from "aws-amplify";
import awsconfig from "../aws-exports"; // Import the aws-exports.js file
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

Amplify.configure(awsconfig); // Configure Amplify with the generated settings

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)

app.mount('#app')
