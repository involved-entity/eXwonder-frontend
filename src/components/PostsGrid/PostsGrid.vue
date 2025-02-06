<template>
  <div class="ps-0.5 pr-1 pb-1" v-if="sortedPosts.length">
    <div class="grid grid-cols-3 space-x-0.5 space-y-0.5">
      <PostsList @postClick="postClick" :posts="sortedPosts" />
      <div class="hidden lg:block" v-if="visibleModalPosts.length">
        <PostModal
          :post="visibleModalPosts[0]"
          @close="exitModal(visibleModalPosts[0])"
          @pinPost="pinPost"
        />
      </div>
    </div>
  </div>
  <div class="text-gray-700 dark:text-gray-500 pb-10 w-full" v-else>
    <NoResults />
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { IPost } from "../../types/globals";
import { isElementInViewport } from "../../helpers";
import PostModal from "../modals/PostModal/PostModal.vue";
import PostsList from "./PostsList.vue";
import NoResults from "../NoResults.vue";
import { sortPostsByPinned } from "../../services";

export default {
  emits: ["updatePostsScroll"],
  props: {
    posts: {
      type: Array as PropType<Array<IPost>>,
      required: true,
    },
    pinnedMode: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      isPostsMayBeUpdated: false,
      isLoading: false,
      sortedPosts: [] as IPost[],
    };
  },
  computed: {
    visibleModalPosts() {
      return this.sortedPosts.filter(post => post.isModalVisible);
    },
  },
  methods: {
    showModal(post: IPost) {
      post.isModalVisible = true;
    },
    exitModal(post: IPost) {
      post.isModalVisible = false;
    },
    postClick(post: IPost) {
      if (window.innerWidth >= 1024) {
        this.showModal(post);
      } else {
        this.$router.push({
          name: "user-post",
          params: { username: post.author.username, id: post.id },
        });
      }
    },
    checkScroll() {
      if (this.isPostsMayBeUpdated && !this.isLoading) {
        const element = document.querySelector(".scrollEnd") as HTMLElement;
        if (isElementInViewport(element)) {
          this.isLoading = true;
          this.$emit("updatePostsScroll");
        }
      }
    },
    pinPost(post: IPost) {
      post.pinned = !post.pinned;
      this.sortedPosts = sortPostsByPinned(this.posts);
    },
  },
  mounted() {
    this.isPostsMayBeUpdated = this.posts.length % 50 === 0;
    window.addEventListener("scroll", this.checkScroll);
    if (this.pinnedMode) this.sortedPosts = sortPostsByPinned(this.posts);
    else this.sortedPosts = this.posts;
  },
  unmounted() {
    window.removeEventListener("scroll", this.checkScroll);
  },
  watch: {
    posts: {
      handler(newPosts) {
        this.isPostsMayBeUpdated = newPosts.length % 50 === 0;
        if (this.pinnedMode) this.sortedPosts = sortPostsByPinned(this.posts);
        else this.sortedPosts = this.posts;
        this.isLoading = false;
      },
      deep: true,
    },
  },
  components: { NoResults, PostsList, PostModal },
};
</script>
