<template>
  <main class="relative" @keyup.enter="submit">
    <div class="hw-centered flex flex-col">
      <div class="header-3xl mb-3">2FA</div>
      <div class="card">
        <div class="w-full h-full items-center justify-center mt-3">
          <div class="mb-3 mx-3">
            <p class="form-label">
              Code <code class="text-slate-600">(check your email)</code>:
            </p>
            <input
              type="text"
              class="form-input"
              v-model="code"
              :class="{ '!border-red-600 focus:border-none': errors.code.length }"
            />
            <p>
              <small class="form-error-label" v-if="errors.code.length">{{
                errors.code
              }}</small>
            </p>

            <button
              type="submit"
              class="mt-2 btn btn-green"
              :class="{ 'btn-green-hover': isValid }"
              :disabled="!isValid"
              @click="submit"
            >
              Submit
            </button>
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
  <div class="relative">
    <div class="fixed left-5 top-5 z-50">
      <app-alert
        message="Enter 2FA code to login."
        v-if="$route.query.action === 'login'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { mapStores } from "pinia";
import { useAuthenticationStore } from "../stores/authenticationStore.ts";
import AppAlert from "../components/AppAlert.vue";

export default {
  components: { AppAlert },
  data() {
    return {
      loading: false,
      code: "",
      errors: { code: "" },
    };
  },
  methods: {
    async submit() {
      if (this.isValid) {
        const { success, data } =
          await this.authenticationStore.twoFactorAuthentication(this.code);

        if (success) {
          this.errors = { code: "" };
          this.$router.push({ name: "feed", query: { action: "login" } });
        } else {
          this.errors.code = data.detail;
        }
      }
    },
  },
  computed: {
    isValid() {
      return this.code.length === 5;
    },
    ...mapStores(useAuthenticationStore),
  },
};
</script>
