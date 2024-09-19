import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import cognitoConfig from './cognitoConfig'
import { Amplify } from 'aws-amplify'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import { createPinia } from 'pinia'


Amplify.configure(cognitoConfig)
const app = createApp(App)

// Register the FontAwesomeIcon globally
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)

app.mount('#app')
