import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import {createPinia} from 'pinia'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8000'

createApp(App)
    .use(router, axios)
    .use(createPinia())
    .mount('#app')
