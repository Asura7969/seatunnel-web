import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'
import './mock/index'

createApp(App).use(router).mount('#app')
