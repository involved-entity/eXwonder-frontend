<template>
  <div class="container-border" @keyup.enter="submit">
    <div class="shadow justify-center">
      <div class="w-full flex h-full items-center justify-center">
        <div class="w-3/4 lg:w-2/3">
          <div class="header-2xl mt-1">Change your account password</div>
          <div class="mx-3 mb-3 mt-1">
            <p class="form-label">Old password:</p>
            <input
              type="password"
              class="form-input"
              v-model="oldPassword"
              @keyup.down="$refs.password1.focus()"
              ref="oldPasswordInput"
              :class="{
                '!border-red-600 focus:border-none': errors.old_password?.length,
              }"
            />
            <p>
              <small class="form-error-label" v-if="errors.old_password?.length">{{
                errors.old_password[0]
              }}</small>
            </p>

            <p class="form-label mt-1">New password:</p>
            <input
              type="password"
              class="form-input"
              v-model="newPassword1"
              @keyup.up="$refs.oldPasswordInput.focus()"
              @keyup.down="$refs.password2.focus()"
              ref="password1"
              :class="{
                '!border-red-600 focus:border-none': errors.new_password1?.length,
              }"
            />
            <p>
              <small class="form-error-label" v-if="errors.new_password1?.length">{{
                errors.new_password1[0]
              }}</small>
            </p>

            <p class="form-label mt-1">New password repeat:</p>
            <input
              type="password"
              class="form-input"
              v-model="newPassword2"
              ref="password2"
              @keyup.up="$refs.password1.focus()"
              :class="{
                '!border-red-600 focus:border-none': errors.new_password2?.length,
              }"
            />
            <p>
              <small class="form-error-label" v-if="errors.new_password2?.length">{{
                errors.new_password2[0]
              }}</small>
            </p>

            <button
              type="submit"
              class="mt-3 btn btn-green"
              :class="{ 'btn-green-hover': isValid }"
              :disabled="!isValid"
              @click="submit"
            >
              Change Password
            </button>
            <div class="loader my-5 mx-auto" v-if="loading"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapStores } from "pinia";
import { useAccountStore } from "../stores/accountStore.ts";

export default {
  data() {
    return {
      loading: false,
      oldPassword: "",
      newPassword1: "",
      newPassword2: "",
      errors: { old_password: [], new_password1: [], new_password2: [] },
    };
  },
  methods: {
    async submit() {
      if (this.isValid) {
        this.loading = true;
        const { success, data } = await this.accountStore.changePassword(
          this.oldPassword,
          this.newPassword1,
          this.newPassword2
        );
        this.loading = false;

        if (success) {
          this.$router.push({
            name: "feed",
            query: { action: "password-change" },
          });
        } else {
          this.errors = data;
        }
      }
    },
  },
  computed: {
    isValid() {
      const oldPassword = this.oldPassword.length >= 8;
      const newPassword1 = this.newPassword1.length >= 8;
      const newPassword2 = this.newPassword2.length >= 8 && this.newPassword1 === this.newPassword2;
      return oldPassword && newPassword1 && newPassword2;
    },
    ...mapStores(useAccountStore),
  },
};
</script>
