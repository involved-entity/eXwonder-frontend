<template>
  <main>
    <div class="container-border">
      <div class="shadow">
        <div class="!mt-0 flex flex-col w-full">
          <div
            class="header-xl !mb-0 sm:w-fit mx-auto sm:px-4 py-2 rounded-sm flex md:flex-no-wrap sm:flex-wrap cursor-pointer varela-round"
          >
            <div class="px-3 rounded-b-md border-b-2 border-[#008c8c]">Saved</div>
          </div>
        </div>
        <div class="py-10" v-if="loading">
          <div class="loader mx-auto"></div>
        </div>
        <PostsGrid :posts="saved" @updatePostsScroll="getPostsNextPage" v-if="!loading" />
        <div class="py-10" v-if="loadingNextPage">
          <div class="loader mx-auto"></div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import PostsGrid from "../components/PostsGrid/PostsGrid.vue";
import { usePostsStore } from "../stores/postsStore.ts";
import { mapStores } from "pinia";
import { IPost } from "../types/globals";
import { IResponse } from "../types/helpers";

export default {
  data() {
    return {
      loading: false,
      saved: [] as Array<IPost>,
      loadingNextPage: false,
      currentPage: undefined as number | undefined,
    };
  },
  methods: {
    formatSavedPost(post: IPost) {
      return {
        ...post.post,
        likes_count: post.likes_count,
        comments_count: post.comments_count,
        is_liked: post.is_liked,
        is_commented: post.is_commented,
        is_saved: post.is_saved,
      };
    },
    async getPostsSaved() {
      this.loading = true;
      const response: IResponse = await this.postsStore.getSavedPosts();
      this.saved = response.data.results.map(this.formatSavedPost);
      this.currentPage = response.data.next ? 2 : undefined;
      this.loading = false;
    },
    async getPostsNextPage() {
      if (this.currentPage) {
        this.loadingNextPage = true;
        const { data } = await this.postsStore.getSavedPosts(this.currentPage);
        this.saved.push(...data.results.map(this.formatSavedPost));
        this.currentPage = data.next ? this.currentPage + 1 : undefined;
        this.loadingNextPage = false;
      }
    },
  },
  async mounted() {
    await this.getPostsSaved();
  },
  computed: { ...mapStores(usePostsStore) },
  components: { PostsGrid },
};
</script>
