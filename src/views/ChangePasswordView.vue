<template>
  <div class="container-border">
    <div class="shadow justify-center">
      <div class="w-full flex h-full items-center justify-center">
        <div class="w-3/4 lg:w-2/3">
          <div class="header-2xl">Change your account password</div>
          <div class="mx-3 mb-3 mt-1">
            <p class="form-label">Old password:</p>
            <input
                type="password"
                placeholder="Your old password"
                class="form-input"
                v-model="oldPassword"
                :class="{'border-red': errors.old_password?.length}"
            >
            <p><small class="form-error-label" v-if="errors.old_password?.length">{{errors.old_password[0]}}</small></p>

            <p class="form-label mt-1">New password:</p>
            <input
                type="password"
                placeholder="Your new password"
                class="form-input"
                v-model="newPassword1"
                :class="{'form-input': errors.new_password1?.length}"
            >
            <p><small class="form-error-label" v-if="errors.new_password1?.length">{{errors.new_password1[0]}}</small></p>

            <p class="form-label mt-1">New password repeat:</p>
            <input
                type="password"
                placeholder="Your new password repeat"
                class="form-input"
                v-model="newPassword2"
                :class="{'border-red': errors.new_password2?.length}"
            >
            <p><small class="form-error-label" v-if="errors.new_password2?.length">{{errors.new_password2[0]}}</small></p>

            <button
                type="submit"
                class="mt-3 btn btn-green"
                :class="{'btn-green-hover': isValid}"
                :disabled="!isValid"
                @click="submit"
            >Change Password</button>
            <div class="loader my-5 mx-auto" v-if="loading"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {mapStores} from "pinia"
import {useAccountStore} from "../stores/accountStore.ts"

export default {
  data() {
    return {
      loading: false,
      oldPassword: '',
      newPassword1: '',
      newPassword2: '',
      errors: {}
    }
  },
  methods: {
    async submit() {
      const {success, data} = await this.accountStore.changePassword(this.oldPassword, this.newPassword1, this.newPassword2)
      if (success) {
        this.$router.push({name: 'feed', query: {'action': 'passwond-change'}})
      } else {
        this.errors = data
      }
    }
  },
  computed: {
    isValid() {
      const oldPassword = this.oldPassword.length >= 8
      const newPassword1 = this.newPassword1.length >= 8
      const newPassword2 = this.newPassword2.length >= 8 && this.newPassword1 === this.newPassword2
      return oldPassword && newPassword1 && newPassword2
    },
    ...mapStores(useAccountStore)
  }
}
</script>
