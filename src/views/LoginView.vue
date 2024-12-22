<template>
  <main class="relative" @keyup.enter="submit">
    <div class="hw-centered flex flex-col">
      <div class="header-3xl mb-3">Login</div>
      <div class="card">
        <div class="w-full h-full items-center justify-center mt-3">
          <form class="mx-3 mb-3" autocomplete="on" @submit.prevent="submit">
            <p class="form-label">Username:</p>
            <input
              type="text"
              class="form-input"
              v-model="username"
              :class="{
                '!border-red-600 focus:border-none':
                  errors.non_field_errors.length,
              }"
              @keyup.down="$refs.passwordInput.focus()"
              ref="usernameInput"
              autocomplete="username"
            />
            <p>
              <small
                class="form-error-label"
                v-if="errors.non_field_errors.length"
                >{{ errors.non_field_errors[0] }}</small
              >
            </p>

            <p class="form-label mt-1">Password:</p>
            <input
              type="password"
              class="form-input"
              v-model="password"
              :class="{
                '!border-red-600 focus:border-none':
                  errors.non_field_errors.length,
              }"
              @keyup.up="$refs.usernameInput.focus()"
              ref="passwordInput"
              autocomplete="current-password"
            />
            <p>
              <small
                class="form-error-label"
                v-if="errors.non_field_errors.length"
                >{{ errors.non_field_errors[0] }}</small
              >
            </p>

            <button
              type="submit"
              class="mt-2 btn btn-green"
              :class="{ 'btn-green-hover': isValid }"
              :disabled="!isValid"
            >
              Login
            </button>
          </form>
          <div class="mx-3">
            <div class="loader my-5 mx-auto" v-if="loading"></div>
          </div>
        </div>
      </div>
      <div class="footer-links flex flex-col">
        <div class="mx-auto">
          Don't have an account?
          <router-link :to="{ name: 'sing-up' }" class="link"
            >Sing up</router-link
          >
        </div>
        <div class="mx-auto">
          Forgive your password?
          <router-link :to="{ name: 'reset-password' }" class="link"
            >Reset password</router-link
          >
        </div>
      </div>
    </div>
  </main>
  <Alert
    :message="alertMessage"
    v-if="showAlert"
  />
</template>

<script lang="ts">
import { mapStores } from "pinia";
import { useAuthenticationStore } from "../stores/authenticationStore.ts";
import Alert from "../components/alert/Alert.vue";
import { initSocketConnection } from "../helpers";
import { useMessengerStore } from "../stores/messengerStore.ts";

export default {
  components: { Alert },
  data() {
    return {
      username: "",
      password: "",
      loading: false,
      errors: { non_field_errors: [] },
    };
  },
  methods: {
    async submit() {
      if (this.isValid) {
        this.loading = true;
        const { success, data } = await this.authenticationStore.login(
          this.username,
          this.password
        );

        if (success && data.code === "CODE_SENDED") {
          this.errors = { non_field_errors: [] };
          this.authenticationStore.sessionKey = data.session_key;
          this.$router.push({ name: "2fa", query: { action: "login" } });

        } else if (success) {
          this.errors = { non_field_errors: [] };
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_id", data.user_id);
          this.authenticationStore.token = data.token;
          this.authenticationStore.user.id = data.user_id;
          this.authenticationStore.isAuth = true;

          initSocketConnection();
          const messengerStore = useMessengerStore();
          messengerStore.initMessenger();

          this.$router.push({ name: "feed", query: { action: "login" } });
        } else {
          this.errors = data;
        }

        this.loading = false;
      }
    },
  },
  computed: {
    ...mapStores(useAuthenticationStore),
    isValid() {
      if (
        !this.username ||
        this.username.length < 5 ||
        this.username.length > 16
      ) {
        return false;
      } else if (!this.password || this.password.length < 8) {
        return false;
      }
      return true;
    },
    alertMessage() {
      return this.$route.query.action === 'sing-up' ? "Now log in." : (
        this.$route.query.action === 'password-reset-success' ? 'Login with new password now.' : undefined
      )
    },
    showAlert() {
      return this.$route.query.action === 'sing-up' || this.$route.query.action === 'password-reset-success'
    }
  },
};
</script>
