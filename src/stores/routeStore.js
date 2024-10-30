import {defineStore} from "pinia"

export const useRouteStore = defineStore('route', {
    state() {
        return {
            activeLink: 'feed'
        }
    },
    actions: {
        changeActiveLink(link) {
            this.activeLink = link
        }
    }
})
