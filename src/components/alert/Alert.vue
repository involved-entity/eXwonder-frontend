<template>
  <div class="relative">
    <div
      class="fixed left-5 top-5 z-50 max-w-xs w-full bg-green-500 text-white shadow-lg rounded-lg p-4 flex items-center space-x-3 transition-all transform hover:scale-105"
      :class="{
        'transform translate-x-[-100%] opacity-0': !visible,
        'opacity-100': visible
      }"
      v-if="visible || isExiting"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8.5 8.5a1 1 0 01-1.414 0l-4.5-4.5a1 1 0 011.414-1.414L8 12.086l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      <div class="flex-1">
        <p class="font-bold">Success</p>
        <p class="text-sm">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  emits: ["exited"],
  props: {
    message: String,
  },
  data() {
    return {
      visible: true,
      isExiting: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.isExiting = true;
      setTimeout(() => {
        this.visible = false;
        this.$emit("exited");
      }, 300);
    }, 4000);
  },
};
</script>
