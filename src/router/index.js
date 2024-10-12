import { createWebHistory, createRouter } from 'vue-router'
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/SingUpView.vue";
import HomeView from "../views/HomeView.vue";
import {useAuthenticationStore} from '../stores/authenticationStore.js'

const routes = [
    {path: '/', name: 'home', component: HomeView, meta: {requireLogin: true}},
    {path: '/login/', name: 'login', component: LoginView, meta: {requireNoLogin: true}},
    {path: '/sing-up/', name: 'sing-up', component: RegisterView, meta: {requireNoLogin: true}}
]

const router = createRouter({
    routes,
    history: createWebHistory(),
    linkActiveClass: 'active',
    linkExactActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
    const authenticationStore = useAuthenticationStore()
    if (to.meta.requireLogin) {
        if (!authenticationStore.isAuth) {
            return next('/login/')
        }
    } else if (to.meta.requireNoLogin) {
        if (authenticationStore.isAuth) {
            return next('/')
        }
    }
    return next()
})

export default router
