<template>
  <div class="header-3xl mb-3">Password reset</div>
  <div class="card md:w-2/5 lg:w-1/3 xl:w-1/4">
    <div class="w-full h-full items-center justify-center mt-3">
      <div class="m-3">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label class="form-label">Email:</label>
            <input
              type="email"
              class="form-input"
              v-model="email"
            />
          </div>
          <button
            type="submit"
            class="mt-2 btn btn-green"
            :class="{ 'btn-green-hover': isValid }"
            :disabled="!isValid"
          >
            Reset
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
  emits: ["submitted"],
  data() {
    return {
      email: "",
      loading: false,
    };
  },
  methods: {
    async handleSubmit() {
      if (this.isValid) {
        this.loading = true;
        try {
          await this.accountStore.resetPassword(this.email);
          this.$emit("submitted");
        } finally {
          this.loading = false;
        }
      }
    },
  },
  computed: {
    isValid() {
      return this.email.length > 0;
    },
    ...mapStores(useAccountStore),
  },
};
</script>
