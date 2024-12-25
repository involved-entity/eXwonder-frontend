<template>
  <div class="pb-3" v-for="post in posts" :key="post.id">
    <FeedHeader :post="post" @postDelete="postDelete" />
    <FeedImages :post="post" />
    <FeedButtons :post="post" />
    <div class="text-gray-600 dark:text-gray-300" v-if="post.signature.length">
      <span class="text-gray-700 dark:text-white montserrat-bold">{{ post.author.username }}</span>
      {{ post.signature }}
    </div>
    <div>
      <button
        class="text-gray-700 dark:text-white montserrat-bold hover:text-gray-600 dark:hover:text-gray-400"
        @click="showComments(post)"
        v-if="post.comments_count > 0"
      >
        View all
        <span class="varela-round">{{ post.comments_count }}</span> comments
      </button>
    </div>
    <FeedCreateComment :post="post" />
    <div class="h-1 pt-3">
      <hr class="border border-gray-600" />
    </div>
  </div>
</template>

<script lang="ts">
import { Dropdown } from "flowbite";
import { IPost } from "../../types/globals";
import { mapStores } from "pinia";
import { usePostsStore } from "../../stores/postsStore.ts";
import { useAuthenticationStore } from "../../stores/authenticationStore.ts";
import FeedHeader from "./FeedHeader.vue";
import FeedImages from "./FeedImages.vue";
import FeedButtons from "./FeedButtons.vue";
import FeedCreateComment from "./FeedCreateComment.vue";

export default {
  name: "PostsFeedList",
  emits: ['setActiveModalPost', 'setActiveModalCommentsPost'],
  components: { FeedCreateComment, FeedButtons, FeedImages, FeedHeader },
  props: {
    posts: { type: Array as () => Array<IPost>, required: true },
    closableMode: { type: Boolean, default: false }
  },
  methods: {
    showComments(post: IPost) {
      const isDesktop = window.innerWidth >= 1024;
      this.$emit(isDesktop ? 'setActiveModalPost' : 'setActiveModalCommentsPost', post)
    },
    getPostIndex(postToFind: IPost) {
      return this.posts.findIndex(post => post.id === postToFind.id);
    },
    async postDelete(post: IPost) {
      if (this.authenticationStore.user.id === post.author.id) {
        const { success } = await this.postsStore.deletePost(post.id);
        if (success) {
          if (this.closableMode) {
            this.$router.push({
              path: "/" + this.authenticationStore.user.username + "/",
              query: { action: "post-deleted" },
            });
          } else {
            this.posts.splice(this.getPostIndex(post), 1);
          }
        }
      }
    },
  },
  mounted() {
    this.posts.forEach((post: IPost) => {
      const $targetEl = document.getElementById(`dropdownMenu${post.id}`);
      const $triggerEl = document.getElementById(`dropdownButton${post.id}`);

      const options = {
        placement: "bottom",
        offsetSkidding: 0,
        offsetDistance: 10,
      };

      if ($targetEl) {
        new Dropdown($targetEl, $triggerEl, options);
      }
    });
  },
  computed: {
    ...mapStores(usePostsStore, useAuthenticationStore),
  },
};
</script>
