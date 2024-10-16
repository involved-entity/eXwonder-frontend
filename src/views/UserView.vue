<template>
  <main>
    <div class="container" style="border: 15px solid #111; background-color: #272727">
      <div class="shadow-xl shadow-cyan-500/50">
        <div class="py-10" v-if="loading">
          <div class="loader mx-auto"></div>
        </div>
        <div class="text-gray-300" v-else-if="errorFetchUser">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-60 m-auto">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <p class="text-4xl text-center pb-5">{{errorFetchUser}}</p>
        </div>

        <div v-else>
          <img :src="avatar" alt="avatar" class="rounded-full w-1/6 h-1/6 m-auto my-3">
          <p class="text-gray-300 text-xl text-center">{{username}}</p>
          <div class="flex justify-center text-xl text-gray-400 mt-1 pb-1">
            <div class="text-center pr-5" style="border-right: 1px solid gray">
              <div class="text-2xl font-semibold">{{followersCount}}</div>
              <div>Followers</div>
            </div>
            <button
                type="button"
                class="text-center ml-5 hover:bg-gray-800"
            >
              <span class="text-2xl font-semibold">{{followingsCount}}</span><br>
              <span>Followings</span>
            </button>
          </div>

          <div class="ps-3 pr-3 pb-5 h-1">
            <hr class="border border-gray-600">
          </div>

          <app-posts-grid :posts="posts" v-if="posts"></app-posts-grid>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import {mapStores} from 'pinia'
import {useUsersStore} from "../stores/usersStore.js";
import {usePostsStore} from "../stores/postsStore.js";

import AppPostsGrid from "../components/AppPostsGrid.vue";

export default {
  props: ['username'],
  data() {
    return {
      id: 0,
      avatar: null,
      followersCount: '0',
      followingsCount: '0',
      followings: [],
      posts: [],
      loading: false,
      errorFetchUser: false
    }
  },
  async beforeMount() {
    this.loading = true
    const user = await this.usersStore.getUser(this.username)
    if (!user) {this.errorFetchUser = 'User is not found. :('} else {
      this.id = user.id
      this.avatar = user.avatar
      let followers = await this.usersStore.getUserFollowersCount(this.id)
      this.followersCount = followers.data.count
      let followings = await this.usersStore.getUserFollowings(this.id)
      this.followingsCount = followings.data.count
      this.followings = followings.data.results
      const posts = await this.postsStore.getUserPosts(this.username)
      this.posts = posts.data.results
    }
    this.loading = false
  },
  computed: {
    ...mapStores(useUsersStore, usePostsStore)
  },
  components: {
    AppPostsGrid
  }
}
</script>
