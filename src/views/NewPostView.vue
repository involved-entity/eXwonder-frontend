<template>
  <div class="container-border" @keyup.ctrl.enter="submit">
    <div class="justify-center shadow pt-1">
      <p class="text-gray-700 dark:text-gray-300 text-4xl text-center lg:ms-3 lg:text-start">
        New post uploading
      </p>
      <hr class="ms-3 mr-3 mt-3 mb-4 border-gray-600" />
      <label class="form-label !ms-3 block mb-2" for="imagesInput">
        Upload post images <code class="text-slate-500">(up to 10)</code>:
      </label>
      <div class="flex space-x-3">
        <div class="ms-3 relative">
          <input
            type="file"
            ref="images"
            @change="images = $refs.images.files"
            id="imagesInput"
            required
            multiple
            class="absolute inset-0 opacity-0 cursor-pointer"
          />
          <button class="btn-no-w btn-green btn-green-hover">Select File</button>
        </div>
        <div class="text-sm text-gray-700 dark:text-gray-300 h-full m-auto" v-if="images.length">
          {{ images.length }}
          {{ images.length === 1 ? "file" : "files" }} selected
        </div>
      </div>

      <label class="form-label block mb-2 !ms-3 mt-4">
        Signature for post
        <code class="text-slate-500">(optional)</code>:
      </label>
      <textarea rows="3" class="form-textarea" v-model="signature" />

      <label class="form-label block mb-2 !ms-3 mt-4">
        Tags for post
        <code class="text-slate-500">(optional)</code>:
      </label>
      <TagsInputRoot
        v-model="tags"
        class="flex gap-x-1 items-center px-2 ms-3 -mr-10 w-10/12 text-lg text-gray-700 rounded-lg dark:text-gray-400 outline-none dark:bg-[#161616] bg-gray-200 flex-wrap shadow-sm py-1"
      >
        <TagsInputItem
          v-for="item in tags"
          :key="item"
          :value="item"
          class="text-gray-900 dark:text-gray-50 bg-green-600 font-medium flex items-center justify-center gap-x-1.5 rounded p-0.5"
        >
          <!-- bg-grass8 aria-[current=true]:bg-grass9 -->
          <TagsInputItemText class="text-sm pl-1" />
          <TagsInputItemDelete class="rounded bg-transparent hover:bg-transparent/30">
            <Icon icon="lucide:x" />
          </TagsInputItemDelete>
        </TagsInputItem>
        <TagsInputInput
          placeholder="Tags..."
          class="text-sm focus:outline-none flex-1 rounded text-grass9 bg-transparent placeholder:text-mauve9 px-1.5 !ms-0 border-none"
        />
      </TagsInputRoot>

      <button
        type="submit"
        @click="submit"
        class="ms-3 mb-5 mt-4 !w-3/12 btn btn-green"
        :class="{ 'btn-green-hover': isValid }"
        :disabled="!isValid"
      >
        Submit
      </button>
      <div class="pb-10 pt-1" v-if="loading">
        <div class="loader mx-auto"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapStores } from "pinia";
import { usePostsStore } from "../stores/postsStore.ts";
import { useAuthenticationStore } from "../stores/authenticationStore.ts";
import {
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
  TagsInputRoot,
} from "reka-ui";
import { Icon } from "@iconify/vue";

export default {
  components: {
    TagsInputInput,
    TagsInputItem,
    TagsInputItemDelete,
    TagsInputItemText,
    TagsInputRoot,
    Icon,
  },
  data() {
    return {
      images: [] as Array<File>,
      signature: "" as string,
      tags: [] as string[],
      loading: false as boolean,
      errors: {} as object,
    };
  },
  methods: {
    async submit() {
      if (this.isValid) {
        this.loading = true;
        const formData: FormData = new FormData();
        formData.append("signature", this.signature);
        formData.append("tags", this.tags.map(val => val.trim()).join(","));
        const images: HTMLInputElement | unknown = this.$refs.images;
        for (let index = 0; index < this.images.length; index++) {
          formData.append("image" + index, images!.files![index]);
        }
        const { success, data } = await this.postsStore.createPost(formData);
        if (success) {
          this.errors = {};
          this.$router.push({
            name: "user",
            params: { username: this.authenticationStore.user.username },
            query: { action: "new-post" },
          });
        } else {
          this.errors = data;
        }
        this.loading = false;
      }
    },
  },
  computed: {
    isValid() {
      if (!(this.images.length > 0 && this.images.length <= 10)) return false;
      return this.tags.every(value => value.length <= 32);
    },
    ...mapStores(usePostsStore, useAuthenticationStore),
  },
};
</script>
