<template>
  <div
    class="flex gap-x-1.5"
    @mouseover="showMessageMenu = true"
    @mouseleave="showMessageMenu = false"
  >
    <div
      class="text-sm p-1.5 rounded-lg space-y-1"
      v-show="showMessageMenu && isSender"
    >
      <div
        class="text-red-600 cursor-pointer"
        @click="$emit('deleteMessage', message)"
      >
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
      <div
        class="text-gray-500 cursor-pointer"
        @click="$emit('editMessage', message)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-4"
        >
          <path
            d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z"
          />
        </svg>
      </div>
    </div>
    <div>
      <div
        class="min-w-[7.5rem] max-w-sm bg-white border border-gray-200 rounded-2xl text-sm px-4 py-3 space-y-3 dark:bg-neutral-900 text-default dark:border-neutral-700"
      >
        {{ message.body }}
        <div class="mt-1" v-if="message.attachment">
          <img
            class="rounded"
            :src="message.attachment.link"
            :alt="message.attachment.name + ' sended image'"
            v-if="isImageFile(message.attachment.name)"
          />
          <a
            class="relative flex items-center"
            :href="message.attachment.link"
            v-else
          >
            <div
              class="inline-flex justify-center p-2 mr-1.5 my-1.5 text-neutral-900 rounded-full cursor-pointer bg-gold-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
              >
                <path
                  d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z"
                />
              </svg>
            </div>
            <div class="flex flex-col space-y-1">
              <div class="text-default">{{ fileName }}</div>
              <div class="text-default-800">Just click to open</div>
            </div>
          </a>
        </div>
      </div>
      <div
        class="flex justify-between space-x-3 mt-1.5 items-center text-xs text-gray-500 dark:text-neutral-500"
      >
        <div class="flex space-x-1" v-if="isSender">
          <div>{{ messageTimeAdded }}</div>
          <div v-if="message.is_edit && showMessageMenu">|</div>
          <div v-if="message.is_edit && showMessageMenu">
            Edited at {{ messageTimeUpdated }}
          </div>
        </div>
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
        <div class="flex space-x-1" v-if="!isSender">
          <div v-if="message.is_edit && showMessageMenu">
            Edited at {{ messageTimeUpdated }}
          </div>
          <div v-if="message.is_edit && showMessageMenu">|</div>
          <div>{{ messageTimeAdded }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  emits: ["deleteMessage", "editMessage"],
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
    };
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
    fileName() {
      const file = this.message.attachment.name;
      const maxLength = 30;
      const lastDotIndex = file.lastIndexOf(".");
      const namePart = lastDotIndex !== -1 ? file.slice(0, lastDotIndex) : file;
      const extensionPart = lastDotIndex !== -1 ? file.slice(lastDotIndex) : "";

      if (file.length <= maxLength) {
        return file;
      }

      const availableLength = maxLength - extensionPart.length - 3;

      if (availableLength <= 0) {
        return "..." + extensionPart;
      }

      const truncatedName = namePart.slice(0, availableLength);
      return `${truncatedName}...${extensionPart}`;
    },
    messageTimeAdded() {
      return this.message.time_added.time_added.split(" ")[0];
    },
    messageTimeUpdated() {
      return this.message.time_updated
        ? this.message.time_updated.time_updated.split(" ")[0]
        : undefined;
    },
  },
};
</script>
