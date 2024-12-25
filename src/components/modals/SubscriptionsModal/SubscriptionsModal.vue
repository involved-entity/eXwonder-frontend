<template>
  <div class="fixed inset-0 bg-opacity-90 bg-black flex justify-center items-center z-50">
    <div class="flex h-3/5 lg:h-2/3 text-gray-700 dark:text-gray-300">
      <div
        class="overflow-y-auto flex flex-col mb-auto max-h-full w-[21rem] lg:w-[28rem] rounded-xl bg-gray-200 dark:bg-[#111]"
        ref="modal"
      >
        <div class="sticky top-0 left-0 pt-3 pb-1 z-[1] bg-gray-300 dark:bg-[#070707]">
          <div class="grid grid-cols-2 mx-3">
            <div class="col-span-1 text-2xl flex justify-start">
              {{ formattedFollowMode }}
              <div class="ms-1 varela-round">({{ followsCount }})</div>
            </div>
            <div class="flex col-span-1 ms-auto">
              <ModalCloseButton @close="close" />
            </div>
          </div>
          <div class="mx-3 my-1" v-if="followMode === 'followings'">
            <input
              class="w-full bg-gray-200 px-5 py-1 outline-none dark:bg-[#090909]"
              v-model="searchQuery"
              @input="searchFollowings"
            />
          </div>
        </div>
        <div class="mt-1 mx-2 mb-1">
          <div class="py-10" v-if="followsLoading">
            <div class="loader mx-auto"></div>
          </div>
          <div class="mt-1" v-else>
            <div v-if="follows.length">
              <div
                class="text-gray-700 dark:text-gray-300 text-center text-xl mb-1 lg:mb-0"
                v-if="searchQuery.length"
              >
                Results (<span class="varela-round">{{ follows.length }}</span
                >):
              </div>
              <FollowsList
                :follow-field="followField"
                :follow-mode="followMode"
                @userLeave="$emit('userLeave')"
                :follows="follows"
              />
            </div>
            <div v-else>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-20 mx-auto"
              >
                <path
                  fill-rule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                  clip-rule="evenodd"
                />
              </svg>
              <div class="text-center text-3xl">No results found :/</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { IUserFollowData } from "../../../types/IUserFollowData.ts";
import { mapStores } from "pinia";
import { useUsersStore } from "../../../stores/usersStore.ts";
import { IResponse } from "../../../types/helpers";
import ModalCloseButton from "../ModalCloseButton.vue";
import FollowsList from "./FollowsList.vue";

export default {
  components: { FollowsList, ModalCloseButton },
  emits: ["close", "userLeave"],
  props: {
    requestedUserId: {
      type: Number as PropType<number>,
      required: true,
    },
    followMode: {
      type: String as PropType<"followers" | "followings">,
      required: true,
      validator(value: string) {
        return ["followers", "followings"].includes(value);
      },
    },
    followsCount: {
      type: Number as PropType<number>,
      required: true,
    },
  },
  data() {
    return {
      follows: [] as Array<IUserFollowData>,
      followsLoading: false,
      searchQuery: "",
      followField: "",
    };
  },
  computed: {
    ...mapStores(useUsersStore),
    formattedFollowMode() {
      return this.followMode.charAt(0).toUpperCase() + this.followMode.slice(1);
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async searchFollowings() {
      this.followsLoading = true;
      this.follows = (
        await this.usersStore.getUserFollowings(this.requestedUserId, 1, this.searchQuery)
      ).data.results;
      this.followsLoading = false;
    },
    handleClick(event: Event) {
      if (!(this.$refs.modal as HTMLElement).contains(event.target)) this.close();
    },
    async fetchFollows() {
      this.followsLoading = true;
      const response: IResponse =
        this.followMode === "followers"
          ? await this.usersStore.getMyFollowers()
          : await this.usersStore.getUserFollowings(this.requestedUserId);
      this.follows = response.data.results;
      this.followField = this.followMode === "followers" ? "follower" : "following";
      this.followsLoading = false;
    },
  },
  async mounted() {
    await this.fetchFollows();
    document.body.addEventListener("click", this.handleClick);
  },
  unmounted() {
    document.body.removeEventListener("click", this.handleClick);
  },
};
</script>
