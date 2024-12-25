<template>
  <div class="header-3xl mb-3">Confirm</div>
  <div class="card md:w-2/5 lg:w-1/3 xl:w-1/4">
    <div class="w-full h-full items-center justify-center mt-3">
      <div class="m-3">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label class="form-label">Password:</label>
            <input
              type="password"
              class="form-input"
              v-model="password1"
              ref="password1"
              @keyup.down="$refs.repeat.focus()"
              :class="{ '!border-red-600 focus:border-none': error.length }"
            />
            <small class="form-error-label" v-if="error.length">{{ error }}</small>
          </div>
          <div class="form-group">
            <label class="form-label">Password repeat:</label>
            <input
              type="password"
              class="form-input"
              v-model="password2"
              ref="repeat"
              @keyup.up="$refs.password1.focus()"
              @keyup.enter="handleSubmit"
              :class="{ '!border-red-600 focus:border-none': error.length }"
            />
            <small class="form-error-label" v-if="error.length">{{ error }}</small>
          </div>
          <button
            type="submit"
            class="mt-2 btn btn-green"
            :class="{ 'btn-green-hover': isValid }"
            :disabled="!isValid"
          >
            Confirm
          </button>
          <div class="loader my-5 mx-auto" v-if="loading"></div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapStores } from "pinia";
import { useAccountStore } from "../stores/accountStore.ts";

export default {
  props: {
    uid: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      password1: "",
      password2: "",
      error: "",
    };
  },
  methods: {
    async handleSubmit() {
      if (this.isValid) {
        this.loading = true;
        try {
          const { success, data } = await this.accountStore.resetPasswordConfirm(
            this.uid,
            this.token,
            this.password1,
            this.password2
          );
          if (!success) {
            this.error = data.new_password2?.length
              ? "Password is too common."
              : "Token is invalid. Please retry to reset password.";
          } else {
            this.$router.push({
              name: "login",
              query: { action: "password-reset-success" },
            });
          }
        } finally {
          this.loading = false;
        }
      }
    },
  },
  computed: {
    isValid() {
      return (
        this.password1.length >= 8 &&
        this.password2.length >= 8 &&
        this.password1 === this.password2
      );
    },
    ...mapStores(useAccountStore),
  },
};
</script>
