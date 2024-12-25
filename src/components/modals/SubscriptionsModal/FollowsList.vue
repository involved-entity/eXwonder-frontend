<template>
  <div class="mb-3" v-for="follow in follows" :key="follow.id">
    <div class="flex relative">
      <div class="subs-avatar-w my-3">
        <router-link :to="'/' + follow[followField].username + '/'" @click="$emit('userLeave')">
          <img :src="follow[followField].avatar" alt="avatar" class="rounded-full max-w-full" />
        </router-link>
      </div>
      <div class="ms-3 my-auto text-gray-700 dark:text-gray-300 text-lg">
        <div class="flex">
          <router-link
            :to="'/' + follow[followField].username + '/'"
            class="hover:text-gray-600 dark:hover:text-gray-400"
            @click="$emit('userLeave')"
          >
            {{ follow[followField].username }}
          </router-link>
          <button
            class="ms-3 btn-follow"
            type="button"
            :class="{
              'bg-gray-500 dark:bg-gray-600': follow.is_followed,
              'bg-blue-500': !follow.is_followed,
            }"
            @click="followUser(follow)"
            v-if="authenticationStore.user.id !== follow[followField].id"
          >
            {{ follow.is_followed ? "Followed" : "Follow" }}
          </button>
        </div>
        <div class="flex text-xl text-gray-600 dark:text-gray-400 pb-1 mt-auto">
          <div
            class="pr-4"
            v-for="stat in [
              { count: follow.posts_count, label: 'posts' },
              { count: follow.followers_count, label: 'followers' },
              { count: follow.followings_count, label: 'followings' },
            ]"
            :key="label"
          >
            <div class="text-sm lg:text-lg">
              <span
                class="text-gray-700 dark:text-gray-300 font-semibold text-lg lg:text-xl varela-round"
                >{{ stat.count }}</span
              >
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { IUserFollowData } from "../../../types/IUserFollowData.ts";
import { mapStores } from "pinia";
import { useUsersStore } from "../../../stores/usersStore.ts";
import { useAuthenticationStore } from "../../../stores/authenticationStore.ts";

export default {
  emits: ["userLeave"],
  name: "FollowsList",
  props: {
    followField: {
      type: String,
      required: true,
    },
    follows: {
      type: Array as () => Array<IUserFollowData>,
      required: true,
    },
    followMode: {
      type: String,
      required: true,
    },
  },
  methods: {
    async followUser(user: IUserFollowData) {
      const userId = this.followMode === "followers" ? user.follower!.id : user.following!.id;
      const { success } = user.is_followed
        ? await this.usersStore.disfollow(userId)
        : await this.usersStore.follow(userId);
      if (success) {
        user.is_followed = !user.is_followed;
        user.followers_count += user.is_followed ? 1 : -1;
      }
    },
  },
  computed: {
    ...mapStores(useUsersStore, useAuthenticationStore),
  },
};
</script>
