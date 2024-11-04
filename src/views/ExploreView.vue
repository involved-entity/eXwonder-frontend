<template>
  <main>
    <div class="container-border">
      <div class="shadow">
        <div class="header-3xl !mt-0 space-x-5">
          <button
              class="header-transition varela-round"
              :class="{'active-tab': activeTab === 0}"
              @click="changeActiveTab('recent')"
          >Recent</button>
          <button
              class="header-transition varela-round"
              :class="{'active-tab': activeTab === 1}"
              @click="changeActiveTab('likes')"
          >Likes</button>
        </div>
        <div class="ps-3 pr-3 pb-3 h-1 hidden lg:block">
          <hr class="border border-gray-600">
        </div>
        <div class="py-10" v-if="loading">
          <div class="loader mx-auto"></div>
        </div>
        <app-posts-grid :posts="topPosts" v-if="!loading"></app-posts-grid>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import {PropType} from "vue";
import {IPost, Tops} from "../types/globals";
import {usePostsStore} from "../stores/postsStore.ts"
import {mapStores} from "pinia"
import AppPostsGrid from "../components/AppPostsGrid.vue"
import {IResponse} from "../types/helpers";

export default {
  data() {
    return {
      activeTab: 0,
      topPosts: [] as PropType<Array<IPost>>,
      loading: false
    }
  },
  methods: {
    async getTopPosts(top: Tops = Tops.RECENT) {
      this.loading = true
      const response: IResponse = await this.postsStore.getPostsTop(top)
      this.topPosts = response.data.results
      this.loading = false
    },
    async changeActiveTab(top: Tops = Tops.RECENT) {
      if ((top === Tops.RECENT && this.activeTab === 1) || (top === Tops.LIKES && this.activeTab === 0)) {
        await this.getTopPosts(top)
        switch (top) {
          case Tops.RECENT:
            this.activeTab = 0
            break
          case Tops.LIKES:
            this.activeTab = 1
            break
        }
      }
    }
  },
  async beforeMount() {
    await this.getTopPosts()
  },
  computed: {...mapStores(usePostsStore)},
  components: {AppPostsGrid}
}
</script>
