<template>
  <div class="container" style="border: 15px solid #111; background-color: #272727">
    <div class="shadow-xl shadow-cyan-500/50 w-full">
      <div class="py-10" v-if="loading">
        <div class="loader mx-auto"></div>
      </div>
      <app-users-scroll class="mx-5 w-full" :users="updatedFollows" v-if="!loading"></app-users-scroll>
      <app-posts-feed :posts="updates" v-if="!loading"></app-posts-feed>
    </div>
  </div>
</template>

<script>
import {usePostsStore} from "../stores/postsStore.js";
import AppUsersScroll from "../components/AppUsersScroll.vue";
import AppPostsFeed from "../components/AppPostsFeed.vue";
import {mapStores} from "pinia";

export default {
  data() {
    return {
      updates: [],
      updatedFollows: [],
      loading: false
    }
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
  computed: {
    ...mapStores(usePostsStore)
  },
  components: {
    AppUsersScroll,
    AppPostsFeed
  }
}
</script>
