import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import JuridicalTerms from './views/JuridicalTerms.vue'
import Laws from './views/Laws.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/juridical-terms', component: JuridicalTerms },
  { path: '/laws', component: Laws }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')