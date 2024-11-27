import { createApp } from "vue";
import "./assets/scss/style.scss";
import App from "./App.vue";
import router from "./router/index.ts";
import { createPinia } from "pinia";

const app = createApp(App);

app.use(router).use(createPinia()).mount("#app");
