<template>
  <main class="relative" @keyup.enter="submit">
    <div class="hw-centered flex flex-col">
      <div class="header-3xl mb-3">Sing Up</div>
      <div class="card text-md w-3/4 sm:w-2/5 lg:w-1/3">
        <div class="w-full h-full items-center justify-center mt-3">
          <form class="mx-3 mb-3" autocomplete="on" @submit.prevent="submit">
            <p class="form-label">Username:</p>
            <input
              type="text"
              class="form-input"
              :class="{
                '!border-red-600 focus:border-none': errors.username.length,
              }"
              v-model="username"
              ref="usernameInput"
              @keyup.down="$refs.emailInput.focus()"
              autocomplete="username"
            />
            <p>
              <small class="form-error-label" v-if="errors.username.length">{{
                errors.username[0]
              }}</small>
            </p>

            <p class="form-label">Email <code class="text-slate-500">(optional)</code>:</p>
            <input
              type="email"
              class="form-input"
              :class="{
                '!border-red-600 focus:border-none': errors.email.length,
              }"
              v-model="email"
              ref="emailInput"
              @keyup.up="$refs.usernameInput.focus()"
              @keyup.down="$refs.password1Input.focus()"
              autocomplete="email"
            />
            <p>
              <small class="form-error-label" v-if="errors.email.length">{{
                errors.email[0]
              }}</small>
            </p>

            <p class="form-label">Password:</p>
            <input
              type="password"
              class="form-input"
              v-model="password1"
              ref="password1Input"
              @keyup.up="$refs.emailInput.focus()"
              @keyup.down="$refs.password2Input.focus()"
              autocomplete="new-password"
            />

            <p class="form-label">Password repeat:</p>
            <input
              type="password"
              class="form-input"
              v-model="password2"
              ref="password2Input"
              @keyup.up="$refs.password1Input.focus()"
              autocomplete="new-password"
            />

            <button
              type="submit"
              class="mt-2 btn btn-green"
              :class="{ 'btn-gree-hover': isValid }"
              :disabled="!isValid"
            >
              Sign Up
            </button>
          </form>
          <div class="mx-3">
            <div class="loader my-5 mx-auto" v-if="loading"></div>
          </div>
        </div>
      </div>
      <div class="footer-links flex flex-col">
        <div class="mx-auto">
          Already have an account?
          <router-link :to="{ name: 'login' }" class="link">Log in</router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { mapStores } from "pinia";
import { checkIsEmailValid } from "../helpers";
import { useAuthenticationStore } from "../stores/authenticationStore.ts";

export default {
  data() {
    return {
      username: "",
      email: "",
      password1: "",
      password2: "",
      loading: false,
      errors: { username: [], email: [] },
    };
  },
  methods: {
    async submit() {
      if (this.isValid) {
        this.loading = true;
        const { success, data } = await this.authenticationStore.signUp(
          this.username,
          this.password1,
          this.email || null
        );

        if (success) {
          this.errors = { username: [], email: [] };
          this.$router.push({ name: "login", query: { action: "sign-up" } });
        } else {
          this.errors = data;
        }

        this.loading = false;
      }
    },
  },
  computed: {
    isValid() {
      const isUsernameValid = this.username.length >= 5 && this.username.length <= 16;
      const isEmailValid = !this.email || checkIsEmailValid(this.email);
      const isPasswordValid = this.password1.length >= 8 && this.password1 === this.password2;

      return isUsernameValid && isEmailValid && isPasswordValid;
    },
    ...mapStores(useAuthenticationStore),
  },
};
</script>
