<template>
  <div class="container-border" @keyup.enter="submit">
    <div class="shadow">
      <div class="ps-3 pr-3 pb-3 h-1 pt-3">
        <hr class="border border-gray-600" />
      </div>
      <div class="lg:flex ps-3 pr-3 lg:space-x-7">
        <img
          :src="authenticationStore.user.avatar"
          alt="avatar"
          class="size-[13.5rem] mx-auto lg:mx-0"
        />
        <div class="mx-auto w-full">
          <p class="form-label">Name:</p>
          <input
              type="text"
              :placeholder="authenticationStore.user.name"
              class="form-input"
              v-model="name"
              :class="{ 'border-red': errors.name?.length }"
              ref="nameInput"
              @keyup.down="$refs.emailInput.focus()"
          />
          <p>
            <small class="form-error-label" v-if="errors.name?.length">{{
                errors.name[0]
              }}</small>
          </p>

          <p class="form-label mt-3">E-mail:</p>
          <input
            type="email"
            :placeholder="authenticationStore.user.email"
            class="form-input"
            v-model="email"
            :class="{ 'border-red': errors.email?.length }"
            ref="emailInput"
            @keyup.up="$refs.nameInput.focus()"
            @keyup.down="$refs.timezoneInput.focus()"
          />
          <p>
            <small class="form-error-label" v-if="errors.email?.length">{{
              errors.email[0]
            }}</small>
          </p>

          <p class="form-label mt-3">Time zone:</p>
          <input
            type="text"
            :placeholder="authenticationStore.user.timezone"
            v-model="timezone"
            class="form-input"
            :class="{ 'border-red': errors.timezone?.length }"
            @keyup.up="$refs.emailInput.focus()"
            @keyup.down="$refs.is2faEnabled.focus()"
            ref="timezoneInput"
            list="timezones"
          />
          <datalist id="timezones">
            <option v-for="timezone in authenticationStore.availibleTimezones">
              {{ timezone }}
            </option>
          </datalist>
          <p>
            <small class="form-error-label" v-if="errors.timezone?.length">{{
              errors.timezone[0]
            }}</small>
          </p>
        </div>
      </div>
      <div class="ps-3 pr-3 lg:pr-6 lg:ps-6 pb-5 pt-3">
        <p class="form-label mt-3">Description:</p>
        <textarea
            rows="5"
            class="p-2.5 -mr-10 w-11/12 text-lg text-gray-700 dark:text-gray-400 rounded-lg border border-gray-700 outline-none dark:bg-[#161616] dark:border-[#161616] bg-gray-200"
            :placeholder="authenticationStore.user.desc"
            v-model="desc"
        />
        <p>
          <small class="form-error-label" v-if="errors.desc?.length">{{
              errors.desc[0]
            }}</small>
        </p>

        <p class="form-label mt-3">Is 2FA enabled:</p>
        <input
            type="checkbox"
            v-model="is2faEnabled"
            class="w-4 h-4 text-blue-600 rounded bg-gray-custom"
            ref="is2faEnabled"
        />
        <p></p>

        <p class="form-label mt-3">Avatar:</p>
        <div class="relative">
          <input
              type="file"
              ref="images"
              @change="avatarChanged"
              class="absolute inset-0 opacity-0 cursor-pointer"
          />
          <button class="btn-no-w btn-green btn-green-hover">
            Select File
          </button>
        </div>
        <div class="w-full">
          <div class="grid grid-cols-2 w-full gap-x-3">
            <button
                type="submit"
                class="mt-3 btn col-span-1 btn-green"
                :class="{ 'btn-green-hover': isValid }"
                :disabled="!isValid"
                @click="submit"
            >
              Save & Close
            </button>
            <router-link :to="{ name: 'change-password' }" class="col-span-1">
              <button
                  type="button"
                  class="mt-3 btn btn-green btn-green-hover"
              >
                Change Password
              </button>
            </router-link>
          </div>
          <button
              class="!p-1 my-auto ms-auto btn btn-green btn-green-hover text-sm xl:text-md mt-1 block lg:hidden"
              @click="logout"
          >
            Logout
          </button>
        </div>
        <div class="loader my-5 mx-auto" v-if="loading"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapStores } from "pinia";
import { useAccountStore } from "../stores/accountStore.ts";
import { useAuthenticationStore } from "../stores/authenticationStore.ts";

export default {
  data() {
    return {
      loading: false,
      name: "",
      email: "",
      timezone: "",
      desc: "",
      is2faEnabled: undefined as boolean | undefined,
      avatar: undefined as File | undefined,
      errors: { name: [], email: [], timezone: [], desc: [] },
    };
  },
  methods: {
    async logout() {
      this.loading = true;
      await this.authenticationStore.logout();
      this.$router.push({ name: "login" });
      this.loading = false;
    },

    async submit() {
      if (this.isValid) {
        this.loading = true;
        const data = {
          name: this.name,
          email: this.email,
          timezone: this.timezone,
          description: this.desc,
          is_2fa_enabled: this.is2faEnabled,
          avatar: this.avatar,
        };
        const errors: Record<string, Array<string>> | undefined =
          await this.accountStore.updateSettings(data);

        if (!errors) {
          this.errors = { name: [], email: [], timezone: [], desc: [] };
          this.$router.push({
            path: "/" + this.authenticationStore.user.username + "/",
            query: { action: "settings" },
          });
        } else {
          this.errors.name = errors.name
          this.errors.email = errors.email;
          this.errors.timezone = errors.timezone;
          this.errors.desc = errors.description
        }

        this.loading = false;
      }
    },
    avatarChanged(event: Event) {
      this.avatar = event.target!.files[0];
    },
  },
  mounted() {
    this.is2faEnabled = this.authenticationStore.user.is2faEnabled;
  },
  computed: {
    isValid() {
      return (
        this.name !== "" ||
        this.email !== "" ||
        this.timezone !== "" ||
        this.desc !== "" ||
        this.is2faEnabled !== this.authenticationStore.user.is2faEnabled ||
        this.avatar
      );
    },
    ...mapStores(useAccountStore, useAuthenticationStore),
  },
};
</script>
