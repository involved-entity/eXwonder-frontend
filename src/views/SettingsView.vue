<template>
  <div class="container-border">
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
          <p class="form-label">E-mail:</p>
          <input
            type="email"
            :placeholder="authenticationStore.user.email"
            class="form-input"
            v-model="email"
            :class="{ '!border-red-600': errors.email?.length }"
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
            :class="{ '!border-red-600': errors.timezone?.length }"
            @keyup.up="$refs.emailInput.focus()"
            @keyup.down="$refs.is2faEnabled.focus()"
            ref="timezoneInput"
            list="timezones"
          />
          <datalist id="timezones">
            <option v-for="timezone in authenticationStore.availibleTimezones" :key="timezone">
              {{ timezone }}
            </option>
          </datalist>
          <p>
            <small class="form-error-label" v-if="errors.timezone?.length">{{
              errors.timezone[0]
            }}</small>
          </p>

          <div class="flex mt-3 space-x-1.5">
            <div class="form-label">Is 2FA enabled:</div>
            <input
              type="checkbox"
              v-model="is2faEnabled"
              class="w-4 h-4 text-blue-600 rounded bg-gray-custom my-auto"
              ref="is2faEnabled"
            />
          </div>
          <p></p>

          <div class="flex mt-3 space-x-1.5">
            <div class="form-label">Is account private:</div>
            <input
              type="checkbox"
              v-model="isPrivate"
              class="w-4 h-4 text-blue-600 rounded bg-gray-custom my-auto"
              ref="isPrivate"
            />
          </div>
          <p></p>
        </div>
      </div>
      <div class="ps-3 pr-3 lg:pr-6 lg:ps-6 pb-5 pt-1.5">
        <div class="w-full">
          <div class="grid grid-cols-2 w-full gap-x-3">
            <button
              type="submit"
              class="mt-3 btn col-span-1 btn-green"
              :class="{ 'btn-green-hover': isValid }"
              :disabled="!isValid"
              @click="submit(false)"
            >
              Save & Close
            </button>
            <router-link :to="{ name: 'change-password' }" class="col-span-1">
              <button type="button" class="mt-3 btn btn-green btn-green-hover">
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

        <div class="mt-3">
          <DialogRoot>
            <DialogTrigger class="btn btn-green btn-green-hover"> Edit public info </DialogTrigger>
            <DialogPortal>
              <DialogOverlay class="bg-transparent/50 fixed inset-0 z-30" />
              <DialogContent
                class="fixed top-[50%] left-[50%] max-h-[90vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-default p-[20px] focus:outline-none z-[100]"
              >
                <DialogTitle class="text-default m-0 text-[17px] font-semibold">
                  Edit public info
                </DialogTitle>
                <DialogDescription class="text-default-700 mt-[10px] mb-5 text-sm leading-normal">
                  Change your public information here. Click
                  <span class="text-green-600">"SAVE CHANGES"</span> when you're done.
                </DialogDescription>
                <fieldset class="mb-[15px] flex text-default items-center gap-5">
                  <label class="w-[90px] text-right text-sm" for="name"> Name </label>
                  <input
                    id="name"
                    class="text-default placeholder-default placeholder-opac bg-transparent h-[35px] w-full flex-1 items-center justify-center rounded-lg inline-flex leading-none shadow-[0_0_0_1px] focus:shadow-[0_0_0_2px] px-[10px] text-sm"
                    :placeholder="authenticationStore.user.name"
                    v-model="name"
                    :class="{ '!border-red-600': errors.name?.length }"
                    ref="nameInput"
                    @keyup.down="$refs.emailInput.focus()"
                  />
                  <p>
                    <small class="form-error-label" v-if="errors.name?.length">{{
                      errors.name[0]
                    }}</small>
                  </p>
                </fieldset>
                <fieldset class="mb-[15px] text-default flex items-center gap-5">
                  <label class="w-[90px] text-right text-sm" for="desc"> Description </label>
                  <textarea
                    id="desc"
                    class="text-default placeholder-default bg-transparent inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-lg px-[10px] text-sm leading-none shadow-[0_0_0_1px] focus:shadow-[0_0_0_2px]"
                    :placeholder="authenticationStore.user.desc"
                    rows="1"
                    v-model="desc"
                  />
                  <p>
                    <small class="form-error-label" v-if="errors.desc?.length">{{
                      errors.desc[0]
                    }}</small>
                  </p>
                </fieldset>
                <fieldset class="mb-[15px] text-default flex items-center gap-5">
                  <label class="w-[90px] text-right text-sm" for="desc"> Avatar </label>
                  <div class="relative">
                    <input
                      type="file"
                      ref="images"
                      @change="avatarChanged"
                      class="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <button class="btn-no-w btn-green btn-green-hover">Select File</button>
                  </div>
                </fieldset>
                <div class="mt-[25px] flex justify-end">
                  <div class="flex gap-x-7 items-center">
                    <div class="loader size-[25px]" v-if="loadingModal"></div>
                    <button
                      class="btn-no-w btn-green"
                      :class="{ 'btn-green-hover': isValid }"
                      :disabled="!isValid"
                      @click="submit(true)"
                    >
                      Save & Close
                    </button>
                  </div>
                </div>
                <DialogClose
                  class="text-emerald-600 hover:bg-green-500 hover:text-gray-50 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                  aria-label="Close"
                >
                  <Icon icon="lucide:x" />
                </DialogClose>
              </DialogContent>
            </DialogPortal>
          </DialogRoot>
        </div>
        <div class="loader my-5 mx-auto" v-if="loadingDefault"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapStores } from "pinia";
import { checkIsEmailValid } from "../helpers";
import { useAccountStore } from "../stores/accountStore.ts";
import { useAuthenticationStore } from "../stores/authenticationStore.ts";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "reka-ui";
import { Icon } from "@iconify/vue";

export default {
  components: {
    Icon,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
  },
  data() {
    return {
      loadingDefault: false,
      loadingModal: false,
      name: "",
      email: "",
      timezone: "",
      desc: "",
      is2faEnabled: undefined as boolean | undefined,
      isPrivate: undefined as boolean | undefined,
      avatar: undefined as File | undefined,
      errors: { name: [], email: [], timezone: [], desc: [] },
    };
  },
  methods: {
    async logout() {
      this.loadingDefault = true;
      await this.authenticationStore.logout();
      this.$router.push({ name: "login" });
      this.loadingDefault = false;
    },

    async submit(modal: boolean) {
      if (this.isValid) {
        if (modal) {
          this.loadingModal = true;
        } else {
          this.loadingDefault = true;
        }
        const data = {
          name: this.name,
          email: this.email,
          timezone: this.timezone,
          description: this.desc,
          is_2fa_enabled: this.is2faEnabled,
          is_private: this.isPrivate,
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
          this.errors.name = errors.name;
          this.errors.email = errors.email;
          this.errors.timezone = errors.timezone;
          this.errors.desc = errors.description;
        }

        modal ? (this.loadingModal = false) : (this.loadingDefault = false);
      }
    },
    avatarChanged(event: Event) {
      this.avatar = event.target!.files[0];
    },
  },
  mounted() {
    this.is2faEnabled = this.authenticationStore.user.is2faEnabled;
    this.isPrivate = this.authenticationStore.user.isPrivate;
  },
  computed: {
    isValid() {
      return (
        checkIsEmailValid(this.email) &&
        (this.name !== "" ||
          this.email !== "" ||
          this.timezone !== "" ||
          this.desc !== "" ||
          this.is2faEnabled !== this.authenticationStore.user.is2faEnabled ||
          this.isPrivate !== this.authenticationStore.user.isPrivate ||
          this.avatar)
      );
    },
    ...mapStores(useAccountStore, useAuthenticationStore),
  },
};
</script>
