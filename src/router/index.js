import { createWebHistory, createRouter } from 'vue-router'
import {useAuthenticationStore} from '../stores/authenticationStore.js'
import LoginView from "../views/LoginView.vue"
import SingUpView from "../views/SingUpView.vue"
import FeedView from "../views/FeedView.vue"
import TwoFactorAuthenticationView from "../views/TwoFactorAuthenticationView.vue"
import NewPostView from "../views/NewPostView.vue"
import UserView from "../views/UserView.vue"
import SearchView from "../views/SearchView.vue"
import ExploreView from "../views/ExploreView.vue"
import SettingsView from "../views/SettingsView.vue"
import SavedPostsView from "../views/SavedPostsView.vue"
import ResetPasswordView from "../views/ResetPasswordView.vue"
import ChangePasswordView from "../views/ChangePasswordView.vue"

const routes = [
    {path: '/feed/', name: 'feed', component: FeedView, meta: {requireLogin: true}},
    {path: '/login/', name: 'login', component: LoginView, meta: {requireNoLogin: true}},
    {path: '/sing-up/', name: 'sing-up', component: SingUpView, meta: {requireNoLogin: true}},
    {path: '/2fa/', name: '2fa', component: TwoFactorAuthenticationView, meta: {requireNoLogin: true}},
    {path: '/reset-password/', name: 'reset-password', component: ResetPasswordView, meta: {requireNoLogin: true}},
    {path: '/new/', name: 'new-post', component: NewPostView, meta: {requireLogin: true}},
    {path: '/search/', name: 'search-user', component: SearchView, meta: {requireLogin: true}},
    {path: '/explore/', name: 'explore', component: ExploreView, meta: {requireLogin: true}},
    {path: '/saved/', name: 'saved-posts', component: SavedPostsView, meta: {requireLogin: true}},
    {path: '/settings/', name: 'settings', component: SettingsView, meta: {requireLogin: true}},
    {path: '/change-password/', name: 'change-password', component: ChangePasswordView, meta: {requireLogin: true}},
    {path: '/:username/', name: 'user', component: UserView, meta: {requireLogin: true}},
]

const router = createRouter({
    routes,
    history: createWebHistory(),
    linkActiveClass: 'active',
})

router.beforeEach((to, from, next) => {
    const authenticationStore = useAuthenticationStore()

    if (to.meta.requireLogin && !authenticationStore.isAuth) {
        return next({name: 'login'})
    }

    if (
        (to.meta.requireNoLogin && authenticationStore.isAuth)
        || (to.name === '2fa' && !(from.name === 'login'))
        || (to.path === '/')
    ) {
        return next({name: 'feed'})
    }

    return next()
})

export default router
