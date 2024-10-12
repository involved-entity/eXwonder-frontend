import { createWebHistory, createRouter } from 'vue-router'
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/SingUpView.vue";

const routes = [
    {path: '/login/', name: 'login', component: LoginView},
    {path: '/sing-up/', name: 'sing-up', component: RegisterView}
]

export const router = createRouter({
    routes,
    history: createWebHistory()
})
