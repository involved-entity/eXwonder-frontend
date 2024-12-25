<template>
  <div class="flex items-center justify-center ms-auto text-white dark:text-black pr-5">
    <button @click="toggle" class="focus:outline-none bg-transparent border-none cursor-pointer">
      <div class="relative">
        <svg
          :class="{
            'opacity-0 transition-opacity duration-300': status,
            'transition-opacity duration-300 opacity-100 absolute inset-0': !status,
          }"
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          fill="white"
          class="bi bi-list"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
          />
        </svg>
        <svg
          :class="{
            'opacity-0 transition-opacity duration-300': !status,
            'transition-opacity duration-300 opacity-100 absolute inset-0': status,
          }"
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          fill="white"
          viewBox="0 0 16 16"
        >
          <path
            d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
          />
        </svg>
      </div>
    </button>
  </div>
</template>

<script lang="ts">
export default {
  emits: ["changed"],
  props: {
    nested: { type: Boolean, default: false },
    depends: { type: Boolean as () => boolean | null, default: null },
  },
  data() {
    return { isOpen: this.nested };
  },
  methods: {
    toggle() {
      this.$emit("changed");
      if (this.depends === null) {
        this.isOpen = !this.isOpen;
      }
    },
  },
  computed: {
    status() {
      return this.depends === null ? this.isOpen : this.depends;
    },
  },
};
</script>
