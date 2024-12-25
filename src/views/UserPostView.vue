<template>
  <div class="text-gray-300" v-if="error">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-60 m-auto"
    >
      <path
        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <p class="text-4xl text-center pb-5">Error fetch post :(</p>
  </div>
  <div class="py-10" v-else-if="loading">
    <div class="loader mx-auto"></div>
  </div>
  <div v-else-if="post && post.author">
    <PostsFeed :posts="[post]" :closable-mode="true" @close="exitFeed" />
  </div>
</template>

<script lang="ts">
import { mapStores } from "pinia";
import { usePostsStore } from "../stores/postsStore.ts";
import PostsFeed from "../components/PostsFeed/PostsFeed.vue";
import { IPost } from "../types/globals";

export default {
  data() {
    return {
      post: undefined as IPost | undefined,
      error: false,
      loading: false,
    };
  },
  methods: {
    exitFeed() {
      this.$router.go(-1);
    },
  },
  async mounted() {
    this.loading = true;
    const { success, data } = await this.postsStore.getPost(+this.$route.params.id);
    if (success) {
      this.post = data;
      this.post!.activeImage = 0;
    } else {
      this.error = true;
    }
    this.loading = false;
  },
  computed: { ...mapStores(usePostsStore) },
  components: { PostsFeed },
};
</script>
