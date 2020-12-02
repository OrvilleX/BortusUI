import Vue from "vue";
import Cookie from "js-cookie";
import "normalize.css/normalize.css";
import Element from "element-ui";
import mavonEditor from "mavon-editor";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
}).$mount("#app");
