<template>
  <main class="relative">
    <div class="hw-centered flex flex-col">
      <the-reset-password v-if="!(this.uid?.length && this.token?.length)"/>
      <the-reset-password-confirm :token="this.token" :uid="this.uid" v-if="this.uid?.length && this.token?.length"/>
    </div>
    <div class="footer-link-16 flex flex-col">
      <div class="mx-auto">Already have an account? <router-link :to="{name: 'login'}" class="link">Log in</router-link></div>
    </div>
  </main>
</template>

<script>
import TheResetPassword from "../components/TheResetPassword.vue"
import TheResetPasswordConfirm from "../components/TheResetPasswordConfirm.vue"

export default {
  data() {
    return {
      uid: '',
      token: ''
    }
  },
  mounted() {
    Object.keys(this.$route.query).forEach(el => {
      if (el.endsWith('token')) {
        this.token = this.$route.query[el]
      }
    })
    this.uid = this.$route.query.uid
  },
  components: {TheResetPasswordConfirm, TheResetPassword}
}
</script>
