<template>
  <div class="relative">
    <div class="fixed left-5 top-5">
      <app-alert message="Enter 2FA code to login." v-if="this.$route.query.action === 'login'"/>
    </div>
  </div>
  <main class="relative">
    <div class="hw-centered">
      <div class="card">
        <div class="w-full h-full items-center justify-center">
          <div class="header-3xl">2FA</div>
          <div class="m-3">
            <p class="form-label">Code:</p>
            <input
                type="text"
                placeholder="2FA code (check your email)"
                class="form-input" v-model="code"
                :class="{'border-red': errors.code?.length}"
                @keyup.enter="submit"
            >
            <p><small class="form-error-label" v-if="errors.code?.length">{{errors.code}}</small></p>

            <button
                type="submit"
                class="mt-2 btn btn-green"
                :class="{'btn-green-hover': isValid}"
                :disabled="!isValid"
                @click="submit"
            >Submit</button>
            <div class="loader my-5 mx-auto" v-if="loading"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-link-16">
      Already have an account? <router-link :to="{name: 'login'}" class="link">Log in</router-link>
    </div>
  </main>
</template>

<script>
import {mapStores} from "pinia"
import {useAuthenticationStore} from "../stores/authenticationStore.js"
import AppAlert from "../components/AppAlert.vue";

export default {
  components: {AppAlert},
  data() {
    return {
      loading: false,
      code: '',
      errors: {}
    }
  },
  methods: {
    async submit() {
      if (this.isValid) {
        const {success, data} = await this.authenticationStore.twoFactorAuthentication(this.code)

        if (success) {
          this.errors = {}
          this.$router.push({name: 'feed', query: {'action': 'login'}})
        } else {
          this.errors.code = data.detail
        }
      }
    }
  },
  computed: {
    isValid() {return this.code.length === 5},
    ...mapStores(useAuthenticationStore)
  }
}
</script>
