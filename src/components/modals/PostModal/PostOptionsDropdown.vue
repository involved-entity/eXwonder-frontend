<template>
  <Dropdown :options="options" @deletePost="emit('delete')" @pinPost="emit('pin')" />
</template>

<script setup lang="ts">
import Dropdown from "../../Dropdown.vue";

type EmitsType = {
  (e: "delete"): void;
  (e: "pin"): void;
};

type PropsType = {
  isPinned: boolean;
};

const emit = defineEmits<EmitsType>();
const props = defineProps<PropsType>();

const options = [
  {
    caption: "Delete post",
    styleClasses: ["text-red-600"],
    emitEvent: "deletePost",
  },
  {
    caption: props.isPinned ? "Unpin post" : "Pin post",
    styleClasses: ["text-default"],
    emitEvent: "pinPost",
  },
];
</script>
