<template>
  <main >
    <div class="container" style="border: 15px solid #111; background-color: #272727">
      <div class="shadow-xl shadow-cyan-500/50">
        <div class="p1">
          <div class="text-center text-gray-300 font-bold text-3xl space-x-5">
            <button
                class="transition-all duration-300 hover:text-gray-400"
                @click="changeActiveTab('recent')"
            >Recent</button>
            <button
                class="transition-all duration-300 hover:text-gray-400"
                @click="changeActiveTab('likes')"
            >Likes</button>
          </div>
          <div class="ps-3 pr-3 pb-5 h-1">
            <hr class="border border-gray-600">
          </div>
          <div class="py-10" v-if="loading">
            <div class="loader mx-auto"></div>
          </div>
          <app-posts-grid :posts="topPosts" v-if="!loading"></app-posts-grid>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import {usePostsStore} from "../stores/postsStore.js";
import {mapStores} from "pinia";
import AppPostsGrid from "../components/AppPostsGrid.vue";

export default {
  data() {
    return {
      activeTab: 0,
      topPosts: [],
      loading: false
    }
  },
  methods: {
    async getTopPosts(top = 'recent') {
      this.loading = true
      const response = await this.postsStore.getPostsTop(top)
      this.topPosts = response.data.results
      this.loading = false
    },
    async changeActiveTab(top = 'recent') {
      if ((top === 'recent' && this.activeTab === 1) || (top === 'likes' && this.activeTab === 0)) {
        await this.getTopPosts(top)
        switch (top) {
          case 'recent':
            this.activeTab = 0
            break
          case 'likes':
            this.activeTab = 1
            break
        }
      }
    }
  },
  async beforeMount() {
    await this.getTopPosts()
  },
  computed: {
    ...mapStores(usePostsStore)
  },
  components: {
    AppPostsGrid
  }
}
</script>
