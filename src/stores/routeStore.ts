import {defineStore} from "pinia"
import {IRouteStoreState} from "../types/stores";

export const useRouteStore = defineStore('route', {
    state(): IRouteStoreState {
        return {
            activeLink: 'feed'
        }
    },
    actions: {
        changeActiveLink(link: string) {
            this.activeLink = link
        }
    }
})
