<template>
  <div class="relative" v-if="visible">
    <div class="line"></div>
    <div class="mb-4 border-l-4 border-teal-500 text-teal-900 bg-teal-100 rounded px-4 py-3 w-full">
      <div class="flex items-start">
        <div class="py-1">
          <svg class="fill-current h-6 w-6 mr-4 text-teal-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z" />
          </svg>
        </div>

        <div>
          <h3 class="font-semibold">Success!</h3>

          <p class="text-sm text-teal-700">
            {{message}}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    message: String
  },
  data() {
    return {
      visible: true
    }
  },
  mounted() {
    setTimeout(() => {this.visible = false}, 5000)
  }
}
</script>
