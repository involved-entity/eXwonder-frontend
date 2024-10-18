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
          <div class="flex justify-center">
            <div class="w-1/6 ms-3 my-3">
              <img :src="requestedUser.avatar" alt="avatar" class="rounded-full max-w-full">
            </div>
            <div class="ms-3 relative">
              <p class="text-gray-300 text-xl mt-5">{{username}}</p>
              <button
                  class="text-white text-lg  absolute top-0 right-0 mt-5 px-5 rounded-xl"
                  type="button"
                  :class="{'bg-gray-600': !followings.followed, 'bg-blue-600': followings.followed, 'hidden': authenticationStore.id === requestedUser.id}"
                  @click="followUser"
              >
                {{followings.followed ? 'followed' : 'follow'}}
              </button>
              <div class="flex text-xl text-gray-400 pb-1 mt-auto">
                <div class="pr-4">
                  <div class="text-xl">
                    <span class="text-gray-300 font-semibold">{{posts.length}}</span>
                    posts
                  </div>
                </div>
                <div class="pr-4">
                  <div class="text-xl">
                    <span class="text-gray-300 font-semibold">{{followings.followersCount}}</span>
                    followers
                  </div>
                </div>
                <div>
                  <div class="text-xl">
                    <span class="text-gray-300 font-semibold">{{followings.followingsCount}}</span>
                    followings
                  </div>
                </div>
              </div>
            </div>
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
import {useAuthenticationStore} from "../stores/authenticationStore.js";

import AppPostsGrid from "../components/AppPostsGrid.vue";
import axios from "axios";

export default {
  props: ['username'],
  data() {
    return {
      requestedUser: {
        id: 0,
        avatar: null,
      },
      followings: {
        followersCount: 0,
        followingsCount: 0,
        followings: [],
        followed: false
      },
      posts: [],
      loading: false,
      errorFetchUser: false,
    }
  },
  methods: {
    async followUser() {
      if (!this.followings.followed) {
        const response = await this.usersStore.follow(this.requestedUser.id)
        if (response.status === axios.HttpStatusCode.Created) {
          this.followings.followed = true
          this.followings.followersCount++
        }
      } else {
        const response = await this.usersStore.disfollow(this.requestedUser.id)
        if (response.status === axios.HttpStatusCode.NoContent) {
          this.followings.followed = false
          this.followings.followersCount--
        }
      }
    }
  },
  async beforeMount() {
    this.loading = true
    const user = await this.usersStore.getUser(this.username)
    if (!user) {this.errorFetchUser = 'User is not found. :('} else {
      this.requestedUser.id = user.id
      this.requestedUser.avatar = user.avatar
      let followers = await this.usersStore.getUserFollowersCount(this.requestedUser.id)
      this.followings.followersCount = followers.data.count
      let followings = await this.usersStore.getUserFollowings(this.requestedUser.id)
      this.followings.followingsCount = followings.data.count
      this.followings.followings = followings.data.results
      const posts = await this.postsStore.getUserPosts(this.username)
      this.posts = posts.data.results
    }
    this.loading = false
  },
  computed: {
    ...mapStores(useUsersStore, usePostsStore, useAuthenticationStore)
  },
  components: {
    AppPostsGrid
  }
}
</script>
