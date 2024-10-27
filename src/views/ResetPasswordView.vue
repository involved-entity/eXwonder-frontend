<template>
  <main>
    <div class="h-screen items-center flex justify-center gap-x-5">
      <app-description-component :links="['login']"/>
      <the-reset-password v-if="!(this.uid?.length && this.token?.length)"/>
      <the-reset-password-confirm :token="this.token" :uid="this.uid" v-if="this.uid?.length && this.token?.length"/>
    </div>
  </main>
</template>

<script>
import AppDescriptionComponent from "../components/AppDescription.vue";
import TheResetPassword from "../components/TheResetPassword.vue";
import TheResetPasswordConfirm from "../components/TheResetPasswordConfirm.vue";

export default {
  components: {TheResetPasswordConfirm, AppDescriptionComponent, TheResetPassword},
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
  }
}
</script>
