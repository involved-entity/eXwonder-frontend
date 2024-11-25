<template>
  <div class="py-3 overflow-x-hidden flex flex-nowrap relative px-7 lg:px-10" v-if="users.length">
    <button
        class="rounded-full size-7 bg-gray-500 sticky left-5 top-1/2 hidden lg:block"
        @click="$emit('scroll',-200)"
        style="transform: translateY(-50%)"
        v-if="users.length > 6"
    >
      <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-7 ms-auto my-auto cursor-pointer"
      >
        <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clip-rule="evenodd" />
      </svg>
    </button>
    <div
        class="mr-[5.5rem] sm:mr-[3.5rem] md:mr-12 text-gray-700 dark:text-gray-300 flex flex-col items-center w-1/12 sm:w-1/6"
        v-for="user in users"
        style="flex: 0 0 auto;"
    >
      <router-link :to="'/' + user.username + '/'" @click="routeStore.changeActiveLink('user')">
        <img :src="user.avatar" alt="user" class="rounded-full mb-1 max-w-[4.5rem]">
      </router-link>
      <router-link :to="'/' + user.username + '/'" class="header-transition" @click="routeStore.changeActiveLink('user')">
        <p class="text-center text-xs lg:text-base">{{user.username}}</p>
      </router-link>
    </div>
    <button
        class="rounded-full bg-gray-500 size-7 sticky right-5 top-1/2 hidden lg:block"
        @click="$emit('scroll',200)"
        style="transform: translateY(-50%)"
        v-if="users.length > 6"
    >
      <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-7 me-auto my-auto cursor-pointer"
      >
        <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import {PropType} from "vue";
import {IUserDefaultData} from "@/types/globals/index.js";
import {mapStores} from "pinia"
import {useRouteStore} from "../stores/routeStore.ts"

export default {
  emits: ['scroll'],
  props: {
    users: {
      type: Array as PropType<Array<IUserDefaultData>>,
      required: true
    }
  },
  computed: {...mapStores(useRouteStore)}
}
</script>
