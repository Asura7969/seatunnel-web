import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import "vfonts/Lato.css";
import "vfonts/FiraCode.css";
import "./mock/index";
// import ECharts from "vue-echarts";
// import "echarts";
import {createPinia} from 'pinia'
import "uno.css";
import { InstallCodemirro } from "codemirror-editor-vue3";

const pinia = createPinia()
createApp(App).use(router).use(pinia).use(InstallCodemirro).mount("#app");
