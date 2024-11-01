<template>
  <main>
    <div class="container-border">
      <div class="shadow">
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
            <div class="w-1/6 ms-2 my-3">
              <img :src="requestedUser.avatar" alt="avatar" class="rounded-full max-w-full">
            </div>
            <div class="ms-2 relative">
              <p class="text-gray-300 text-lg lg:text-xl mt-5">{{requestedUser.username}}</p>
              <button
                  class="btn-follow absolute top-0 right-0 mt-5 px-5"
                  type="button"
                  :class="{'bg-gray-600': !followings.followed, 'bg-blue-600': followings.followed}"
                  @click="followUser"
                  v-if="authenticationStore.id !== requestedUser.id"
              >
                {{followings.followed ? 'followed' : 'follow'}}
              </button>
              <div class="flex text-xl text-gray-400 pb-1 mt-auto">
                <div class="pr-4">
                  <div class="text-base lg:text-xl">
                    <span class="text-gray-300 text-xl font-semibold varela-round">{{posts.length}}</span>
                    posts
                  </div>
                </div>
                <div
                    class="pr-4"
                    :class="{'cursor-pointer hover:text-gray-500': authenticationStore.username === requestedUser.username && followings.followersCount > 0}"
                    @click="showModal('followers')"
                >
                  <div class="text-base lg:text-xl">
                    <span class="text-gray-300 text-xl font-semibold varela-round">{{followings.followersCount}}</span>
                    followers
                  </div>
                </div>
                <div
                    :class="{'cursor-pointer hover:text-gray-500': followings.followingsCount > 0}"
                    @click="showModal('followings')"
                >
                  <div class="text-base lg:text-xl">
                    <span class="text-gray-300 text-xl font-semibold varela-round">{{followings.followingsCount}}</span>
                    followings
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="ps-3 pr-3 pb-5 h-1 hidden lg:block">
            <hr class="border border-gray-600">
          </div>

          <app-posts-grid :posts="posts" v-if="posts" />
          <app-subscriptions-modal
              :follows-count="followings.followersCount"
              follow-mode="followers"
              :requested-user-id="requestedUser.id"
              @close="showFollowersModal = false"
              @userLeave="showFollowingsModal = false; showFollowersModal = false"
              v-if="showFollowersModal"
          />
          <app-subscriptions-modal
              :follows-count="followings.followingsCount"
              follow-mode="followings"
              :requested-user-id="requestedUser.id"
              @close="showFollowingsModal = false"
              @userLeave="showFollowingsModal = false; showFollowersModal = false"
              v-if="showFollowingsModal"
          />
        </div>
      </div>
    </div>
  </main>
  <div class="relative">
    <div class="fixed left-5 top-5">
      <app-alert :message="this.$route.query.action === 'new-post' ? 'Post created.' : 'Settings updated.'" v-if="this.$route.query.action === 'new-post' || this.$route.query.action === 'settings'"/>
    </div>
  </div>
</template>

<script>
import {mapStores} from 'pinia'
import {useUsersStore} from "../stores/usersStore.js"
import {usePostsStore} from "../stores/postsStore.js"
import {useAuthenticationStore} from "../stores/authenticationStore.js"

import AppPostsGrid from "../components/AppPostsGrid.vue"
import AppSubscriptionsModal from "../components/AppSubscriptionsModal.vue"
import AppAlert from "../components/AppAlert.vue";

export default {
  data() {
    return {
      requestedUser: {
        id: 0,
        username: '',
        avatar: null,
      },
      followings: {
        followersCount: 0,
        followingsCount: 0,
        followings: [],
        followed: false
      },
      showFollowersModal: false,
      showFollowingsModal: false,
      posts: [],
      loading: false,
      errorFetchUser: false,
    }
  },
  methods: {
    async followUser() {
      if (!this.followings.followed) {
        const {success, data} = await this.usersStore.follow(this.requestedUser.id)

        if (success) {
          this.followings.followed = true
          this.followings.followersCount++
        }
      } else {
        const {success, data} = await this.usersStore.disfollow(this.requestedUser.id)
        if (success) {
          this.followings.followed = false
          this.followings.followersCount--
        }
      }
    },
    showModal(modal) {
      switch (modal) {
        case 'followers':
          if (this.authenticationStore.username === this.requestedUser.username && this.followings.followersCount > 0) {
            this.showFollowersModal = true
          }
          break
        case 'followings':
          if (this.followings.followingsCount > 0) {
            this.showFollowingsModal = true
          }
      }
    },
    async updateUserInfo(username = null) {
      this.loading = true
      this.requestedUser.username = username ? username : this.$route.params.username
      const {success, data} = await this.usersStore.getUser(this.requestedUser.username)

      if (!data.username) {this.errorFetchUser = 'User is not found. :('} else {
        this.requestedUser.id = data.id
        this.requestedUser.avatar = data.avatar
        this.followings.followersCount = data.followers_count
        this.followings.followingsCount = data.followings_count
        this.followings.followed = data.is_followed
        const posts = await this.postsStore.getUserPosts(this.requestedUser.username)
        this.posts = posts.data.results
      }

      this.loading = false
    }
  },
  async beforeMount() {
    await this.updateUserInfo()
  },
  async beforeRouteUpdate(to) {
    await this.updateUserInfo(to.params.username)
  },
  computed: {...mapStores(useUsersStore, usePostsStore, useAuthenticationStore)},
  components: {AppAlert, AppPostsGrid, AppSubscriptionsModal}
}
</script>
