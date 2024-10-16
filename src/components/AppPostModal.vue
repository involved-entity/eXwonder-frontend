<template>
  <div
      class="fixed inset-0 bg-opacity-90 bg-black flex justify-center items-center"
  >
    <div class=" flex h-3/4 text-gray-300">
      <div class="w-4/6 flex">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-10 ms-auto my-auto"
            :class="{'opacity-100 cursor-pointer': activeImage > 0, 'opacity-0': activeImage <= 0}"
            @click="prevImage"
        >
          <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clip-rule="evenodd" />
        </svg>
        <img :src="images[activeImage].image" alt="Post image" class="max-h-full">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-10 me-auto my-auto"
            :class="{'opacity-100 cursor-pointer': activeImage + 1 < images.length, 'opacity-0': activeImage + 1 >= images.length}"
            @click="nextImage"
        >
          <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="w-80 rounded-2xl" style="background-color: #111">
        <div class="m-3">
          <div class="grid grid-cols-2">
            <div class="col-span-1 text-2xl">Comments</div>
            <div class="col-span-1 ms-auto cursor-pointer" @click="close">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8">
                <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>

          <div class="my-1 h-1">
            <hr class="border border-gray-600">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['close'],
  props: {
    images: {
      type: Array,
      required: true
    },
    comments: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeImage: 0
    }
  },
  methods: {
    close() {this.$emit('close')},
    prevImage() {
      if (this.activeImage > 0) {
        this.activeImage--
      }
    },
    nextImage() {
      if (this.activeImage + 1 < this.images.length) {
        this.activeImage++
      }
    }
  }
}
</script>
