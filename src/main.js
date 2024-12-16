import { createApp } from "vue";
import "./assets/scss/style.scss";
import App from "./App.vue";
import router from "./router/index.ts";
import { createPinia } from "pinia";
import "preline/preline";

const app = createApp(App);

app.use(router).use(createPinia()).mount("#app");
