<template>
  <main>
    <div class="container-border">
      <div class="shadow">
        <div class="header-3xl header-transition varela-round">Saved</div>
        <div class="ps-3 pr-3 pb-3 h-1 hidden lg:block">
          <hr class="border border-gray-600" />
        </div>
        <div class="pb-5 pt-5" v-if="loading">
          <div class="loader mx-auto"></div>
        </div>
        <app-posts-grid :posts="saved" v-if="!loading" />
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import AppPostsGrid from "../components/AppPostsGrid.vue";
import { usePostsStore } from "../stores/postsStore.ts";
import { mapStores } from "pinia";
import { IPost } from "@/types/globals";
import { IResponse } from "@/types/helpers";

export default {
  data() {
    return {
      loading: false,
      saved: [] as Array<IPost>,
    };
  },
  methods: {
    async getPostsSaved() {
      this.loading = true;
      const response: IResponse = await this.postsStore.getSavedPosts();
      this.saved = response.data.results;

      this.saved = this.saved.map((post: IPost) => {
        post.post.likes_count = post.likes_count;
        post.post.comments_count = post.comments_count;
        post.post.is_liked = post.is_liked;
        post.post.is_commented = post.is_commented;
        post.post.is_saved = post.is_saved;
        return post.post;
      });

      this.loading = false;
    },
  },
  async mounted() {
    await this.getPostsSaved();
  },
  computed: { ...mapStores(usePostsStore) },
  components: { AppPostsGrid },
};
</script>
