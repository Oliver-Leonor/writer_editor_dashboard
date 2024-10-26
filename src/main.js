import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

import Vue3Quill from "vue3-quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

loadFonts();

const app = createApp(App);

app.use(router);
app.use(store);
app.use(vuetify);
app.use(Vue3Quill);

app.mount("#app");
