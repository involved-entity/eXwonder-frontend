<template>
  <div class="container-border" @keyup.enter="submit">
    <div class="justify-center shadow pt-1">
      <p
        class="text-gray-700 dark:text-gray-300 text-4xl text-center lg:ms-3 lg:text-start"
      >
        New post uploading
      </p>
      <hr class="ms-3 mr-3 mt-3 mb-4 border-gray-600" />
      <label class="form-label !ms-3 block mb-2" for="imagesInput"
        >1. Upload post images (up to 10):</label
      >
      <div class="flex space-x-3">
        <div class="ms-3 relative">
          <input
            type="file"
            ref="images"
            @change="imagesChanged"
            id="imagesInput"
            required
            multiple
            class="absolute inset-0 opacity-0 cursor-pointer"
          />
          <button class="btn-no-w btn-green btn-green-hover">
            Select File
          </button>
        </div>
        <div
          class="text-sm text-gray-700 dark:text-gray-300 h-full m-auto"
          v-if="images.length"
        >
          {{ images.length }} files selected
        </div>
      </div>

      <label class="form-label block mb-2 !ms-3 mt-4">2. Signature post:</label>
      <textarea
        rows="7"
        class="p-2.5 ms-3 -mr-10 w-11/12 text-lg text-gray-700 dark:text-gray-400 rounded-lg border border-gray-700 outline-none dark:bg-[#161616] dark:border-[#161616] bg-gray-200"
        placeholder="Choose signature for your post (optional)"
        v-model="signature"
      />

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

export default {
  data() {
    return {
      images: [] as Array<File>,
      signature: "",
      loading: false,
      errors: {},
    };
  },
  methods: {
    async submit() {
      if (this.isValid) {
        this.loading = true;
        const formData: Record<string, string | File> = {};
        const images: HTMLInputElement | unknown = this.$refs.images;
        for (let index = 0; index < this.images.length; index++) {
          formData["image" + index] = images!.files![index];
        }
        formData.signature = this.signature;
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
    imagesChanged() {
      this.images = this.$refs.images.files;
    },
  },
  computed: {
    isValid() {
      return this.images.length > 0 && this.images.length <= 10;
    },
    ...mapStores(usePostsStore, useAuthenticationStore),
  },
};
</script>
