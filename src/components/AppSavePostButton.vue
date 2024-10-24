<template>
  <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6 cursor-pointer"
      v-if="!post.is_saved"
      @click="savePost(post)"
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
  </svg>
  <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="size-6 cursor-pointer"
      v-if="post.is_saved"
      @click="savePost(post, false)"
  >
    <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
  </svg>
</template>

<script>
import axios from "axios";
import {mapStores} from "pinia";
import {usePostsStore} from "../stores/postsStore.js";

export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  methods: {
    async savePost(post, action = true) {
      switch (action) {
        case true:
          let addPostResponse = await this.postsStore.addPostToSaved(post.id)
          if (addPostResponse.status === axios.HttpStatusCode.Created) {
            post.is_saved = true
          }
          break
        case false:
          let removePostResponse = await this.postsStore.removePostFromSaved(post.id)
          if (removePostResponse.status === axios.HttpStatusCode.NoContent) {
            post.is_saved = false
          }
          break
      }
    }
  },
  computed: {
    ...mapStores(usePostsStore)
  }
}
</script>
