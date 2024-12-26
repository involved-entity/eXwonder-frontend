<template>
  <div class="pr-4">
    <div class="text-base lg:text-lg">
      <span
        class="text-gray-700 dark:text-gray-300 font-semibold text-xl varela-round"
      >
        {{ value }}
      </span>
      {{caption}}
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    value: {type: Number, required: true},
    caption: {type: String, required: true}
  }
}
</script>
