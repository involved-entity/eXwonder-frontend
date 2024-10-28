<template>
  <main>
    <div class="container" style="border: 15px solid #111; background-color: #272727">
      <div class="shadow-xl shadow-cyan-500/50">
        <div class="p1">
          <div class="text-center text-gray-300 font-bold text-3xl space-x-5">
            <button
                class="transition-all duration-300 hover:text-gray-400"
            >Saved</button>
          </div>
          <div class="ps-3 pr-3 pb-5 h-1">
            <hr class="border border-gray-600">
          </div>
          <div class="pb-5" v-if="loading">
            <div class="loader mx-auto"></div>
          </div>
          <app-posts-grid :posts="saved" v-if="!loading"/>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import AppPostsGrid from "../components/AppPostsGrid.vue";
import {usePostsStore} from "../stores/postsStore.js";
import {mapStores} from "pinia";

export default {
  components: {AppPostsGrid},
  data() {
    return {
      loading: false,
      saved: []
    }
  },
  methods: {
    async getPostsSaved() {
      this.loading = true
      const response = await this.postsStore.getSavedPosts()
      this.saved = response.data.results
      this.saved = this.saved.map(post => {
        post.post.likes_count = post.likes_count
        post.post.comments_count = post.comments_count
        post.post.is_liked = post.is_liked
        post.post.is_commented = post.is_commented
        post.post.is_saved = post.is_saved
        return post.post
      })
      this.loading = false
    }
  },
  async mounted() {
    await this.getPostsSaved()
  },
  computed: {...mapStores(usePostsStore)}
}
</script>
