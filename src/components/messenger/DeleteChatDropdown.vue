<template>
  <Dropdown :options="options" @deleteChat="emit('delete')" />
</template>

<script setup lang="ts">
import Dropdown from "../Dropdown.vue"

type EmitsType = {
  (e: 'delete'): void
}

const emit = defineEmits<EmitsType>()

const options = [
  {
    caption: "Delete chat",
    styleClasses: ["text-red-600"],
    emitEvent: "deleteChat"
  }
]
</script>
