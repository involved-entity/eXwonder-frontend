import { createWebHistory, createRouter } from 'vue-router'
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/SingUpView.vue";
import HomeView from "../views/HomeView.vue";
import {useAuthenticationStore} from '../stores/authenticationStore.js'
import TwoFactorAuthenticationView from "../views/TwoFactorAuthenticationView.vue";
import NewPostView from "../views/NewPostView.vue";
import UserView from "../views/UserView.vue";
import SearchView from "../views/SearchView.vue";

const routes = [
    {path: '/', name: 'home', component: HomeView, meta: {requireLogin: true}},
    {path: '/login/', name: 'login', component: LoginView, meta: {requireNoLogin: true}},
    {path: '/sing-up/', name: 'sing-up', component: RegisterView, meta: {requireNoLogin: true}},
    {path: '/2fa/', name: '2fa', component: TwoFactorAuthenticationView, meta: {requireNoLogin: true}},
    {path: '/new/', name: 'new-post', component: NewPostView, meta: {requireLogin: true}},
    {path: '/search/', name: 'search-user', component: SearchView, meta: {requireLogin: true}},
    {path: '/:username/', name: 'user', component: UserView, meta: {requireLogin: true}, props: true},
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

    if (to.name === '2fa') {
        if (!(from.name === 'login')) {return next('/login/')}
    }

    return next()
})

export default router
