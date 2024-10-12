<template>
  <div class="flex">
    <div class="w-1/5">
      <the-navbar></the-navbar>
    </div>
    <div class="w-3/5">
      <router-view></router-view>
    </div>
    <div class="w-1/5">

    </div>
  </div>
</template>

<script>
import TheNavbar from "./components/TheNavbar.vue";

export default {
  components: {TheNavbar}
}
</script>
