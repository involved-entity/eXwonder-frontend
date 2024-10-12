<template>
  <main>
    <div class="h-screen items-center flex justify-center">
      <div class="border border-gray-300 rounded-2xl w-2/5" style="background-color: #272727">
        <div class="text-3xl text-center text-gray-300 font-bold mt-1">Login</div>
        <div class="m-3">
          <p class="text-lg ms-1 text-gray-300 inline-block">Username:</p><br>
          <input type="text" placeholder="Your username" class="text-gray-500 bg-gray-custom w-full p-1 outline-none rounded mt-1">
          <p class="text-lg ms-1 text-gray-300 mt-1">Password:</p>
          <input type="password" placeholder="Your password" class="text-gray-500 bg-gray-custom w-full p-1 outline-none rounded mt-1">
          <button
              type="submit"
              class="mt-2 p-1 w-full uppercase font-semibold text-gray-300 rounded bg-violet-900 border border-transparent hover:bg-violet-950 hover:border hover:border-violet-950"
          >Login</button>
        </div>
      </div>
    </div>
  </main>
</template>
