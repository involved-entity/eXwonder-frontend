<template>
  <div class="mr-1">
    <button id="dropdownButton" class="cursor-pointer" type="button">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-8"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        />
      </svg>
    </button>
    <div
      id="dropdownMenu"
      class="z-50 hidden shadow-xl shadow-slate-500/30 dark:shadow-none bg-gray-300 dark:bg-[#1b1919] divide-y divide-gray-100 border-red rounded w-36"
    >
      <ul class="py-1 text-sm" aria-labelledby="dropdownButton">
        <li>
          <button class="px-3 py-2 text-red-600 flex" @click="$emit('delete')">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
            <span class="ms-1">{{ caption }}</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Dropdown } from "flowbite";

export default {
  emits: ["delete"],
  props: {
    caption: {
      type: String,
      required: false,
      default: "Delete post",
    },
  },
  mounted() {
    const $targetEl = document.getElementById("dropdownMenu");
    const $triggerEl = document.getElementById("dropdownButton");

    const options = {
      placement: "bottom",
      offsetSkidding: 0,
      offsetDistance: 10,
    };

    if ($targetEl) {
      new Dropdown($targetEl, $triggerEl, options);
    }
  },
};
</script>
