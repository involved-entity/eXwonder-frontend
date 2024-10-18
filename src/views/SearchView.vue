<template>
  <main>
    <div class="container" style="border: 15px solid #111; background-color: #272727">
      <div class="shadow-xl shadow-cyan-500/50">
        <div>Search</div>
        <input
            type="text"
            placeholder="Search query"
            class="text-gray-400 bg-gray-custom w-full py-1 ps-3 outline-none rounded mt-1"
            v-model="query"
        >
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      query: ''
    }
  },
  watch: {
    query() {
      console.log("query has changed")
    }
  }
}
</script>
