<template>
  <div class="container rounded-3xl" style="border: 15px solid #111">
    <div class="shadow-xl shadow-cyan-500/50 w-full" style="background-color: #050505">
      <app-users-scroll class="mx-5 w-full" :users="updatedFollows"></app-users-scroll>
      <app-posts-feed :posts="updates"></app-posts-feed>
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
    }
  },
  async beforeMount() {
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
