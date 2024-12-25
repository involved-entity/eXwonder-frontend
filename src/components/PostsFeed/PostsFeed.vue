<template>
  <div class="max-w-sm px-3 mx-auto">
    <div class="flex text-gray-700 dark:text-gray-300 my-3" v-if="closableMode">
      <button type="button" class="cursor-pointer" @click="$emit('close')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
      </button>
      <div class="ms-1">{{ posts[0].author.username }}'s post</div>
    </div>
    <PostsFeedList
      :posts="posts"
      :closable-mode="closableMode"
      @setActiveModalPost="setActiveModalPost"
      @setActiveModalCommentsPost="setActiveModalCommentsPost"
    />
    <PostModal :post="activeModalPost" v-if="activeModalPost" @close="closeModal('post')" />
    <CommentsModal
      :post="activeModalCommentsPost"
      v-if="activeModalCommentsPost"
      @close="closeModal('comments')"
    />
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { IPost } from "../../types/globals";
import PostModal from "../modals/PostModal/PostModal.vue";
import CommentsModal from "../modals/CommentsModal/CommentsModal.vue";
import PostsFeedList from "./PostsFeedList.vue";

export default {
  components: {
    PostsFeedList,
    PostModal,
    CommentsModal,
  },
  emits: ["close"],
  props: {
    posts: {
      type: Array as PropType<Array<IPost>>,
      required: true,
    },
    closableMode: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      activeModalPost: undefined as IPost | undefined,
      activeModalCommentsPost: undefined as IPost | undefined,
    };
  },
  methods: {
    setActiveModalPost(post: IPost) {
      this.activeModalPost = post;
    },
    setActiveModalCommentsPost(post: IPost) {
      this.activeModalCommentsPost = post;
    },
    closeModal(type: "post" | "comments") {
      if (type === "post") {
        this.activeModalPost = undefined;
      } else {
        this.activeModalCommentsPost = undefined;
      }
    },
  },
};
</script>
