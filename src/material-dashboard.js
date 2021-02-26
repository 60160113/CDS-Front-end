import Notifications from "@/components/NotificationPlugin";
import GlobalComponents from "./globalComponents";
import GlobalDirectives from "./globalDirectives";
import SideBar from "./components/SidebarPlugin";

import VueMaterial from "vue-material";

// asset imports
import "vue-material/dist/vue-material.min.css";
import "./assets/scss/material-dashboard.scss";
import "./assets/scss/material-aos.scss";
import "./assets/css/demo.css";

// library auto imports
import "es6-promise/auto";

export default {
  install(Vue) {
    Vue.use(GlobalComponents);
    Vue.use(GlobalDirectives);
    Vue.use(VueMaterial);
    Vue.use(SideBar);
    Vue.use(Notifications);
  }
};
