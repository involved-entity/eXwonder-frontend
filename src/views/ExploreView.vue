<template>
  <main>
    <div class="container-border">
      <div class="shadow">
        <div class="flex flex-col w-full">
          <div
            class="header-xl !mb-0 space-x-1 sm:w-fit mx-auto sm:px-4 py-2 rounded-sm flex md:flex-no-wrap sm:flex-wrap cursor-pointer varela-round"
          >
            <div
              v-for="(tab, index) in tabs"
              :key="index"
              class="px-3 rounded-b-md"
              :class="{
                'border-b-2 border-[#008c8c]': activeTab === index,
                'hover:border-b-2 hover:border-[#008c8c]': activeTab !== index,
              }"
              @click="changeActiveTab(tab)"
            >
              {{ tab.name }}
            </div>
          </div>
        </div>
        <div class="py-10" v-if="loading">
          <div class="loader mx-auto"></div>
        </div>
        <PostsGrid :posts="topPosts" @updatePostsScroll="getPostsNextPage" v-if="!loading" />
        <div class="py-10" v-if="loadingNextPage">
          <div class="loader mx-auto"></div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { IPost, Tops } from "../types/globals";
import { usePostsStore } from "../stores/postsStore.ts";
import { mapStores } from "pinia";
import PostsGrid from "../components/PostsGrid/PostsGrid.vue";
import { IResponse } from "../types/helpers";

export default {
  data() {
    return {
      tabs: [
        { name: "Recs", value: Tops.RECOMMENDED },
        { name: "Recent", value: Tops.RECENT },
        { name: "Likes", value: Tops.LIKES },
      ],
      activeTab: 0,
      topPosts: [] as Array<IPost>,
      loading: false,
      loadingNextPage: false,
      currentPage: undefined as number | undefined,
    };
  },
  methods: {
    async getTopPosts(top: Tops = Tops.RECOMMENDED) {
      this.loading = true;
      const response: IResponse = await this.postsStore.getPostsTop(top);
      this.topPosts = response.data.results;
      this.currentPage = response.data.next ? 2 : undefined;
      this.loading = false;
    },
    async changeActiveTab(tab: { name: string; value: Tops }) {
      if (this.activeTab !== this.tabs.indexOf(tab)) {
        await this.getTopPosts(tab.value);
        this.activeTab = this.tabs.indexOf(tab);
      }
    },
    async getPostsNextPage() {
      if (this.currentPage && this.activeTab === 0) {
        this.loadingNextPage = true;
        const { data } = await this.postsStore.getPostsTop(Tops.RECOMMENDED, this.currentPage);
        this.topPosts.push(...data.results);
        this.currentPage = data.next ? this.currentPage + 1 : undefined;
        this.loadingNextPage = false;
      }
    },
  },
  async mounted() {
    await this.getTopPosts();
  },
  computed: { ...mapStores(usePostsStore) },
  components: { PostsGrid },
};
</script>
