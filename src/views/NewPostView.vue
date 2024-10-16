<template>
  <div class="container" style="border: 15px solid #111; background-color: #272727">
    <div class="justify-center shadow-xl shadow-cyan-500/50">
      <p class="text-gray-300 text-4xl ms-3 mt-3">New post uploading</p>
      <hr class="ms-3 mr-3 mt-4 mb-4 border-gray-600">

      <label
          class="block mb-2 text-lg font-medium text-gray-300 ms-3"
          for="images_input"
      >1. Upload post images (up to 10):</label>
      <input
          class="block ms-3 mr-3 text-lg text-gray-400 border border-gray-300 rounded-lg cursor-pointer
          bg-gray-50 focus:outline-none dark:bg-gray-700 dark:border-gray-600
          dark:placeholder-gray-400 file:block"
          id="images_input"
          type="file"
          required
          multiple
          ref="images"
          @change="imagesChanged"
      >

      <label
          for="signature_input"
          class="block mb-2 text-lg font-medium text-gray-300 ms-3 mt-4"
      >2. Signature post:</label>
      <textarea
          id="signature_input"
          rows="5"
          class="block p-2.5 ms-3 -mr-10 w-11/12 text-lg text-gray-400 bg-gray-50 rounded-lg border border-gray-900
          focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600
          dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Choose signature for your post (optional)"
          v-model="signature"
      />

      <button
          type="submit"
          @click="submit"
          class="ms-3 mb-5 mt-4 p-1 w-3/12 uppercase font-semibold text-gray-300 rounded bg-violet-900 border border-transparent
                 disabled:bg-purple-950 disabled:text-gray-500 transition-all duration-200"
          :class="{'hover:bg-violet-950 hover:border hover:border-violet-950': isValid}"
          :disabled="!isValid"
      >Submit</button>
	  <div class="pb-5" v-if="loading">
		<div class="loader mx-auto"></div>
	  </div>
    </div>
  </div>
</template>

<script>
import {mapStores} from 'pinia'
import {usePostsStore} from "../stores/postsStore.js";
import {useAuthenticationStore} from '../stores/authenticationStore.js'
import axios from "axios";

export default {
  data() {
    return {
      images: [],
      signature: '',
      loading: false,
      errors: {}
    }
  },
  methods: {
    async submit() {
      if (this.isValid) {
        this.loading = true
        const formData = new FormData()
        for (let index = 0; index < this.images.length; index++) {
          formData.append("image" + index, this.$refs.images.files[index])
        }
        formData.append('signature', this.signature)
        const response = await this.postsStore.createPost(formData)
        if (response.status === axios.HttpStatusCode.Created) {
          this.errors = {}
          this.$router.push({name: 'user', params: {username: this.authenticationStore.username}})
        } else {
          this.errors = response.response.data
        }
        this.loading = false
      }
    },
    imagesChanged() {
      this.images = this.$refs.images.files
    }
  },
  computed: {
    isValid() {
      return this.images.length > 0 && this.images.length <= 10
    },
    ...mapStores(usePostsStore, useAuthenticationStore)
  }
}
</script>
