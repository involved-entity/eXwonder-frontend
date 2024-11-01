<template>
  <div class="container-border">
    <div class="shadow">
      <div class="py-10" v-if="loading">
        <div class="loader mx-auto"></div>
      </div>
      <app-swipe-component class="" @swipe-left="scroll(-200)" @swipe-right="scroll(200)" v-if="showSwipeScroll">
        <app-users-scroll class="mx-5 w-full" :users="updatedFollows" ref="users" @scroll="scroll" v-if="!loading"></app-users-scroll>
      </app-swipe-component>
      <app-users-scroll class="mx-5 w-full" @scroll="scroll" ref="users" :users="updatedFollows" v-if="!loading && !showSwipeScroll"></app-users-scroll>
      <app-posts-feed :posts="updates" v-if="!loading"></app-posts-feed>
    </div>
  </div>
  <div class="relative">
    <div class="fixed left-5 top-5">
      <app-alert message="Success log in." v-if="this.$route.query.action === 'login'"/>
    </div>
  </div>
</template>

<script>
import {usePostsStore} from "../stores/postsStore.js"
import AppUsersScroll from "../components/AppUsersScroll.vue"
import AppSwipeComponent from "../components/AppSwipeComponent.vue"
import AppPostsFeed from "../components/AppPostsFeed.vue"
import AppAlert from "../components/AppAlert.vue"
import {mapStores} from "pinia"

export default {
  data() {
    return {
      updates: [],
      updatedFollows: [],
      loading: false,
      showSwipeScroll: false
    }
  },
  methods: {
    scroll(value) {
      this.$refs.users.scrollBy({left: value, behavior: 'smooth'})
    },
    checkScreenWidth() {
      this.showSwipeScroll = window.innerWidth > 1024
    },
  },
  async beforeMount() {
    this.loading = true
    const response = await this.postsStore.getUserPosts('') // wtf yeah?
    this.updates = response.data.results
    const followsUsernames = []
    this.updates.forEach(post => {
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
  beforeDestroy() {
    window.removeEventListener('resize', this.checkScreenWidth)
  },
  computed: {...mapStores(usePostsStore)},
  components: {AppUsersScroll, AppPostsFeed, AppAlert, AppSwipeComponent}
}
</script>
