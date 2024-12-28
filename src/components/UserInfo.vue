<template>
  <div class="ms-2 relative">
    <p class="text-gray-700 dark:text-gray-300 text-lg lg:text-xl">
      {{ requestedUser.username }}
    </p>
    <button
      class="btn-follow absolute top-0 right-0"
      type="button"
      :class="{
      'bg-gray-500 dark:bg-gray-600': followings.followed,
      'bg-blue-500': !followings.followed,
    }"
      @click="$emit('follow')"
      v-if="possibleToFollow"
    >
      {{ followings.followed ? "Followed" : "Follow" }}
    </button>
    <div class="flex text-xl text-gray-600 dark:text-gray-400 pb-1 mt-auto">
      <div class="pr-4">
        <div class="text-base lg:text-xl">
        <span class="text-gray-700 dark:text-gray-300 text-xl font-semibold varela-round">{{
            postsCount
          }}</span>
          posts
        </div>
      </div>
      <div
        class="pr-4"
        :class="{
        'cursor-pointer hover:text-gray-500': !possibleToFollow && followings.followersCount > 0,
      }"
        @click="$emit('followersModal')"
      >
        <div class="text-base lg:text-xl">
        <span class="text-gray-700 dark:text-gray-300 text-xl font-semibold varela-round">{{
            followings.followersCount
          }}</span>
          followers
        </div>
      </div>
      <div
        :class="{
        'cursor-pointer hover:text-gray-500': followings.followingsCount > 0,
      }"
        @click="$emit('followingsModal')"
      >
        <div class="text-base lg:text-xl">
        <span class="text-gray-700 dark:text-gray-300 text-xl font-semibold varela-round">{{
            followings.followingsCount
          }}</span>
          followings
        </div>
      </div>
    </div>
    <p class="text-lg text-gray-700 dark:text-gray-300 font-semibold pr-5">
      {{ requestedUser.name }}
    </p>
    <p class="text-sm text-gray-600 dark:text-gray-400 pr-5">
      {{ requestedUser.desc }}
    </p>
  </div>
</template>

<script lang="ts">
export default {
  emits: ["follow", "followersModal", "followingsModal"],
  name: "UserInfo",
  props: {
    followings: {
      type: Object as () => { followed: boolean; followersCount: number; followingsCount: number },
      required: true,
    },
    postsCount: {
      type: Number,
      required: true,
    },
    requestedUser: {
      type: Object as () => { name: string; desc: string; username: string },
      required: true,
    },
    possibleToFollow: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
