<template>
  <div
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
      class="swipe-container"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  emits: ["swipe-right", "swipe-left"],
  data() {
    return {
      startX: 0,
      endX: 0
    };
  },
  methods: {
    touchStart(event) {
      this.startX = event.touches[0].clientX;
    },
    touchMove(event) {
      this.endX = event.touches[0].clientX;
    },
    touchEnd() {
      const diffX = this.endX - this.startX;
      if (Math.abs(diffX) > 30) {
        if (diffX > 0) {
          this.$emit('swipe-left');
        } else {
          this.$emit('swipe-right');
        }
      }
    }
  }
}
</script>

<style>
.swipe-container {
  touch-action: pan-y;
}
</style>
