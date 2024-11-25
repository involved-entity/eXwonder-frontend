<template>
  <div class="container-border">
    <div class="shadow">
      <div class="py-10" v-if="loading">
        <div class="loader mx-auto"></div>
      </div>
      <div v-else-if="updates.length">
        <app-swipe-component class="" @swipe-left="scroll(-200)" @swipe-right="scroll(200)" v-if="showSwipeScroll">
          <app-users-scroll class="mx-5 w-full" :users="updatedFollows" ref="users" @scroll="scroll" v-if="!loading"></app-users-scroll>
        </app-swipe-component>
        <app-users-scroll class="mx-5 w-full" @scroll="scroll" ref="users" :users="updatedFollows" v-if="!loading && !showSwipeScroll"></app-users-scroll>
        <app-posts-feed :posts="updates" v-if="!loading"></app-posts-feed>
      </div>
      <div class="text-gray-600 dark:text-gray-500 py-10" v-else>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-36 mx-auto">
          <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
        </svg>
        <div class="header-3xl !text-gray-500 !mt-0">No updates for now.</div>
      </div>
    </div>
  </div>
  <div class="relative">
    <div class="fixed left-5 top-5 z-50">
      <app-alert message="Success log in." v-if="$route.query.action === 'login'"/>
    </div>
  </div>
</template>

<script lang="ts">
import {IPost, IUserDefaultData} from "@/types/globals/index.js";
import {usePostsStore} from "../stores/postsStore.ts"
import AppUsersScroll from "../components/AppUsersScroll.vue"
import AppSwipeComponent from "../components/AppSwipeComponent.vue"
import AppPostsFeed from "../components/AppPostsFeed.vue"
import AppAlert from "../components/AppAlert.vue"
import {mapStores} from "pinia"
import {IResponse} from "@/types/helpers";

export default {
  data() {
    return {
      updates: [] as Array<IPost>,
      updatedFollows: [] as Array<IUserDefaultData>,
      loading: false,
      showSwipeScroll: false
    }
  },
  methods: {
    scroll(value: number) {
      const users: Element = this.$refs.users
      users.scrollBy({left: value, behavior: 'smooth'})
    },
    checkScreenWidth() {
      this.showSwipeScroll = window.innerWidth > 1024
    },
  },
  async beforeMount() {
    this.loading = true
    const response: IResponse = await this.postsStore.getPostsTop()
    this.updates = response.data.results
    const followsUsernames: Array<string> = []
    this.updates.forEach((post: IPost) => {
      if (!followsUsernames.includes(post.author.username)) {
        this.updatedFollows.push(post.author)
        followsUsernames.push(post.author.username)
      }
      post.activeImage = 0
    })
    this.loading = false
  },
  mounted() {
    this.checkScreenWidth()
    window.addEventListener('resize', this.checkScreenWidth)
  },
  computed: {...mapStores(usePostsStore)},
  components: {AppUsersScroll, AppPostsFeed, AppAlert, AppSwipeComponent}
}
</script>
