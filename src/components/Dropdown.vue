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
        <li v-for="(option, index) in options" :key="index">
          <div class="px-3 py-2 flex cursor-pointer" :class="option.styleClasses" @click="$emit(option.emitEvent)">
            {{ option.caption }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Dropdown } from "flowbite";

export default {
  props: {
    options: {
      type: Object,
      required: true
    }
  },
  mounted() {
    const dropdownMenu = document.getElementById("dropdownMenu");
    const dropdownButton = document.getElementById("dropdownButton");

    if (dropdownMenu && dropdownButton) {
      new Dropdown(dropdownMenu, dropdownButton, {
        placement: "bottom",
        offsetSkidding: 0,
        offsetDistance: 10,
      });
    }
  },
};
</script>
