<template>
  <main>
    <div class="container-border">
      <div class="shadow">
        <div class="py-10" v-if="loading">
          <div class="loader mx-auto"></div>
        </div>
        <div
          class="text-gray-700 dark:text-gray-300"
          v-else-if="errorFetchUser.length"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-60 m-auto"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          <p class="text-4xl text-center pb-5">{{ errorFetchUser }}</p>
        </div>

        <div v-else>
          <div class="flex justify-center mb-1.5">
            <div class="w-1/5 lg:w-1/6 ms-2 my-3">
              <img
                :src="requestedUser.avatar"
                alt="avatar"
                class="border-2 border-gray-600 p-1 rounded-full max-w-full"
              />
            </div>
            <div class="ms-2 relative">
              <p
                class="text-gray-700 dark:text-gray-300 text-lg lg:text-xl mt-5"
              >
                {{ requestedUser.username }}
              </p>
              <button
                class="btn-follow absolute top-0 right-0 mt-5"
                type="button"
                :class="{
                  'bg-gray-500 dark:bg-gray-600': followings.followed,
                  'bg-blue-500': !followings.followed,
                }"
                @click="followUser"
                v-if="authenticationStore.user.id !== requestedUser.id"
              >
                {{ followings.followed ? "Followed" : "Follow" }}
              </button>
              <div
                class="flex text-xl text-gray-600 dark:text-gray-400 pb-1 mt-auto"
              >
                <div class="pr-4">
                  <div class="text-base lg:text-xl">
                    <span
                      class="text-gray-700 dark:text-gray-300 text-xl font-semibold varela-round"
                      >{{ postsCount }}</span
                    >
                    posts
                  </div>
                </div>
                <div
                  class="pr-4"
                  :class="{
                    'cursor-pointer hover:text-gray-500':
                      authenticationStore.user.username ===
                        requestedUser.username && followings.followersCount > 0,
                  }"
                  @click="showModal('followers')"
                >
                  <div class="text-base lg:text-xl">
                    <span
                      class="text-gray-700 dark:text-gray-300 text-xl font-semibold varela-round"
                      >{{ followings.followersCount }}</span
                    >
                    followers
                  </div>
                </div>
                <div
                  :class="{
                    'cursor-pointer hover:text-gray-500':
                      followings.followingsCount > 0,
                  }"
                  @click="showModal('followings')"
                >
                  <div class="text-base lg:text-xl">
                    <span
                      class="text-gray-700 dark:text-gray-300 text-xl font-semibold varela-round"
                      >{{ followings.followingsCount }}</span
                    >
                    followings
                  </div>
                </div>
              </div>
              <p
                class="text-lg text-gray-700 dark:text-gray-300 font-semibold pr-5"
              >
                {{ requestedUser.name }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400 pr-5">
                {{ requestedUser.desc }}
              </p>
            </div>
          </div>

          <div class="ps-3 pr-3 pb-1.5 h-1">
            <hr class="border border-gray-600" />
          </div>

          <app-posts-grid
            :posts="posts"
            @updatePostsScroll="getPostsNextPage"
            v-if="posts"
          />
          <app-subscriptions-modal
            :follows-count="followings.followersCount"
            follow-mode="followers"
            :requested-user-id="requestedUser.id"
            @close="showFollowersModal = false"
            @userLeave="
              showFollowingsModal = false;
              showFollowersModal = false;
            "
            v-if="showFollowersModal"
          />
          <app-subscriptions-modal
            :follows-count="followings.followingsCount"
            follow-mode="followings"
            :requested-user-id="requestedUser.id"
            @close="showFollowingsModal = false"
            @userLeave="
              showFollowingsModal = false;
              showFollowersModal = false;
            "
            v-if="showFollowingsModal"
          />
          <div class="py-10" v-if="loadingNextPage">
            <div class="loader mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <div class="relative">
    <div class="fixed left-5 top-5 z-50">
      <app-alert
        :message="
          $route.query.action === 'new-post'
            ? 'Post created.'
            : $route.query.action === 'post-deleted'
              ? 'Post deleted.'
              : 'Settings updated.'
        "
        v-if="
          $route.query.action === 'new-post' ||
          $route.query.action === 'settings' ||
          $route.query.action === 'post-deleted'
        "
      />
    </div>
  </div>
</template>

<script lang="ts">
import { IPost, IUserProfileData, IUserExtendedData } from "@/types/globals";
import { mapStores } from "pinia";
import { useUsersStore } from "../stores/usersStore.ts";
import { usePostsStore } from "../stores/postsStore.ts";
import { useAuthenticationStore } from "../stores/authenticationStore.ts";

import AppPostsGrid from "../components/AppPostsGrid.vue";
import AppSubscriptionsModal from "../components/AppSubscriptionsModal.vue";
import AppAlert from "../components/AppAlert.vue";

export default {
  data() {
    return {
      requestedUser: {
        id: 0,
        username: "",
        name: "",
        desc: "",
        avatar: "",
      } as IUserProfileData,
      followings: {
        followersCount: 0,
        followingsCount: 0,
        followings: [] as Array<IUserExtendedData>,
        followed: false,
      },
      showFollowersModal: false,
      showFollowingsModal: false,
      posts: [] as Array<IPost>,
      postsCount: 0,
      loading: false,
      errorFetchUser: "",
      loadingNextPage: false,
      currentPage: undefined as number | undefined,
    };
  },
  methods: {
    async followUser() {
      if (!this.followings.followed) {
        const { success } = await this.usersStore.follow(this.requestedUser.id);

        if (success) {
          this.followings.followed = true;
          this.followings.followersCount++;
        }
      } else {
        const { success } = await this.usersStore.disfollow(
          this.requestedUser.id
        );
        if (success) {
          this.followings.followed = false;
          this.followings.followersCount--;
        }
      }
    },
    showModal(modalType: "followers" | "followings") {
      switch (modalType) {
        case "followers":
          if (
            this.authenticationStore.user.username ===
              this.requestedUser.username &&
            this.followings.followersCount > 0
          ) {
            this.showFollowersModal = true;
          }
          break;
        case "followings":
          if (this.followings.followingsCount > 0) {
            this.showFollowingsModal = true;
          }
      }
    },
    async updateUserInfo(username?: string) {
      this.loading = true;
      const { data } = await this.usersStore.getUser(
        username ? username : (this.$route.params.username as string)
      );

      if (!data.username) {
        this.errorFetchUser = "User is not found. :(";
      } else {
        this.requestedUser.id = data.id;
        this.requestedUser.username = data.username;
        this.requestedUser.name = data.name;
        this.requestedUser.desc = data.description;
        this.requestedUser.avatar = data.avatar;
        this.followings.followersCount = data.followers_count;
        this.followings.followingsCount = data.followings_count;
        this.followings.followed = data.is_followed;
        const posts = await this.postsStore.getUserPosts(
          this.requestedUser.username
        );
        this.posts = posts.data.results;
        this.postsCount = posts.data.count;
        this.currentPage = posts.data.next ? 2 : undefined;
      }

      this.loading = false;
    },
    async getPostsNextPage() {
      if (this.currentPage) {
        this.loadingNextPage = true;
        const { data } = await this.postsStore.getUserPosts(
          this.requestedUser.username,
          this.currentPage
        );
        this.posts.push(...data.results);
        this.currentPage = data.next ? this.currentPage + 1 : undefined;
        this.loadingNextPage = false;
      }
    },
  },
  async mounted() {
    await this.updateUserInfo();
  },
  async beforeRouteUpdate(to) {
    await this.updateUserInfo(to.params.username as string);
  },
  computed: {
    ...mapStores(useUsersStore, usePostsStore, useAuthenticationStore),
  },
  components: { AppAlert, AppPostsGrid, AppSubscriptionsModal },
};
</script>
