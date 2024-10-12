import { createWebHistory, createRouter } from 'vue-router'
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/SingUpView.vue";
import HomeView from "../views/HomeView.vue";

const routes = [
    {path: '/', name: 'home', component: HomeView},
    {path: '/login/', name: 'login', component: LoginView},
    {path: '/sing-up/', name: 'sing-up', component: RegisterView}
]

export const router = createRouter({
    routes,
    history: createWebHistory(),
    linkActiveClass: 'active',
    linkExactActiveClass: 'active'
})
