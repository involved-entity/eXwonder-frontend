<template>
  <div
      class="flex gap-x-1.5"
      @mouseover="showMessageMenu = true"
      @mouseleave="showMessageMenu = false"
  >
    <div
        class="text-sm p-1.5 rounded-lg"
        v-show="showMessageMenu && isSender"
    >
      <div class="text-red-600 cursor-pointer" @click="$emit('deleteMessage', message)">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-4"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </div>
    </div>
    <div>
      <div
          class="min-w-[7.5rem] max-w-sm bg-white border border-gray-200 rounded-2xl text-sm p-4 space-y-3 dark:bg-neutral-900 text-white
          dark:border-neutral-700"
      >
        {{ message.body }}
        <div class="mt-1" v-if="message.attachment">
          <img
              class="rounded"
              :src="message.attachment.link"
              :alt="message.attachment.name + ' sended image'"
              v-if="isImageFile(message.attachment.name)"
          />
          <div class="relative" v-else>
            <a
                :href="message.attachment.link"
                class="inline-flex justify-center text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-[#151515]"
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
              >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div
          class="flex justify-between mt-1.5 items-center text-xs text-gray-500 dark:text-neutral-500"
      >
        <div v-if="isSender">{{ messageTimeAdded }}</div>
        <span class="flex gap-x-1">
        <svg
            class="shrink-0 size-3"
            :class="{ 'text-emerald-600': message.is_read }"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
          <path d="M18 6 7 17l-5-5"></path>
          <path d="m22 10-7.5 7.5L13 16"></path>
        </svg>
        {{ message.is_read ? "Readed" : "Sent" }}
      </span>
        <div v-if="!isSender">{{ messageTimeAdded }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  emits: ['deleteMessage'],
  props: {
    message: {
      type: Object,
      required: true,
    },
    isSender: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      showMessageMenu: false as boolean,
    }
  },
  methods: {
    isImageFile(fileName: string) {
      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".bmp",
        ".svg",
        ".webp",
      ];

      const lowerCaseFileName = fileName.toLowerCase();

      return imageExtensions.some(extension =>
        lowerCaseFileName.endsWith(extension)
      );
    },
  },
  computed: {
    messageTimeAdded() {
      return this.message.time_added.time_added.split(" ")[0];
    },
  },
};
</script>
