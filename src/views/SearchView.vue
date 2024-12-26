<template>
  <main>
    <div class="container-border">
      <div class="shadow">
        <div class="header-3xl">Search</div>
        <div class="mx-3 pb-3 mt-3">
          <input
            type="text"
            placeholder="Search query"
            class="form-input !py-1 !ps-3 !mt-0"
            v-model="query"
          />
        </div>
        <div class="pb-10 pt-7" v-if="loading">
          <div class="loader mx-auto"></div>
        </div>
        <div v-else>
          <div v-if="results.length && query.length >= 3">
            <div class="pb-3">
              <div class="header-xl !mb-0">
                Results (<span class="varela-round">{{ results.length }}</span
                >):
              </div>
              <div
                class="flex relative mx-3 hover:bg-gray-200 dark:hover:bg-slate-700 mt-3 ps-1 lg:ps-3"
                v-for="result in results"
                :key="result.id"
              >
                <div class="w-1/12 my-3">
                  <RouterLink :to="{ name: 'user', params: { username: result.username } }">
                    <img :src="result.avatar" alt="avatar" class="rounded-full max-w-full" />
                  </RouterLink>
                </div>
                <div class="ms-3 my-auto text-gray-700 dark:text-gray-300 text-xl w-full">
                  <div class="flex">
                    <RouterLink
                      :to="{ name: 'user', params: { username: result.username } }"
                      class="hover:text-gray-600 dark:hover:text-gray-400"
                    >
                      {{ result.username }}
                    </RouterLink>
                    <button
                      class="btn-follow ms-3 px-5"
                      type="button"
                      :class="result.is_followed ? 'bg-gray-500 dark:bg-gray-600' : 'bg-blue-500'"
                      @click="followUser(result)"
                      v-if="authenticationStore.user.id !== result.id"
                    >
                      {{ result.is_followed ? "Followed" : "Follow" }}
                    </button>
                  </div>
                  <div class="flex text-xl text-gray-600 dark:text-gray-400 pb-1 mt-auto">
                    <UserStat caption="posts" :value="result.posts_count" />
                    <UserStat caption="followers" :value="result.followers_count" />
                    <UserStat caption="followings" :value="result.followings_count" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="query.length < 3">
            <div class="text-gray-600 dark:text-gray-500 pb-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-36 mx-auto"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clip-rule="evenodd"
                />
              </svg>
              <div class="header-3xl !text-gray-500 !mt-0">Type your query (3+ symbols)</div>
            </div>
          </div>

          <div v-else>
            <div class="text-gray-600 dark:text-gray-500 pb-10">
              <NoResults />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { IUserExtendedData } from "../types/globals";
import { useUsersStore } from "../stores/usersStore.ts";
import { useAuthenticationStore } from "../stores/authenticationStore.ts";
import { mapStores } from "pinia";
import UserStat from "../components/UserStat.vue";
import NoResults from "../components/NoResults.vue";

export default {
  components: { NoResults, UserStat },
  data() {
    return {
      query: "",
      results: [] as Array<IUserExtendedData>,
      loading: false,
    };
  },
  methods: {
    async followUser(user: IUserExtendedData) {
      const action = user.is_followed ? this.usersStore.disfollow : this.usersStore.follow;
      const { success } = await action(user.id);
      if (success) {
        user.is_followed = !user.is_followed;
        user.followers_count += user.is_followed ? 1 : -1;
      }
    },
  },
  watch: {
    async query(newValue) {
      if (newValue.length >= 3) {
        this.loading = true;
        this.results = await this.usersStore.searchUsers(newValue);
        this.loading = false;
      }
    },
  },
  computed: { ...mapStores(useUsersStore, useAuthenticationStore) },
};
</script>
