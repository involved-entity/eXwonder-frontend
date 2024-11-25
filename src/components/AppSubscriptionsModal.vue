<template>
  <div class="fixed inset-0 bg-opacity-90 bg-black flex justify-center items-center">
    <div class="flex h-3/5 lg:h-2/3 text-gray-300">
      <div class="overflow-y-auto flex flex-col mb-auto max-h-full w-[21rem] lg:w-[28rem]" style="background-color: #111">
        <div class="sticky top-0 left-0 pt-3 pb-1" style="background-color: #050505; z-index: 1;">
          <div class="grid grid-cols-2 mx-3">
            <div class="col-span-1 text-2xl flex justify-start">{{followMode.charAt(0).toUpperCase() + followMode.slice(1)}}
              <div class="ms-1 varela-round">({{followsCount}})</div>
            </div>
            <div class="flex col-span-1 ms-auto">
              <div class="cursor-pointer" @click="close">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8">
                  <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div class="mx-3 my-1">
            <input
                class="w-full p-1 outline-none rounded"
                placeholder="Search query"
                style="background-color: #090909"
                v-model="searchQuery"
                @input="searchFollowings"
                v-if="followMode === 'followings'"
            >
          </div>
        </div>
        <div class="mt-1 mx-2 mb-1">
          <div class="py-10" v-if="followsLoading">
            <div class="loader mx-auto"></div>
          </div>
          <div class="mt-1" v-else-if="follows.length">
            <div class="text-gray-300 text-center text-xl mb-1 lg:mb-0" v-if="searchQuery.length">Results (<span class="varela-round">{{ follows.length }}</span>):</div>
            <div class="mb-3" v-for="follow in follows" :key="follow.id">
              <div class="flex relative">
                <div class="subs-avatar-w my-3">
                  <router-link
                      :to="'/' + follow[followField].username + '/'"
                      @click="$emit('userLeave')"
                  >
                    <img
                        :src="follow[followField].avatar"
                        alt="avatar"
                        class="rounded-full max-w-full"
                    >
                  </router-link>
                </div>
                <div class="ms-3 my-auto text-gray-300 text-lg">
                  <div class="flex">
                    <router-link
                        :to="'/' + follow[followField].username + '/'"
                        class="hover:text-gray-400"
                        @click="$emit('userLeave')"
                    >
                      {{follow[followField].username}}
                    </router-link>
                    <button
                        class="ms-3 btn-follow"
                        type="button"
                        :class="{'bg-gray-500 dark:bg-gray-600': follow.is_followed, 'bg-blue-500': !follow.is_followed}"
                        @click="followUser(follow)"
                        v-if="authenticationStore.user.id !== follow[followField].id"
                    >
                      {{follow.is_followed ? 'followed' : 'follow'}}
                    </button>
                  </div>
                  <div class="flex text-xl text-gray-400 pb-1 mt-auto">
                    <div class="pr-4">
                      <div class="text-sm lg:text-lg">
                        <span class="text-gray-300 font-semibold text-lg lg:text-xl varela-round">{{follow.posts_count}}</span>
                        posts
                      </div>
                    </div>
                    <div class="pr-4">
                      <div class="text-sm lg:text-lg">
                        <span class="text-gray-300 font-semibold text-lg lg:text-xl varela-round">{{follow.followers_count}}</span>
                        followers
                      </div>
                    </div>
                    <div>
                      <div class="text-sm lg:text-lg">
                        <span class="text-gray-300 font-semibold text-lg lg:text-xl varela-round">{{follow.followings_count}}</span>
                        followings
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="text-gray-500 py-5" v-else>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-20 mx-auto">
              <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
            </svg>
            <div class="text-center text-3xl">No results found :/</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {PropType} from "vue";
import {IUserFollowData} from "@/types/globals";
import {mapStores} from "pinia"
import {useUsersStore} from "../stores/usersStore.ts"
import {useAuthenticationStore} from "../stores/authenticationStore.ts"
import {IResponse} from "@/types/helpers";

export default {
  emits: ['close', 'userLeave'],
  props: {
    requestedUserId: {
      type: Number as PropType<number>,
      required: true
    },
    followMode: {
      type: String as PropType<'followers' | 'followings'>,
      required: true,
      validator(value: string) {
        return ['followers', 'followings'].includes(value)
      }
    },
    followsCount: {
      type: Number as PropType<number>,
      required: true
    }
  },
  data() {
    return {
      follows: [] as Array<IUserFollowData>,
      followsLoading: false,
      searchQuery: '',
      followField: '' as string
    }
  },
  methods: {
    close() {this.$emit('close')},

    async followUser(user: IUserFollowData) {
      let userId: number = 0
      if (this.followMode === 'followers') {
        userId = user.follower!.id
      } else {
        userId = user.following!.id
      }

      if (!user.is_followed) {
        const {success} = await this.usersStore.follow(userId)
        if (success) {
          user.is_followed = true
          user.followers_count++
        }
      } else {
        const {success} = await this.usersStore.disfollow(userId)
        if (success) {
          user.is_followed = false
          user.followers_count--
        }
      }
    },

    async searchFollowings() {
      this.followsLoading = true
      const response = await this.usersStore.getUserFollowings(this.requestedUserId, 1, this.searchQuery)
      this.follows = response.data.results
      this.followsLoading = false
    }
  },

  async beforeMount() {
    this.followsLoading = true
    let response: IResponse | undefined = undefined
    if (this.followMode === 'followers') {
      response = await this.usersStore.getMyFollowers()
    } else if (this.followMode === 'followings') {
      response = await this.usersStore.getUserFollowings(this.requestedUserId)
    }
    this.follows = response!.data.results
    this.followField = this.followMode === 'followers' ? "follower" : 'following'
    this.followsLoading = false
  },

  computed: {...mapStores(useUsersStore, useAuthenticationStore)}
}
</script>
