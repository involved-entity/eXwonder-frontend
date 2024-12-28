<template>
  <hr class="px-3 w-full border-[1px] border-transparent" ref="usersFull" />
  <div class="w-full ml-5 lg:ml-0 lg:px-7 py-3 flex flex-nowrap relative">
    <button
      class="rounded-full size-7 bg-gray-300 absolute left-7 top-1/2 hidden lg:block"
      @click="$emit('scroll', -200)"
      style="transform: translateY(-50%)"
      v-if="usersW >= usersFull"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="size-7 ms-auto my-auto cursor-pointer"
      >
        <path
          fill-rule="evenodd"
          d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <div class="flex flex-nowrap w-full overflow-x-hidden" v-if="users.length" ref="usersScroll">
      <div
        class="w-full space-x-[5.5rem] sm:space-x-[3.5rem] md:space-x-[3rem] flex flex-nowrap"
        id="usersBlock"
        ref="usersBlock"
      >
        <div
          class="text-gray-700 dark:text-gray-300 flex flex-col items-center w-[18%]"
          v-for="user in users"
          style="flex: 0 0 auto"
          :key="user.username"
        >
          <router-link :to="'/' + user.username + '/'">
            <img :src="user.avatar" alt="user" class="rounded-full mb-1 max-w-[4.5rem]" />
          </router-link>
          <router-link :to="'/' + user.username + '/'" class="header-transition">
            <p class="text-center text-xs lg:text-base">{{ user.username }}</p>
          </router-link>
        </div>
      </div>
    </div>
    <button
      class="rounded-full bg-gray-300 size-7 absolute right-7 top-1/2 hidden lg:block"
      @click="$emit('scroll', 200)"
      style="transform: translateY(-50%)"
      v-if="usersW >= usersFull"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="size-7 me-auto my-auto cursor-pointer"
      >
        <path
          fill-rule="evenodd"
          d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { IUserDefaultData } from "../types/globals/index.js";

export default {
  emits: ["scroll"],
  props: {
    users: {
      type: Array as PropType<Array<IUserDefaultData>>,
      required: true,
    },
  },
  data() {
    return {
      usersW: 0 as number,
      usersFull: 0 as number,
    };
  },
  methods: {
    scroll(value: number) {
      const users: HTMLElement = this.$refs.usersScroll;

      if (users) {
        users.scrollBy({ left: value, behavior: "smooth" });
      }
    },
  },
  mounted() {
    this.usersW = (this.$refs.usersBlock as HTMLElement).offsetWidth;
    this.usersFull = (this.$refs.usersFull as HTMLElement).offsetWidth;
  },
};
</script>
