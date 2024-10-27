<template>
  <main>
    <div class="h-screen items-center flex justify-center gap-x-5">
      <app-description-component :links="['login']"/>
      <div class="border border-gray-300 rounded-2xl w-2/5 h-3/4" style="background-color: #222">
        <div class="w-full flex h-full items-center justify-center">
          <div class="w-2/3">
            <div class="text-3xl text-center text-gray-300 font-bold mt-1">Sing Up</div>
            <div class="m-3">
              <p class="text-lg ms-1 text-gray-300 inline-block">Username:</p><br>
              <input
                  type="text"
                  placeholder="Your username"
                  class="text-gray-400 bg-gray-custom w-full p-1 outline-none rounded mt-1"
                  :class="{'border border-red-600': errors.username}"
                  v-model="username"
                  @keyup.down="$refs.email_input.focus()"
              >
              <p><small class="p-1 text-red-600" v-if="errors.username">{{errors.username[0]}}</small></p>

              <p class="text-lg ms-1 text-gray-300 inline-block mt-1">Email:</p><br>
              <input
                  type="email"
                  placeholder="Your email (optional)"
                  class="text-gray-400 bg-gray-custom w-full p-1 outline-none rounded mt-1"
                  :class="{'border border-red-600': errors.email}"
                  v-model="email"
                  ref="email_input"
                  @keyup.down="$refs.password1_input.focus()"
              >
              <p><small class="p-1 text-red-600" v-if="errors.email">{{errors.email[0]}}</small></p>

              <p class="text-lg ms-1 text-gray-300 inline-block mt-1">Password:</p><br>
              <input
                  type="password"
                  placeholder="Your password"
                  class="text-gray-400 bg-gray-custom w-full p-1 outline-none rounded mt-1"
                  v-model="password1"
                  ref="password1_input"
                  @keyup.down="$refs.password2_input.focus()"
              >

              <p class="text-lg ms-1 text-gray-300 inline-block mt-1">Password repeat:</p><br>
              <input
                  type="password"
                  placeholder="Repeat your password"
                  class="text-gray-400 bg-gray-custom w-full p-1 outline-none rounded mt-1"
                  v-model="password2"
                  ref="password2_input"
                  @keyup.enter="submit"
              >

              <button
                  type="submit"
                  class="mt-2 p-1 w-full uppercase font-semibold text-gray-300 rounded bg-violet-900 border border-transparent
                     disabled:bg-purple-950 disabled:text-gray-500 transition-all duration-200"
                  :class="{'hover:bg-violet-950 hover:border hover:border-violet-950': isValid}"
                  @click="submit"
                  :disabled="!isValid"
              >Sing Up</button>
              <div class="loader my-5 mx-auto" v-if="loading"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import {mapStores} from 'pinia'
import {useAuthenticationStore} from '../stores/authenticationStore.js'
import axios from "axios";
import AppDescriptionComponent from "../components/AppDescription.vue";

export default {
  components: {AppDescriptionComponent},
  data() {
    return {
      username: '',
      email: '',
      password1: '',
      password2: '',
      loading: false,
      errors: {}
    }
  },
  methods: {
    async submit() {
      if (this.isValid) {
        this.loading = true
        const {success, data} = await this.authenticationStore.singUp(this.username, this.password1, this.email.length ? this.email : null)
        if (success) {
          this.errors = {}
          this.$router.push({name: 'login'})
        } else {
          this.errors = data
        }
        this.loading = false
      }
    }
  },
  computed: {
    isValid() {
      if (this.username.length < 5 && this.username.length > 16) {
        return false
      }
      return !((!this.password1 || this.password1.length < 8) ||
          (!this.password2 || this.password2.length < 8) ||
          (this.password1 !== this.password2));
    },
    ...mapStores(useAuthenticationStore)
  }
}
</script>
