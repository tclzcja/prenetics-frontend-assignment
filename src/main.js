import 'material-symbols';

import './main.css';

import { createPinia } from 'pinia';
import { createApp } from "vue";

import { createRouter, createWebHistory } from "vue-router";

import App from "./component/App.vue";
import PagePatientManagement from "./component/PagePatientManagement.vue";

navigator.serviceWorker.register("/service-worker.js");

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "Index",
            component: PagePatientManagement
        }
    ]
});
const pinia = createPinia();
const app = createApp(App);

app.use(router).use(pinia).mount("#app");