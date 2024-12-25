<template>
  <div>
    <BurgerButton :depends="isOpen" @changed="toggleSidebar(true)" />

    <transition name="slide">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
        @click="toggleSidebar(false)"
      ></div>
    </transition>

    <transition name="slide">
      <aside
        v-if="isOpen"
        class="fixed right-0 top-0 h-full w-3/5 bg-gray-100 dark:bg-[#151515] shadow-lg z-50 transform transition-transform duration-300"
      >
        <div class="text-gray-700 dark:text-gray-300 p-4">
          <BurgerButton :nested="true" @changed="toggleSidebar(false)" />
          <ul class="mt-4">
            <li>
              <router-link :to="{ name: 'saved-posts' }">
                <button
                  class="nav-btn"
                  :class="{
                    'inactive-': $route.name !== 'saved-posts',
                    'active-': $route.name === 'saved-posts',
                  }"
                  @click="isOpen = false"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="nav-btn-svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9"
                    />
                  </svg>
                  <span class="nav-btn-text">Saved</span>
                </button>
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'new-post' }">
                <button
                  class="nav-btn"
                  :class="{
                    'inactive-': $route.name !== 'new-post',
                    'active-': $route.name === 'new-post',
                  }"
                  @click="isOpen = false"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="nav-btn-svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                    />
                  </svg>
                  <span class="nav-btn-text">Create</span>
                </button>
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'settings' }">
                <button
                  class="nav-btn"
                  :class="{
                    'inactive-': $route.name !== 'settings',
                    'active-': $route.name === 'settings',
                  }"
                  @click="isOpen = false"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="nav-btn-svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  <span class="nav-btn-text">Settings</span>
                </button>
              </router-link>
            </li>
          </ul>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script lang="ts">
import BurgerButton from "../components/BurgerButton.vue";

export default {
  components: { BurgerButton },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggleSidebar(v: boolean | null = null) {
      this.isOpen = v || !this.isOpen;
    },
  },
};
</script>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
