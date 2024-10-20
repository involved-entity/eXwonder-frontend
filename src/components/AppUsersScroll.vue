<template>
  <div class="py-3 overflow-x-hidden flex flex-nowrap relative px-10" v-if="users.length" ref="users">
    <button
        class="rounded-full size-7 bg-gray-500 sticky left-5 top-1/2"
        @click="scroll(-200)"
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
        class="mr-8 text-gray-300 flex flex-col items-center"
        v-for="user in users"
        style="flex: 0 0 auto; width: 10%;"
    >
      <img :src="user.avatar" alt="user" class="rounded-full mb-1">
      <p class="text-center">{{user.username}}</p>
    </div>
    <button
        class="rounded-full bg-gray-500 size-7 sticky right-5 top-1/2"
        @click="scroll(200)"
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

<script>
export default {
  props: {
    users: {
      type: Array,
      required: true
    }
  },
  methods: {
    scroll(value) {
      this.$refs.users.scrollBy({left: value, behavior: 'smooth'})
    }
  }
}
</script>
