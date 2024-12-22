<template>
  <main class="relative">
    <div class="hw-centered flex flex-col">
      <the-reset-password
        @submitted="showAlert = true"
        v-if="!(uid?.length && token?.length)"
      />
      <the-reset-password-confirm
        :token="String(token)"
        :uid="String(uid)"
        v-if="uid?.length && token?.length"
      />
      <div class="footer-links flex flex-col">
        <div class="mx-auto">
          Already have an account?
          <router-link :to="{ name: 'login' }" class="link">Log in</router-link>
        </div>
      </div>
    </div>
  </main>
  <Alert
    @exited="showAlert = false"
    message="Check your email now."
    v-if="showAlert"
  />
</template>

<script lang="ts">
import TheResetPassword from "../components/TheResetPassword.vue";
import TheResetPasswordConfirm from "../components/TheResetPasswordConfirm.vue";
import { LocationQueryValue } from "vue-router";
import Alert from "../components/alert/Alert.vue";

export default {
  data() {
    return {
      showAlert: false,
      uid: null as LocationQueryValue | Array<LocationQueryValue>,
      token: null as LocationQueryValue | Array<LocationQueryValue>,
    };
  },
  mounted() {
    Object.keys(this.$route.query).forEach(el => {
      if (el.endsWith("token")) {
        this.token = this.$route.query[el];
      }
    });
    this.uid = this.$route.query.uid;
  },
  components: { Alert, TheResetPasswordConfirm, TheResetPassword },
};
</script>
