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
                '!border-red-600 focus:border-none': errors.non_field_errors.length,
              }"
              @keyup.down="$refs.passwordInput.focus()"
              ref="usernameInput"
              autocomplete="username"
            />
            <p>
              <small class="form-error-label" v-if="errors.non_field_errors.length">{{
                errors.non_field_errors[0]
              }}</small>
            </p>

            <p class="form-label mt-1">Password:</p>
            <input
              type="password"
              class="form-input"
              v-model="password"
              :class="{
                '!border-red-600 focus:border-none': errors.non_field_errors.length,
              }"
              @keyup.up="$refs.usernameInput.focus()"
              ref="passwordInput"
              autocomplete="current-password"
            />
            <p>
              <small class="form-error-label" v-if="errors.non_field_errors.length">{{
                errors.non_field_errors[0]
              }}</small>
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
          <RouterLink :to="{ name: 'sign-up' }" class="link">Sign up</RouterLink>
        </div>
        <div class="mx-auto">
          Forgive your password?
          <RouterLink :to="{ name: 'reset-password' }" class="link">Reset password</RouterLink>
        </div>
      </div>
    </div>
  </main>
  <Alert :message="alertMessage" v-if="showAlert" />
</template>

<script lang="ts">
import { mapStores } from "pinia";
import { useAuthenticationStore } from "../stores/authenticationStore.ts";
import Alert from "../components/alert/Alert.vue";
import { loginAndInitStores } from "../services";

interface IData {
  code?: string;
  session_key?: string;
  token?: string;
  user_id?: number;
  non_field_errors?: string[];
}

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

        this.handleSubmitResponse(success, data);
        this.loading = false;
      }
    },
    handleSubmitResponse(success: boolean, data: IData) {
      this.errors = { non_field_errors: [] };

      if (success) {
        if (data.code === "CODE_SENDED") {
          this.authenticationStore.sessionKey = data.session_key;
          this.$router.push({ name: "2fa", query: { action: "login" } });
        } else {
          loginAndInitStores(data);
          this.$router.push({ name: "feed", query: { action: "login" } });
        }
      } else {
        this.errors = data;
      }
    },
  },
  computed: {
    ...mapStores(useAuthenticationStore),
    isValid() {
      return this.username.length >= 5 && this.username.length <= 16 && this.password.length >= 8;
    },
    alertMessage() {
      return this.$route.query.action === "sign-up"
        ? "Now log in."
        : this.$route.query.action === "password-reset-success"
          ? "Login with new password now."
          : undefined;
    },
    showAlert() {
      return (
        this.$route.query.action === "sign-up" ||
        this.$route.query.action === "password-reset-success"
      );
    },
  },
};
</script>
