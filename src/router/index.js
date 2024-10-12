import { createWebHistory, createRouter } from 'vue-router'
import LoginView from "../views/LoginView.vue";

const routes = [
    {path: '/login/', name: 'login', component: LoginView}
]

export const router = createRouter({
    routes,
    history: createWebHistory()
})
