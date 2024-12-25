<template>
  <div class="container-border">
    <div class="shadow">
      <div class="py-10" v-if="loading">
        <div class="loader mx-auto"></div>
      </div>
      <div v-else-if="updates.length">
        <SwipeComponent
          @swipe-left="scroll(-200)"
          @swipe-right="scroll(200)"
          v-if="!loading && showSwipeScroll"
        >
          <UsersScroll :users="updatedFollows" ref="users" @scroll="scroll" v-if="!loading" />
        </SwipeComponent>
        <UsersScroll
          @scroll="scroll"
          ref="users"
          :users="updatedFollows"
          v-if="!loading && !showSwipeScroll"
        />
        <PostsFeed :posts="updates" v-if="!loading" />
      </div>
      <div class="text-gray-600 dark:text-gray-500 py-10" v-else>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-36 mx-auto"
        >
          <path
            fill-rule="evenodd"
            d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
            clip-rule="evenodd"
          />
        </svg>
        <div class="header-3xl !text-gray-500 !mt-0">No updates for now.</div>
      </div>
    </div>
  </div>
  <Alert :message="alertMessage" v-if="showAlert" />
</template>

<script lang="ts">
import { IPost, IUserDefaultData } from "../types/globals";
import { usePostsStore } from "../stores/postsStore.ts";
import UsersScroll from "../components/UsersScroll.vue";
import SwipeComponent from "../components/SwipeComponent.vue";
import PostsFeed from "../components/PostsFeed/PostsFeed.vue";
import Alert from "../components/alert/Alert.vue";
import { mapStores } from "pinia";
import { IResponse } from "../types/helpers";
import { getUpdatedFollows } from "../services";

export default {
  data() {
    return {
      updates: [] as Array<IPost>,
      updatedFollows: [] as Array<IUserDefaultData>,
      loading: false,
      alertMessage: "Success log in." as string,
      windowSize: window.innerWidth as number,
    };
  },
  methods: {
    scroll(value: number) {
      (this.$refs.users as HTMLElement).scrollBy({
        left: value,
        behavior: "smooth",
      });
    },
    handleResize() {
      this.windowSize = window.innerWidth;
    },
  },
  async mounted() {
    window.addEventListener("resize", this.handleResize);

    this.loading = true;

    const response: IResponse = await this.postsStore.getPostsTop();
    this.updates = response.data.results;
    this.updatedFollows = getUpdatedFollows(response.data.results);

    this.loading = false;
  },
  computed: {
    ...mapStores(usePostsStore),
    showSwipeScroll() {
      return this.windowSize < 1024;
    },
    showAlert() {
      return this.$route.query.action === "login";
    },
  },
  components: { UsersScroll, PostsFeed, Alert, SwipeComponent },
};
</script>
