<template>
  <main>
    <div class="container-border">
      <div class="shadow">
        <div class="py-10" v-if="loading">
          <div class="loader mx-auto"></div>
        </div>

        <FetchUserError v-else-if="errorFetchUser.length" />

        <div v-else>
          <div class="flex justify-center items-center h-full mb-3">
            <div class="w-1/5 lg:w-1/6 ms-2 mt-3">
              <img
                :src="requestedUser.avatar"
                alt="avatar"
                class="border-2 border-gray-600 p-1 rounded-full max-w-full"
              />
            </div>
            <UserInfo
              @follow="followUser"
              :posts-count="postsCount"
              :possibleToFollow="authenticationStore.user.id !== requestedUser.id"
              :requested-user="requestedUser"
              :followings="followings"
              @followersModal="showModal('followers')"
              @followingsModal="showModal('followings')"
            />
          </div>

          <div class="px-1 pb-1.5 h-1">
            <hr class="border border-gray-600" />
          </div>

          <PostsGrid
            :posts="posts"
            @updatePostsScroll="getPostsNextPage"
            v-if="posts"
            :pinnedMode="true"
          />
          <SubscriptionsModal
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
          <SubscriptionsModal
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
  <Alert :message="alertMessage" v-if="showAlert" />
</template>

<script lang="ts">
import { IPost, IUserExtendedData } from "../types/globals";
import { mapStores } from "pinia";
import { useUsersStore } from "../stores/usersStore.ts";
import { usePostsStore } from "../stores/postsStore.ts";
import { useAuthenticationStore } from "../stores/authenticationStore.ts";

import PostsGrid from "../components/PostsGrid/PostsGrid.vue";
import SubscriptionsModal from "../components/modals/SubscriptionsModal/SubscriptionsModal.vue";
import Alert from "../components/alert/Alert.vue";
import { IUserProfileData } from "../types/IUserProfileData.ts";
import FetchUserError from "../components/FetchUserError.vue";
import UserInfo from "../components/UserInfo.vue";

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
        const { success } = await this.usersStore.disfollow(this.requestedUser.id);
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
            this.authenticationStore.user.username === this.requestedUser.username &&
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
        const posts = await this.postsStore.getUserPosts(this.requestedUser.username);
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
    alertMessage() {
      return this.$route.query.action === "new-post"
        ? "Post created."
        : this.$route.query.action === "post-deleted"
          ? "Post deleted."
          : "Settings updated.";
    },
    showAlert() {
      return (
        this.$route.query.action === "new-post" ||
        this.$route.query.action === "settings" ||
        this.$route.query.action === "post-deleted"
      );
    },
  },
  components: { UserInfo, FetchUserError, Alert, PostsGrid, SubscriptionsModal },
};
</script>
