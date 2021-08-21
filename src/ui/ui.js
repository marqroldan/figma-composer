import Vue from "vue";
import App from "./App.vue";
import store from "./store";

import 'figma-plugin-ds-vue/dist/figma-plugin-ds-vue.css'

new Vue({
	el: "#app",
	store,
	render: h => h(App)
});
