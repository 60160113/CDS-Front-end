import Vue from "vue";

import DashboardPlugin from "./material-dashboard";

// Plugins
import App from "./App.vue";
import Chartist from "chartist";

import router from "./routes/routes"; // router setup
import store from "./store"; // store setup

Vue.config.productionTip = false;

Vue.use(DashboardPlugin);
// global library setup
Vue.prototype.$Chartist = Chartist;

// axios
import axios from "axios";
Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
