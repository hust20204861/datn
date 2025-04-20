// import './assets/main.css'
import './index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './language/i18n'

const app = createApp(App)
app.use(router)
app.mount('#app')
app.use(i18n)
