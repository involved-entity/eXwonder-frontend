<template>
  <div>
    <div
      class="min-w-[7.5rem] max-w-sm bg-white border border-gray-200 rounded-2xl text-sm p-4 space-y-3 dark:bg-neutral-900 text-white dark:border-neutral-700"
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
</template>

<script lang="ts">
export default {
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
