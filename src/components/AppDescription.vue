<template>
  <div class="border border-gray-300 rounded-2xl w-2/5 h-3/4 relative" style="background-color: #222">
    <div class="text-3xl text-center text-gray-300 font-bold mt-1">Welcome to eXwonder!</div>
    <div class="m-3">
      <p class="text-lg ms-1 text-gray-400 inline-block">
        Simple image hosting. Features:<br><br>

        1. Adding posts with images and captions (up to 10)<br>
        2. Likes and comments<br>
        3. Saving posts<br>
        4. Top posts by likes and date added<br>
        5. Subscriptions<br>
        6. News feed<br>
        7. Extensive account settings<br>
      </p>
    </div>
    <div class="absolute bottom-0 left-0 w-full" v-if="links.length">
      <p class="text-xl text-gray-300 mx-3 mb-1" v-for="link in links">{{availibleLinks[link][0]}}
        <router-link :to="{name: link}" class="border-b border-gray-300 hover:border-blue-600 hover:text-blue-600">
          {{availibleLinks[link][1]}}
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    links: {
      type: Array,
      required: false,
      default: null
    }
  },
  data() {
    return {
      availibleLinks: {
        'sing-up': ['Dont have an account?', 'Sing up'],
        'login': ['Already have and account?', 'Log in'],
        'reset-password': ['Remember your password?', 'Reset him']
      }
    }
  }
}
</script>
