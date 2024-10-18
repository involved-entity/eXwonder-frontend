<template>
  <main>
    <div style="border: 15px solid #111; background-color: #272727">
      <div class="h-screen items-center flex justify-center shadow-xl shadow-cyan-500/50">
        <div class="grid grid-cols-1 items-center ps-1">
          <router-link :to="{name: 'home'}" :class="{'inactive': $route.path !== '/'}">
            <button class="flex hover:bg-gray-800 items-center ps-3 pe-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span class="text-gray-300 text-2xl ms-3">Home</span>
            </button>
          </router-link>

          <router-link :to="{name: 'search-user'}" :class="{'inactive': $route.path.name !== 'search-user'}">
            <button class="flex hover:bg-gray-800 items-center ps-3 pe-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <span class="text-gray-300 text-2xl ms-3">Search</span>
            </button>
          </router-link>

          <router-link to="/explore/" :class="{'inactive': $route.path.indexOf('/explore') === -1}">
            <button class="flex hover:bg-gray-800 items-center ps-3 pe-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
              </svg>
              <span class="text-gray-300 text-2xl ms-3">Explore</span>
            </button>
          </router-link>

          <router-link to="/new/" :class="{'inactive': $route.path.indexOf('/new') === -1}">
            <button class="flex hover:bg-gray-800 items-center ps-3 pe-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
              </svg>
              <span class="text-gray-300 text-2xl ms-3">Create</span>
            </button>
          </router-link>

          <router-link :to="'/' + authenticationStore.username + '/'" :class="{'inactive': !($route.name === 'user')}">
            <button class="flex hover:bg-gray-800 items-center ps-3 pe-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              <span class="text-gray-300 text-2xl ms-3">Profile</span>
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import {mapStores} from "pinia";
import {useAuthenticationStore} from "../stores/authenticationStore.js";

export default {
  computed: {
    ...mapStores(useAuthenticationStore)
  }
}
</script>
