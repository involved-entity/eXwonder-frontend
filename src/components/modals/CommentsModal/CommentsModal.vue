<template>
  <div class="fixed inset-0 bg-opacity-90 bg-black flex justify-center items-center z-50">
    <div class="h-4/5 text-gray-700 dark:text-gray-300">
      <div
        class="rounded-t-xl overflow-y-auto overflow-x-hidden flex flex-col max-h-full w-11/12 mx-auto bg-gray-200 dark:bg-[#111]"
        ref="modal"
      >
        <header class="sticky top-0 left-0 pt-3 pb-1 bg-gray-300 dark:bg-[#070707]">
          <div class="grid grid-cols-2 mx-3">
            <div class="col-span-1 text-2xl flex justify-start">
              Comments
              <div class="ms-1 varela-round">({{ post!.comments_count }})</div>
            </div>
            <ModalCloseButton @close="close" />
          </div>
        </header>
        <main class="m-2">
          <div class="py-10" v-if="commentsLoading">
            <div class="loader mx-auto"></div>
          </div>

          <div class="mt-1" v-else-if="comments.length">
            <CommentsList :commentDelete="commentDelete" :comments="comments" />
          </div>

          <div class="text-center text-3xl text-gray-500 h-full" v-else>
            <NoCommentsSvg />
            No comments.
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { IComment, IPost } from "../../../types/globals";
import { mapStores } from "pinia";
import { useAuthenticationStore } from "../../../stores/authenticationStore.ts";
import { useCommentsStore } from "../../../stores/commentsStore.ts";
import CommentsList from "./CommentsList.vue";
import ModalCloseButton from "./ModalCloseButton.vue";
import NoCommentsSvg from "./NoCommentsSvg.vue";

export default {
  components: { NoCommentsSvg, ModalCloseButton, CommentsList },
  emits: ["close"],
  props: {
    post: Object as PropType<IPost>,
  },
  data() {
    return {
      commentsLoading: false,
      comments: [] as Array<IComment>,
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },

    async commentDelete(comment: IComment) {
      if (this.authenticationStore.user.id === comment.author.id) {
        const { success } = await this.commentsStore.deleteComment(comment.id);
        if (success) {
          this.comments = this.comments.filter(c => c.id !== comment.id);
          this.post!.comments_count--;
        }
      }
    },

    async updateComments() {
      this.commentsLoading = true;
      const comments = await this.commentsStore.getPostComments(this.post!.id);
      this.comments = comments.data.results;
      this.commentsLoading = false;
    },

    handleClick(event: Event) {
      const modal = this.$refs.modal;
      if (!modal.contains(event.target)) {
        this.close();
      }
    },
  },
  async mounted() {
    await this.updateComments();
    document.body.addEventListener("click", this.handleClick);
  },
  unmounted() {
    document.body.removeEventListener("click", this.handleClick);
  },
  computed: {
    ...mapStores(useAuthenticationStore, useCommentsStore),
  },
};
</script>
